// Attempt to fix lag by using callback in framer-motion animate()
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { GridColumns } from "@visx/grid";
import { AxisBottom, AxisTop } from "@visx/axis";
import { Bar, LinePath } from "@visx/shape";
import { withParentSize } from "@visx/responsive";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime } from "@visx/scale";
import { Group } from "@visx/group";
import useHideOverflowed from "../hooks/useHideIfOverflowing";
import { ImArrowDown2, ImArrowUp2 } from "react-icons/im";

import colorScale from "../utils/colorScale";

const ScrollableExpandableChartElements = ({
    timeTempMap2,
    timeTempMap,
    bottomPad,
    data,
    dataWidth,
    chartHeight,
    yMin,
    yMax,
    yHeight,
    times,
    tempScale,
    timeView,
    days,
    height,
    toggleHourly,
}) => {
    const timeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [0, dataWidth],
    });
    const hideOverflowed = useRef(null);
    useHideOverflowed(hideOverflowed);
    const scrollbarBuffer = 13;

    // TODO: remove first and last of vertical grid, tick, and label

    return (
        <>
            <div
                className="forecast-scrollable-expandable-container"
                style={{ width: dataWidth, height: chartHeight }}
            >
                {/* ====== Color Coded Background ====== */}
                <svg
                    className="forecast-data-background"
                    style={{ width: dataWidth, height: chartHeight }}
                >
                    <Group className="forecast-chart-background">
                        {data.map((d, i) => {
                            return (
                                <Bar
                                    key={`bar-${i}`}
                                    x={
                                        timeScale(d.time) -
                                        dataWidth / (data.length - 2) / 2
                                    }
                                    y={yMin}
                                    width={dataWidth / (data.length - 2) + 1}
                                    height={yHeight}
                                    fill={colorScale(d.temp)}
                                />
                            );
                        })}
                    </Group>
                </svg>
                {/* ====== Vertical Grid ====== */}
                {/* ------ Midnights ------ */}
                {Array.from(timeTempMap.entries())
                    .slice(1, -1)
                    .filter(([time]) => time.getHours() === 0)
                    .map(([time, { temp, position }]) => {
                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: bottomPad,
                                    left: `${position * 100}%`,
                                    height: yHeight,
                                    borderLeft: "1px solid #222",
                                    marginLeft: -0.5,
                                }}
                            ></div>
                        );
                    })}
                {/* ------ Hourly Gridlines ------ */}
                {timeView === "hourly" && (
                    <motion.div
                        className="experimental-time-grid"
                        style={{ width: dataWidth, height: chartHeight }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, type: "tween" }}
                    >
                        {Array.from(timeTempMap.entries())
                            .slice(1, -1)
                            .map(([time, { temp, position }]) => {
                                return (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: bottomPad,
                                            left: `${position * 100}%`,
                                            height:
                                                chartHeight -
                                                bottomPad -
                                                tempScale(temp),
                                            borderLeft: "1px dotted #111",
                                        }}
                                    ></div>
                                );
                            })}
                    </motion.div>
                )}
                {/* ------ Daily Gridlines ------ */}
                {timeView === "daily" && (
                    <motion.div
                        className="experimental-time-grid"
                        style={{ width: dataWidth, height: chartHeight }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, type: "tween" }}
                    >
                        {Array.from(timeTempMap.entries())
                            .slice(1, -1)
                            .filter(([time, { temp, position }]) => {
                                let hour = time.getHours();
                                return (
                                    hour === 0 ||
                                    hour === 6 ||
                                    hour === 12 ||
                                    hour === 18
                                );
                            })
                            .map(([time, { temp, position }]) => {
                                return (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: bottomPad,
                                            left: `${position * 100}%`,
                                            height:
                                                chartHeight -
                                                bottomPad -
                                                tempScale(temp),
                                            borderLeft: "1px dotted #000",
                                        }}
                                    ></div>
                                );
                            })}
                    </motion.div>
                )}
                {/* ------ Hourly X Ticks ------ */}
                {timeView === "hourly" && (
                    <div
                        className="experimental-time-grid x-ticks"
                        style={{ width: dataWidth, height: chartHeight }}
                    >
                        {Array.from(timeTempMap.entries())
                            .slice(1, -1)
                            .map(([time, { temp, position }]) => {
                                return (
                                    <div
                                        className="experimental-x-tick"
                                        style={{
                                            position: "absolute",
                                            left: `${position * 100}%`,
                                            top: chartHeight - bottomPad,
                                            display: "flex",
                                            flexFlow: "column",
                                            overflow: "visible",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div className="experimental-x-label">
                                            {((time.getHours() + 11) % 12) + 1}
                                        </div>
                                        <div className="experimental-x-label">
                                            {Math.round(temp)}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
                {/* ------ Daily X Ticks ------ */}
                {timeView === "daily" && (
                    <div
                        className="experimental-time-grid x-ticks"
                        style={{ width: dataWidth, height: chartHeight }}
                    >
                        {Array.from(timeTempMap.entries())
                            .slice(1, -1)
                            .filter(([time, { temp, position }]) => {
                                let hour = time.getHours();
                                return (
                                    hour === 0 ||
                                    hour === 6 ||
                                    hour === 12 ||
                                    hour === 18
                                );
                            })
                            .map(([time, { temp, position }]) => {
                                return (
                                    <div
                                        className="experimental-x-tick"
                                        style={{
                                            position: "absolute",
                                            left: `${position * 100}%`,
                                            top: chartHeight - bottomPad,
                                            display: "flex",
                                            flexFlow: "column",
                                            overflow: "visible",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div className="experimental-x-label">
                                            {`${
                                                ((time.getHours() + 11) % 12) +
                                                1
                                            }${
                                                time.getHours() < 12 ? "a" : "p"
                                            }`}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
                {/* ------ Min/Max Temp Labels ------ */}
                {timeView === "daily" &&
                    days
                        .filter((day) => day.min)
                        .map((day) => {
                            return (
                                <motion.div
                                    className="min-max-temps-container"
                                    style={{
                                        position: "absolute",
                                        top: yMax + 24.6,
                                        left: `${
                                            timeTempMap2.get(
                                                day.start.valueOf()
                                            ).position * 100
                                        }%`,
                                        width: `${day.period}%`,
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.2,
                                        type: "tween",
                                    }}
                                >
                                    <div className="min-label">
                                        <ImArrowDown2 />
                                        {Math.round(day.min)}
                                    </div>
                                    <div className="max-label">
                                        <ImArrowUp2 />
                                        {Math.round(day.max)}
                                    </div>
                                </motion.div>
                            );
                        })}

                {/* X AXIS */}
                {/* For some reason need to use motion.div rather than motion.svg for opacity transitions */}
                {/* {timeView === "hourly" && (
                    <motion.svg
                        className="forecast-hourly-x-axis"
                        style={{ width: dataWidth, height: chartHeight }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, type: "tween" }}
                    >
                        <AxisBottom
                            className="time-labels"
                            scale={timeScale}
                            left={0}
                            top={yMax - 1}
                            strokeWidth={1}
                            tickLength={5}
                            tickStroke="#555"
                            tickValues={times.slice(1)}
                            tickClassName="time-tick"
                            tickLabelProps={(tick) => {
                                return {
                                    className: "time-label",
                                };
                            }}
                            axisLineClassName="time-axis"
                            tickFormat={(time) =>
                                ((time.getHours() + 11) % 12) + 1
                            }
                        />
                    </motion.svg>
                )}
                {timeView === "daily" && (
                    <motion.svg
                        className="forecast-daily-x-axis"
                        style={{ width: dataWidth, height: chartHeight }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, type: "tween" }}
                    >
                        <AxisBottom
                            className="time-labels"
                            scale={timeScale}
                            left={0}
                            top={yMax - 1}
                            strokeWidth={1}
                            tickLength={5}
                            tickStroke="#555"
                            tickValues={times.slice(1).filter((time) => {
                                let hour = time.getHours();
                                return (
                                    hour === 0 ||
                                    hour === 6 ||
                                    hour === 12 ||
                                    hour === 18
                                );
                            })}
                            tickClassName="time-tick"
                            tickLabelProps={(tick) => {
                                return {
                                    className: "time-label",
                                };
                            }}
                            axisLineClassName="time-axis"
                            tickFormat={(time) =>
                                ((time.getHours() + 11) % 12) +
                                1 +
                                (time.getHours() < 12 ? "a" : "p")
                            }
                        />
                    </motion.svg>
                )} */}

                {/* <motion.div
                    style={{ display: "flex" }}
                    initial={{ opacity: 0 }}
                    animate={timeView}
                    variants={{
                        hourly: {
                            opacity: 1,
                            transition: {
                                duration: 0.15,
                                type: "tween",
                            },
                        },
                        daily: {
                            opacity: 0,
                            transition: { duration: 0 },
                        },
                        transitioning: {
                            opacity: 0,
                            transition: { duration: 0 },
                        },
                    }}
                >
                    <svg
                        className="forecast-hourly-x-axis"
                        style={{ width: dataWidth, height: chartHeight }}
                    >
                        <AxisBottom
                            className="time-labels"
                            scale={timeScale}
                            left={0}
                            top={yMax - 1}
                            strokeWidth={1}
                            tickLength={5}
                            tickStroke="#555"
                            tickValues={times.slice(1)}
                            tickClassName="time-tick"
                            tickLabelProps={(tick) => {
                                return {
                                    className: "time-label",
                                };
                            }}
                            axisLineClassName="time-axis"
                            tickFormat={(time) =>
                                ((time.getHours() + 11) % 12) + 1
                            }
                        />
                    </svg>
                </motion.div>
                <motion.div
                    style={{ display: "flex" }}
                    initial={{ opacity: 0 }}
                    animate={timeView}
                    variants={{
                        daily: {
                            opacity: 1,
                            transition: {
                                duration: 0.15,
                                type: "tween",
                            },
                        },
                        hourly: {
                            opacity: 0,
                            transition: { duration: 0 },
                        },
                        transitioning: {
                            opacity: 0,
                            transition: { duration: 0 },
                        },
                    }}
                >
                    <svg
                        className="forecast-daily-x-axis"
                        style={{ width: dataWidth, height: chartHeight }}
                    >
                        <AxisBottom
                            className="time-labels"
                            scale={timeScale}
                            left={0}
                            top={yMax - 1}
                            strokeWidth={1}
                            tickLength={5}
                            tickStroke="#555"
                            tickValues={times.slice(1).filter((time) => {
                                let hour = time.getHours();
                                return (
                                    hour === 0 ||
                                    hour === 6 ||
                                    hour === 12 ||
                                    hour === 18
                                );
                            })}
                            tickClassName="time-tick"
                            tickLabelProps={(tick) => {
                                return {
                                    className: "time-label",
                                };
                            }}
                            axisLineClassName="time-axis"
                            tickFormat={(time) =>
                                ((time.getHours() + 11) % 12) +
                                1 +
                                (time.getHours() < 12 ? "a" : "p")
                            }
                        />
                    </svg>
                </motion.div> */}
                <svg
                    className="forecast-data-line"
                    style={{ width: dataWidth, height: chartHeight }}
                >
                    <LinePath
                        curve={curveMonotoneX}
                        stroke="#444"
                        strokeWidth="2px"
                        data={data}
                        x={(d) => timeScale(d.time)}
                        y={(d) => tempScale(d.temp)}
                    />
                </svg>
                <div
                    className="forecast-days"
                    style={{
                        width: dataWidth,
                        height: chartHeight - scrollbarBuffer,
                    }}
                >
                    {days.map((day, i) => {
                        return (
                            <div
                                key={`${day.start}`}
                                className="forecast-day"
                                style={{
                                    width: `${day.period}%`,
                                    height: chartHeight - scrollbarBuffer,
                                    display: "flex",
                                    position: "relative",
                                }}
                                onClick={() => {
                                    toggleHourly(day);
                                }}
                            >
                                <h5
                                    className="day-label"
                                    ref={i === 0 ? hideOverflowed : undefined}
                                    style={{
                                        height: yMin,
                                    }}
                                >
                                    {day.shortName}
                                </h5>
                                <div
                                    className={`forecast-day-filter ${timeView}`}
                                    style={{
                                        width: "100%",
                                        height: yHeight,
                                        position: "absolute",
                                        top: yMin,
                                        right: 0,
                                    }}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ScrollableExpandableChartElements;
