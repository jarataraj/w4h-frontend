import {
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useContext,
} from "react";
import { useResizeObserver, useScrollIntoView } from "@mantine/hooks";
import { AppNewlyMountedContext } from "App";

// Charting
import { scaleLinear, scaleTime } from "@visx/scale";

// Animation
import {
    motion,
    useMotionValue,
    animate,
    AnimatePresence,
} from "framer-motion";

// Components
import ForecastHeader from "./ForecastHeader";
import ChartLeft from "./ChartLeft";
import SvgDataElements from "./SvgDataElements";
import Ygrid from "./Ygrid";
import Xgrid from "./Xgrid";
import Xticks from "./Xticks";
import Days from "./Days";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Key from "./Key";
import ForecastFooter from "./ForecastFooter";

// Custom Hooks
import useOverlayScrollbarsViewport from "hooks/useOverlayScrollbarsViewport";
import useOverlayScrollbarsHorizontalScroll from "hooks/useOverlayScrollbarsHorizontalScroll";
// import useHorizontalScroll from "hooks/useHorizontalScroll";
import useVisibleOnlyInViewport from "hooks/useVisibleOnlyInViewport";
import useForecastData from "./useForecastData";
import useBinaryState from "hooks/useBinaryState";

const Forecast = ({
    forecasts,
    setForecasts,
    units,
    toggleUnits,
    thermalIndex,
    toggleThermalIndex,
    location,
    data,
}) => {
    // ====== State  ======
    const appIsNewlyMounted = useContext(AppNewlyMountedContext);
    const scrollContainer = useRef(null);
    const [showKey, toggleShowKey] = useBinaryState([false, true]);
    const [alert, setAlert] = useState(null);
    const newAlert = (message) => {
        if (alert) {
            clearTimeout(alert.timeout);
        }
        const timeout = setTimeout(() => {
            setAlert(null);
        }, 400);
        setAlert({ message, timeout });
    };
    const [forecastWidthProvider, forecastWidthProviderRect] =
        useResizeObserver();

    // |||||| CHARTING ||||||
    // ====== Data ======
    let {
        times,
        days,
        timeData,
        plotData,
        yGridlines,
        majorYGridlines,
        minorYGridlines,
        minorYLabels,
        chartMinTemp,
        chartMaxTemp,
        categories,
    } = useForecastData(data, units, thermalIndex);

    // ====== Layout and Scale ======
    // ------ Layout ------
    let dailyXwidth = 5.85 * times.length;
    let hourlyXwidth = 26 * times.length;
    const topPad = 28;
    // Need the extra leftPad for double digit negative numbers
    const leftPad = 62;
    const bottomPad = 60;
    const scrollbarBuffer = 13;
    const chartBorderWidth = 1;
    const chartHeight =
        (chartMaxTemp - chartMinTemp) * (units === "C" ? 8 : 5) +
        topPad +
        bottomPad;
    const yMin = topPad;
    const yMax = chartHeight - bottomPad;
    const yHeight = yMax - yMin;
    // Border-box width
    const forecastMaxWidth = dailyXwidth + leftPad + 2 * chartBorderWidth;
    const forecastWidth =
        forecastWidthProviderRect &&
        forecastWidthProviderRect.width < forecastMaxWidth
            ? "100%" // %-based allows smoother responsiveness
            : forecastMaxWidth;

    const dataViewWidth =
        forecastWidth === "100%"
            ? forecastWidthProviderRect.width - leftPad - 2 * chartBorderWidth
            : forecastMaxWidth - leftPad - 2 * chartBorderWidth;

    // ------ Scales ------
    const tempScale = scaleLinear({
        domain: [chartMinTemp, chartMaxTemp],
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
    const [forecastTimescale, setforecastTimescale] = useState("daily");

    // |||||| ANIMATION ||||||
    // ====== Animation State ======
    const [animatedDataWidth, setAnimatedWidth] = useState(dailyXwidth);
    const sizeToPosition = useRef(null);
    // Use framer-motion "motion value" so that state can use a getter
    // function to get latest value (see chartTransition.onUpdate)
    const motionWidth = useMotionValue(dailyXwidth);

    // ====== forecastTimescale Transformation ======
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
        if (forecastTimescale === "transitioning" && sizeToPosition.current) {
            scrollTo(Math.round(sizeToPosition.current(animatedDataWidth)));
        }
    });

    // ENHANCEMENT: remove chart expand/contract animation jitter by using
    // position and width based on whole pixel numbers and a virtual
    // transformation origin, rather than the linear relationship between
    // width and position which results in jitter due to pixel rounding

    // FOR DEBUG (for debugging animation jitter):
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
        if (forecastTimescale === "daily") {
            let from = getScrollPosition();
            let to = day
                ? Math.min(
                      hourlyTimeScale(day.start),
                      hourlyXwidth - dataViewWidth
                  )
                : 0;
            composeSizeToPosition(dailyXwidth, hourlyXwidth, from, to);
            setforecastTimescale("transitioning");
            animate(motionWidth, hourlyXwidth, {
                ...chartTransition,
                duration: 0.3 + (0.05 * Math.abs(to - from)) / 600,
                onComplete: () =>
                    // needs time for the final update
                    setTimeout(() => setforecastTimescale("hourly"), 100),
            });
        } else if (forecastTimescale === "hourly") {
            let from = getScrollPosition();
            composeSizeToPosition(hourlyXwidth, dailyXwidth, from, 0);
            setforecastTimescale("transitioning");
            animate(motionWidth, dailyXwidth, {
                ...chartTransition,
                duration: 0.3 + (0.05 * Math.abs(0 - from)) / 600,
                onComplete: () =>
                    // needs time for the final update
                    setTimeout(() => setforecastTimescale("daily"), 100),
            });
        }
    };

    // |||||| EFFECT HOOKS ||||||
    // ENHANCEMENT: spring-animated wheel scrolling in any browser. Set a
    // scroll target and animate, update target and animation based on
    // current velocity when wheel events fired while not finished
    // scrolling. Aim for the look of useHorizontalScroll in Firefox

    const chartMiddleViewport = useOverlayScrollbarsViewport(scrollContainer);
    // useHorizontalScroll(chartMiddleViewport);
    // ^ Janky in Chrome, better animation than useOverlayScrollbarsHorizontalScroll in Firefox
    useOverlayScrollbarsHorizontalScroll(scrollContainer);
    useVisibleOnlyInViewport(chartMiddleViewport, ".day-label");
    const { scrollIntoView, targetRef } = useScrollIntoView({
        duration: 800,
        cancelable: true,
    });
    useEffect(() => {
        if (!location.isPinned) {
            scrollIntoView({ alignment: "center" });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {/* TODO: change forecast-width-provider to forecast-animated-container.
            Refactor out reliance on forecastWidthProviderRect / useResizeObserver. 
            Just do {maxWidth: forecastMaxWidth, width: 100%} on forecast-container */}
            <motion.div
                className="forecast-width-provider"
                ref={forecastWidthProvider}
                initial={{
                    height: 0,
                    marginBottom: 0,
                }}
                animate={{
                    height: "auto",
                    marginBottom: "4.5em",
                }}
                exit={{
                    height: 0,
                    marginBottom: 0,
                }}
                transition={{ duration: appIsNewlyMounted ? 0 : 0.7 }}
            >
                <div
                    className="forecast-container"
                    ref={targetRef}
                    key="static"
                    style={{ width: forecastWidth, maxWidth: forecastMaxWidth }}
                >
                    <ForecastHeader
                        forecasts={forecasts}
                        setForecasts={setForecasts}
                        location={location}
                        showKey={showKey}
                        toggleShowKey={toggleShowKey}
                        newAlert={newAlert}
                    />
                    <div
                        className="forecast-chart-container"
                        style={{
                            height: chartHeight,
                            borderRadius:
                                forecastWidth === "100%" ? "0" : "6px",
                        }}
                        // ref={targetRef}
                    >
                        <ChartLeft
                            topPad={topPad}
                            leftPad={leftPad}
                            bottomPad={bottomPad}
                            yHeight={yHeight}
                            chartHeight={chartHeight}
                            tempScale={tempScale}
                            tempTwos={minorYGridlines}
                            tempTens={majorYGridlines}
                            minorYLabels={minorYLabels}
                            thermalIndex={thermalIndex}
                            units={units}
                        />
                        <AnimatePresence>
                            {alert && (
                                <motion.div
                                    className="forecast-alert-container"
                                    style={{
                                        top: topPad,
                                        left: leftPad,
                                        height: yHeight,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    transition={{
                                        type: "tween",
                                        ease: "easeIn",
                                        duration: 1.2,
                                    }}
                                >
                                    <h4 className="forecast-alert-message">
                                        {alert.message}
                                    </h4>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <OverlayScrollbarsComponent
                            className="chart-middle-viewport"
                            options={{
                                overflowBehavior: { y: "hidden" },
                                scrollbars: { clickScrolling: true },
                            }}
                            ref={scrollContainer}
                        >
                            <div
                                className="chart-middle-full"
                                style={{
                                    width: animatedDataWidth,
                                    height: chartHeight,
                                }}
                            >
                                {/* TODO: refactor the effect of experimental topPad and bottomPad backgrounds
                                 (i.e. sharp cutoff to blurred colored background) */}
                                <div
                                    className="topPad-background"
                                    style={{
                                        height: topPad,
                                    }}
                                ></div>
                                <div
                                    className="bottomPad-background"
                                    style={{
                                        height: bottomPad,
                                    }}
                                ></div>
                                <Ygrid
                                    chartHeight={chartHeight}
                                    dataViewWidth={dataViewWidth}
                                    tempScale={tempScale}
                                    tempTwos={minorYGridlines}
                                    tempTens={majorYGridlines}
                                    forecastTimescale={forecastTimescale}
                                />
                                <SvgDataElements
                                    dataWidth={animatedDataWidth}
                                    chartHeight={chartHeight}
                                    data={plotData}
                                    yMin={yMin}
                                    yHeight={yHeight}
                                    tempScale={tempScale}
                                    times={times}
                                />
                                <Xgrid
                                    timeData={timeData}
                                    bottomPad={bottomPad}
                                    yHeight={yHeight}
                                    forecastTimescale={forecastTimescale}
                                    chartHeight={chartHeight}
                                    tempScale={tempScale}
                                />
                                <Xticks
                                    forecastTimescale={forecastTimescale}
                                    chartHeight={chartHeight}
                                    bottomPad={bottomPad}
                                    days={days}
                                    timeData={timeData}
                                    yMax={yMax}
                                    chartMiddleViewport={chartMiddleViewport}
                                />
                                <Days
                                    dataWidth={animatedDataWidth}
                                    chartHeight={chartHeight}
                                    scrollbarBuffer={scrollbarBuffer}
                                    days={days}
                                    toggleHourly={toggleHourly}
                                    yMin={yMin}
                                    forecastTimescale={forecastTimescale}
                                    yHeight={yHeight}
                                />
                            </div>
                        </OverlayScrollbarsComponent>
                    </div>
                    <Key
                        showKey={showKey}
                        values={categories}
                        forecastWidth={forecastWidth}
                    />
                    <ForecastFooter
                        forecastTimescale={forecastTimescale}
                        units={units}
                        toggleUnits={toggleUnits}
                        thermalIndex={thermalIndex}
                        toggleThermalIndex={toggleThermalIndex}
                        toggleHourly={toggleHourly}
                    />
                </div>
            </motion.div>
        </>
    );
};

export default Forecast;
