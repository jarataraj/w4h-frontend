import { useState } from "react";

import { scaleLinear, scaleThreshold, scaleTime } from "@visx/scale";
import { LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridColumns, GridRows } from "@visx/grid";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ParentSize } from "@visx/responsive";

import { range } from "d3-array";

import { motion } from "framer-motion";

import testData from "../utils/testData";
import decode from "../utils/decodeForecastData";

const Chart = ({ width, height }) => {
    const [forecastTimescale, setforecastTimescale] = useState("daily");

    // ====== Charting ======
    // ------ Data ------
    const data = decode(testData);
    const times = data.map((record) => record.time);
    const temps = data.map((record) => record.temp);
    const tempMin = Math.floor(Math.min(...temps) - 1);
    const tempMax = Math.ceil(Math.max(...temps) + 1);
    const days = times.filter((time) => time.getHours() === 0);
    const hours = times.filter((time) => time.getHours() !== 0);
    const tens = range(Math.ceil(tempMin / 10) * 10, tempMax + 1, 10);
    const twos = range(Math.ceil(tempMin / 2) * 2, tempMax, 2);
    // ------ Layout and Scale ------

    const softColors = [
        "#306cde",
        "#004adb",
        "#468de0",
        "#5aadde",
        "#75cdd6",
        "#b3e8b6",
        "#ffde98",
        "#fcad6e",
        "#f27946",
        "#e43a20",
    ];
    const hardColors = [
        "#0000ff",
        "#4752ef",
        "#5d7fdf",
        "#6da7cf",
        "#83cdc0",
        "#aeeeb2",
        "#ffde98",
        "#ffae6b",
        "#ff763c",
        "#ff0000",
    ];
    const colorScale = scaleThreshold({
        domain: [-40, -27, -13, 0, 9, 26, 32, 38, 46],
        range: softColors,
    });

    // ====== Animation ======
    const variants = {
        daily: {
            width: width * 4,
        },
        hourly: {
            width: width / 4,
        },
    };
    const transition = {
        duration: 0.5,
        type: "spring",
        bounce: 0,
    };

    return (
        <motion.div
            className="motionDiv"
            animate={{
                width: forecastTimescale === "daily" ? width : width * 4,
            }}
            transition={transition}
            // width={forecastTimescale === "daily" ? width : width * 4}
            height={height}
            onClick={() =>
                setforecastTimescale(
                    forecastTimescale === "daily" ? "hourly" : "daily"
                )
            }
            style={{ border: "1px solid red", justifySelf: "left" }}
        >
            <ParentSize debounceTime={0} enableDebounceLeadingCall={false}>
                {({ width, height, top, left, ref, resize }) => {
                    const leftPad = 0;
                    const bottomPad = 0;
                    const yMax = height - bottomPad;
                    const timeScale = scaleTime({
                        domain: [times[0], times[times.length - 1]],
                        range: [leftPad, width],
                    });
                    const tempScale = scaleLinear({
                        domain: [tempMin, tempMax],
                        range: [yMax, 0],
                    });

                    return (
                        <svg width={width} height={200}>
                            <LinePath
                                curve={curveMonotoneX}
                                stroke="#666"
                                strokeWidth="5px"
                                data={data}
                                x={(d) => timeScale(d.time)}
                                y={(d) => tempScale(d.temp)}
                                xScale={timeScale}
                                yScale={tempScale}
                            />
                        </svg>
                    );
                }}
            </ParentSize>
        </motion.div>

        /* <svg width={width} height={height}>
                <motion.g
                    className={"group"}
                    drag={forecastTimescale === "hourly" ? "x" : false}
                    dragConstraints={{ right: "10px" }}
                    dragElastic={{ right: 0 }}
                    style={{ originX: "30px" }}
                    initial={false}
                    animate={forecastTimescale}
                    variants={variants}
                    transition={transition}
                >
                    <motion.g
                        onTap={() =>
                            setforecastTimescale(
                                forecastTimescale === "hourly" ? "daily" : "hourly"
                            )
                        }
                    >
                        {data.map((d, i) => {
                            return (
                                <Bar
                                    key={`bar-${i}`}
                                    x={
                                        timeScale(d.time) -
                                        width / (data.length - 2) / 2
                                    }
                                    y={0}
                                    width={width / (data.length - 2) + 1}
                                    height={yMax}
                                    fill={colorScale(d.temp)}
                                />
                            );
                        })}
                        <GridColumns
                            scale={timeScale}
                            height={yMax}
                            tickValues={days}
                            stroke="#555"
                            strokeWidth={1}
                            strokeDasharray="5,3"
                            style={{
                                vectorEffect: "non-scaling-stroke",
                            }}
                        />
                        <GridRows
                            scale={tempScale}
                            width={width}
                            tickValues={tens}
                            stroke="#777"
                            strokeWidth={1}
                            style={{
                                vectorEffect: "non-scaling-stroke",
                            }}
                        />
                        <GridRows
                            scale={tempScale}
                            width={width}
                            tickValues={twos}
                            stroke="#777"
                            strokeWidth={1}
                            strokeDasharray="1,2"
                            style={{
                                vectorEffect: "non-scaling-stroke",
                            }}
                        />
                        <LinePath
                            curve={curveMonotoneX}
                            stroke="#666"
                            strokeWidth="5px"
                            data={data}
                            x={(d) => timeScale(d.time)}
                            y={(d) => tempScale(d.temp)}
                            xScale={timeScale}
                            yScale={tempScale}
                        />
                        <LinePath
                            curve={curveMonotoneX}
                            stroke="#fff"
                            strokeWidth="3px"
                            data={data}
                            x={(d) => timeScale(d.time)}
                            y={(d) => tempScale(d.temp)}
                            xScale={timeScale}
                        />
                        <AxisBottom
                            scale={timeScale}
                            tickValues={days}
                            top={yMax}
                            tickLineProps={{
                                vectorEffect: "non-scaling-stroke",
                            }}
                        />
                    </motion.g>
                </motion.g>
                <rect width={leftPad} height={height} fill="#fff" />
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
            </svg> */
    );
};

export default Chart;
