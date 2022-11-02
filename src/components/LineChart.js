// Trying to fix the lag by updating using a callback in animate()

import { useState } from "react";
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

import testData from "../utils/testData";
import decode from "../utils/decodeTempTimes";
import ResponsiveChartElements from "./ResponsiveChartElements2";

const Chart = ({ width, height }) => {
    // ====== State ======
    const [timeView, setTimeView] = useState("daily");
    const [animateWidth, setAnimateWidth] = useState(width);
    // const [animateXpos, setAnimateXpos] = useState();

    // ====== Charting ======
    // ------ Data ------
    const data = decode(testData);
    const times = data.map((record) => record.time);
    const temps = data.map((record) => record.temp);
    const tempMin = Math.floor(Math.min(...temps) - 1);
    const tempMax = Math.ceil(Math.max(...temps) + 1);
    const midnights = times.filter((time) => time.getHours() === 0);
    const hours = times.filter((time) => time.getHours() !== 0);
    const tens = range(Math.ceil(tempMin / 10) * 10, tempMax + 1, 10);
    const twos = range(Math.ceil(tempMin / 2) * 2, tempMax, 2).filter(
        (n) => n % 10 !== 0
    );
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
            }
        }
        return days;
    };
    const today = new Date(Date.now()).getDate();
    const getShortWeekday = (date) => {
        if (date.getDate() === today) return "Today";
        const name = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
        }).format(date);
        return `${name} ${date.getDate()}`;
    };
    const getLongWeekday = (date) => {
        if (date.getDate() === today) return "Today";
        const name = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
        }).format(date);
        return `${name} ${date.getDate()}`;
    };
    const days = getDays(times);

    // ------ Layout and Scale ------
    const hourlyScale = 5;
    const topPad = 30;
    const leftPad = 50;
    const bottomPad = 30;
    const yMax = height - bottomPad;
    const yHeight = yMax - topPad;
    const timeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [leftPad, width],
    });
    const tempScale = scaleLinear({
        domain: [tempMin, tempMax],
        range: [yMax, topPad],
    });
    const hourlyTimeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [leftPad, width * 2],
    });

    // ====== Animation ======

    const [slideTransform, setSlideTransform] = useState(() => () => 0);
    const composeTransform = (scaleStart, scaleEnd, xStart, xEnd) => {
        return (x) =>
            ((x - scaleStart) * (xEnd - xStart)) / (scaleEnd - scaleStart) +
            xStart;
    };
    const mvWidth = useMotionValue(width);
    //const mvXposition = useTransform(mvWidth, slideTransform);

    const transition = {
        duration: 0.4,
        type: "spring",
        bounce: 0,
        onUpdate: () => {
            setAnimateWidth(() => mvWidth.get());
            //setAnimateXpos(() => animateXpos.get());
        },
    };

    return (
        <>
            <div className="chartViewport" style={{ width: width }}>
                <svg
                    className="tempGridlines"
                    style={{ height: height, width: width }}
                >
                    <GridRows
                        scale={tempScale}
                        width={width}
                        tickValues={twos}
                        stroke={timeView === "daily" ? "#aaa" : "#afafaf"}
                        strokeWidth={1}
                        strokeDasharray="1, 2"
                        style={{
                            vectorEffect: "non-scaling-stroke",
                        }}
                    />
                    <GridRows
                        scale={tempScale}
                        width={width}
                        tickValues={tens}
                        stroke="#aaa"
                        strokeWidth={2}
                        strokeDasharray="3, 4"
                        style={{
                            vectorEffect: "non-scaling-stroke",
                        }}
                    />
                </svg>
                <div className="xLabels" style={{ height: height }}></div>
                <svg
                    className="yAxisAndLabels"
                    style={{ height: height, width: width }}
                >
                    <rect width={leftPad} height={height} fill="#f7f5f7" />
                    <AxisLeft
                        scale={tempScale}
                        left={leftPad}
                        numTicks={10}
                        strokeWidth={2}
                        tickLength={6}
                        tickStroke="#555"
                        tickValues={undefined}
                        tickClassName="yLabels"
                        // tickLabelProps={() => {
                        //     return { fontFamily: "monospace" };
                        // }}
                    />
                </svg>
                <motion.div
                    className="responsiveSVGChartElements"
                    style={{
                        position: "absolute",
                        top: 0,
                        height: height,
                        boxSizing: "border-box",
                        width: animateWidth,
                        left: slideTransform(animateWidth),
                    }}
                    // onPan={(e, panData) => {
                    //     console.log(panData.delta);
                    // }}
                    // onPanEnd={(e) => {
                    //     e.stopPropagation();
                    // }}
                >
                    <div
                        className="hoverHitBoxes"
                        style={{ paddingLeft: leftPad }}
                    >
                        {days.map((day) => {
                            return (
                                <motion.div
                                    key={`${day.start}`}
                                    className="hoverHitBox"
                                    onTap={() => {
                                        if (timeView === "daily") {
                                            setSlideTransform(() => {
                                                return composeTransform(
                                                    400,
                                                    800,
                                                    0,
                                                    -hourlyTimeScale(
                                                        day.start
                                                    ) + leftPad
                                                    // width,
                                                    // width * 4,
                                                    // mvXposition.get(),
                                                    // timeScale(day.start)
                                                );
                                            });
                                            setTimeView("hourly");
                                            animate(
                                                mvWidth,
                                                mvWidth.get() * 2,
                                                transition
                                            );
                                        } else {
                                            setSlideTransform(() => {
                                                return composeTransform(
                                                    800,
                                                    400,
                                                    -hourlyTimeScale(
                                                        day.start
                                                    ) + leftPad,
                                                    0
                                                    // width,
                                                    // width * 4,
                                                    // mvXposition.get(),
                                                    // timeScale(day.start)
                                                );
                                            });
                                            setTimeView("daily");
                                            animate(mvWidth, width, transition);
                                        }
                                    }}
                                    style={{ width: `${day.period}%` }}
                                ></motion.div>
                            );
                        })}
                    </div>
                    <ResponsiveChartElements
                        animateWidth={animateWidth}
                        data={data}
                        yMax={yMax}
                        yHeight={yHeight}
                        topPad={topPad}
                        leftPad={leftPad}
                        times={times}
                        tempScale={tempScale}
                        timeView={timeView}
                        days={midnights}
                        height={height}
                    />
                </motion.div>
            </div>
        </>
    );
};

export default Chart;
