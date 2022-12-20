// Trying to fix the lag by updating using a callback in animate()

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./LineCharts.css";
// Charting
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridColumns, GridRows } from "@visx/grid";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { range } from "d3-array";
import colorScale from "../utils/colorScale";
// Animation
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Utils
import testData from "../utils/testData";
import decode from "../utils/decodeTempTimes";

// Components
import ForecastHeader from "components/ForecastHeader";
import FixedHorizontalGridlines from "./FixedHorizontalGridlines";
import ScrollableExpandableChartElements from "./ScrollableExpandableChartElements";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import ForecastChartLeftPadContent from "./ForecastChartLeftPadContent";

// Custom Hooks
import useHorizontalScrollCustom from "../hooks/useHorizontalScrollCustom";
import useVisibleOnlyInViewport from "../hooks/useVisibleOnlyInViewport";
import useAncestorVisibleOnlyInViewport from "../hooks/useAncestorVisibleOnlyInViewport";
import useOverlayScrollbarsViewport from "../hooks/useOverlayScrollbarsViewport";
import useLocale from "../hooks/useLocale";

const Forecast = ({ width, height, units, setUnits }) => {
    // ------ Testing ------
    const location = {
        name: "Denver, CO",
        link: "https://www.openstreetmap.org/relation/1411339",
    };
    const data = decode(testData);
    // ====== Hooks ======
    const scrollContainer = useRef(null);
    useHorizontalScrollCustom(scrollContainer);

    const chartViewport = useRef(null);
    useVisibleOnlyInViewport(chartViewport, ".day-label");

    // useVisibleOnlyInViewport(chartViewport, ".experimental-x-tick");

    const locale = useLocale();

    // ====== State ======
    // NEW

    //.scroll({y: `+=${e.deltaY}px`}, 1, 'step-start')

    // ====== Charting ======
    // ------ Data ------
    const times = data.map((record) => record.time);
    const temps = data.map((record) => record.temp);
    const timeTempMap = new Map(
        data.map((record, i) => [
            record.time,
            {
                temp: record.temp,
                position: i / (data.length - 1),
            },
        ])
    );
    const timeTempMap2 = new Map(
        data.map((record, i) => [
            record.time.valueOf(),
            {
                time: record.time,
                temp: record.temp,
                position: i / (data.length - 1),
            },
        ])
    );
    const tempMin = Math.floor((Math.min(...temps) - 1) / 2) * 2;
    const tempMax = Math.ceil((Math.max(...temps) + 1) / 2) * 2;
    const midnights = times.filter((time) => time.getHours() === 0);
    const hours = times.filter((time) => time.getHours() !== 0);
    const tempTicks = range(Math.ceil((tempMin + 1) / 2) * 2, tempMax, 2);
    const tempTwos = tempTicks.filter((n) => n % 10 !== 0);
    const tempTens = tempTicks.filter((n) => n % 10 === 0);
    const getDays = (times) => {
        let i = 0;
        let days = [];
        let start = times[0];
        let end = times[times.length - 1];
        let total = end - start;
        let next = new Date(start);
        next.setDate(next.getDate() + 1);
        next.setHours(0);
        while (next < end) {
            days.push({
                longName: getLongWeekday(start),
                shortName: getShortWeekday(start),
                start,
                period: (100 * (next - start)) / total,
                end: next,
            });
            start = next;
            next = new Date(next);
            next.setDate(next.getDate() + 1);
            i++;
        }
        days.push({
            longName: getLongWeekday(start),
            shortName: getShortWeekday(start),
            start,
            period: (100 * (end - start)) / total,
            end,
        });
        for (let day of days) {
            if (day.start.getHours() === 0 && day.end.getHours() === 0) {
                let temps = data
                    .filter(
                        (tempTime) =>
                            tempTime.time.getDate() === day.start.getDate()
                    )
                    .map((tempTime) => tempTime.temp);
                day.max = Math.max(...temps);
                day.min = Math.min(...temps);
            } else if (day.start.getHours() === 0) {
                let temps = data.filter(
                    (tempTime) =>
                        tempTime.time.getDate() === day.start.getDate()
                );
                let max = temps.reduce((previous, current) => {
                    if (previous.temp > current.temp) return previous;
                    return current;
                });
                let min = temps.reduce((previous, current) => {
                    if (previous.temp < current.temp) return previous;
                    return current;
                });
                if (min.time.getHours() > 0) day.min = min.temp;
                if (
                    max.time.getHours() >= 12 &&
                    max.time.getHours() < day.end.getHours()
                )
                    day.max = max.temp;
            }
        }
        return days;
    };
    const today = new Date(Date.now()).getDate();

    // TODO: use global Intl.DateTimeFormat object
    const getShortWeekday = (date) => {
        if (date.getDate() === today) return "Today";
        const name = new Intl.DateTimeFormat(locale, {
            weekday: "short",
        }).format(date);
        return `${name} ${date.getDate()}`;
    };
    const getLongWeekday = (date) => {
        if (date.getDate() === today) return "Today";
        const name = new Intl.DateTimeFormat(locale, {
            weekday: "long",
        }).format(date);
        return `${name} ${date.getDate()}`;
    };
    const days = getDays(times);

    // ------ Layout and Scale ------

    // OLD
    let dailyXwidth = 5.85 * times.length;
    let hourlyXwidth = 26 * times.length;
    const topPad = 28;
    const leftPad = 60;
    const bottomPad = 56;
    const chartHeight = (tempMax - tempMin) * 7 + topPad + bottomPad;
    const yMin = topPad;
    const yMax = chartHeight - bottomPad;
    const yHeight = yMax - yMin;
    const forecastWidth = Math.min(
        window.document.documentElement.clientWidth,
        800,
        dailyXwidth + leftPad
    );
    const dataViewWidth = forecastWidth - leftPad;
    // Scales
    const tempScale = scaleLinear({
        domain: [tempMin, tempMax],
        range: [yMax, yMin],
    });
    const dailyTimeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [0, dailyXwidth],
    });
    const hourlyTimeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [0, hourlyXwidth],
    });
    // OLD
    const [forecastTimeScale, setForecastTimeScale] = useState("daily");
    const [animatedDataWidth, setAnimatedWidth] = useState(dailyXwidth);
    // NEW

    // ====== Animation ======
    // Transform is state-based due to previous implementation, change to ref eventually
    const sizeToPosition = useRef(null);
    // const [sizeToPosition, setSizeToPosition] = useState(() => (size) => 0);
    const composeSizeToPosition = (
        sizeStart,
        sizeEnd,
        positionStart,
        positionEnd
    ) => {
        sizeToPosition.current = (size) =>
            ((size - sizeStart) * (positionEnd - positionStart)) /
                (sizeEnd - sizeStart) +
            positionStart;
    };
    // Use framer-motion "motion value" so that state can use a getter func to get latest value (see chartTransition.onUpdate)
    const motionWidth = useMotionValue(dailyXwidth);

    const chartTransition = {
        // duration: 0.4,
        type: "spring",
        bounce: 0,
        onUpdate: () => {
            setAnimatedWidth(() => Math.round(motionWidth.get()));
        },
    };

    const getScrollPosition = () => {
        return scrollContainer.current.osInstance().scroll().position.x;
    };
    const scrollTo = (position) => {
        scrollContainer.current.osInstance().getElements().viewport.scrollLeft =
            position;
    };
    useLayoutEffect(() => {
        if (forecastTimeScale === "transitioning" && sizeToPosition.current) {
            scrollTo(Math.round(sizeToPosition.current(animatedDataWidth)));
        }
    });

    // FOR DEBUG:
    // useEffect(() => {
    //     console.log(
    //         `width: ${animatedDataWidth} position: ${
    //             scrollContainer.current.osInstance().getElements().viewport
    //                 .scrollLeft
    //         }, calculated: ${sizeToPosition.current(animatedDataWidth)}, max: ${
    //             scrollContainer.current.osInstance().getElements().viewport
    //                 .scrollLeftMax
    //         }`
    //     );
    // });

    const toggleHourly = (day) => {
        if (forecastTimeScale === "daily") {
            let from = getScrollPosition();
            let to = Math.min(
                hourlyTimeScale(day.start),
                hourlyXwidth - dataViewWidth
            );
            composeSizeToPosition(dailyXwidth, hourlyXwidth, from, to);
            setForecastTimeScale("transitioning");
            animate(motionWidth, hourlyXwidth, {
                ...chartTransition,
                duration: 0.3 + (0.05 * Math.abs(to - from)) / 600,
                onComplete: () =>
                    // needs time for the final update
                    setTimeout(() => setForecastTimeScale("hourly"), 100),
            });
        } else if (forecastTimeScale === "hourly") {
            let from = getScrollPosition();
            composeSizeToPosition(hourlyXwidth, dailyXwidth, from, 0);
            setForecastTimeScale("transitioning");
            animate(motionWidth, dailyXwidth, {
                ...chartTransition,
                duration: 0.3 + (0.05 * Math.abs(0 - from)) / 600,
                onComplete: () =>
                    // needs time for the final update
                    setTimeout(() => setForecastTimeScale("daily"), 100),
            });
        }
    };

    // const viewport = useOverlayScrollbarsViewport(scrollContainer);
    // BUG: doesn't work in Chrome or Edge; seems to be problems with intersection observer and svg elements
    // useVisibleOnlyInViewport(chartViewport, ".time-tick > .visx-line");
    useAncestorVisibleOnlyInViewport(
        chartViewport,
        ".experimental-x-label",
        ".experimental-x-tick",
        forecastTimeScale
    );
    return (
        <>
            <div
                className="forecast-container"
                style={{ width: forecastWidth }}
            >
                <ForecastHeader
                    title={location.name}
                    link={location.link}
                    timeView={forecastTimeScale}
                />
                <div
                    className="forecast-chart-container"
                    ref={chartViewport}
                    style={{ height: chartHeight }}
                >
                    <ForecastChartLeftPadContent
                        topPad={topPad}
                        leftPad={leftPad}
                        bottomPad={bottomPad}
                        yHeight={yHeight}
                        chartHeight={chartHeight}
                        tempScale={tempScale}
                        tempTicks={tempTicks}
                        tempTwos={tempTwos}
                        tempTens={tempTens}
                    />
                    <OverlayScrollbarsComponent
                        options={{
                            overflowBehavior: { y: "hidden" },
                            scrollbars: { clickScrolling: true },
                        }}
                        ref={scrollContainer}
                    >
                        <div
                            className="forecast-scrollable-container"
                            style={{ width: animatedDataWidth }}
                        >
                            <FixedHorizontalGridlines
                                chartHeight={chartHeight}
                                dataViewWidth={dataViewWidth}
                                tempScale={tempScale}
                                tempTwos={tempTwos}
                                tempTens={tempTens}
                                timeView={forecastTimeScale}
                            />
                            <ScrollableExpandableChartElements
                                timeTempMap2={timeTempMap2}
                                timeTempMap={timeTempMap}
                                bottomPad={bottomPad}
                                data={data}
                                chartHeight={chartHeight}
                                dataWidth={animatedDataWidth}
                                yMin={yMin}
                                yMax={yMax}
                                yHeight={yHeight}
                                times={times}
                                tempScale={tempScale}
                                timeView={forecastTimeScale}
                                days={days}
                                toggleHourly={toggleHourly}
                            />
                        </div>
                    </OverlayScrollbarsComponent>
                </div>
            </div>
        </>
    );
};

export default Forecast;
