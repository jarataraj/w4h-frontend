import { useState } from "react";

import { scaleLinear, scaleThreshold, scaleTime } from "@visx/scale";
import { LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridColumns, GridRows } from "@visx/grid";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ParentSize, withParentSize } from "@visx/responsive";

import { range } from "d3-array";

import { motion } from "framer-motion";

import testData from "../utils/testData";
import decode from "../utils/decodeForecastData";

const TestLine = ({ parentHeight, parentWidth, message }) => {
    console.log(message);
    const data = decode(testData);
    const times = data.map((record) => record.time);
    const temps = data.map((record) => record.temp);
    const tempMin = Math.floor(Math.min(...temps) - 1);
    const tempMax = Math.ceil(Math.max(...temps) + 1);
    const days = times.filter((time) => time.getHours() === 0);
    const hours = times.filter((time) => time.getHours() !== 0);
    const tens = range(Math.ceil(tempMin / 10) * 10, tempMax + 1, 10);
    const twos = range(Math.ceil(tempMin / 2) * 2, tempMax, 2);

    const leftPad = 0;
    const bottomPad = 0;
    const yMax = parentHeight - bottomPad;
    const timeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [leftPad, parentWidth],
    });
    const tempScale = scaleLinear({
        domain: [tempMin, tempMax],
        range: [yMax, 0],
    });
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
    return (
        <svg width={parentWidth} height={200}>
            {data.map((d, i) => {
                return (
                    <Bar
                        key={`bar-${i}`}
                        x={
                            timeScale(d.time) -
                            parentWidth / (data.length - 2) / 2
                        }
                        y={0}
                        width={parentWidth / (data.length - 2) + 1}
                        height={yMax}
                        fill={colorScale(d.temp)}
                    />
                );
            })}
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
};

const ResponsiveTestLine = withParentSize(TestLine);

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
    // ------ Layout and Scale ------
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

    // ====== Animation ======
    const variantsT = {
        daily: {
            scaleX: 1,
            x: 0,
        },
        hourly: {
            scaleX: 5,
        },
    };
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
        // <div style={{ position: "relative" }}>
        //     <svg width={width} height={height}>
        //         <motion.g
        //             className={"group"}
        //             drag={forecastTimescale === "hourly" ? "x" : false}
        //             dragConstraints={{ right: "10px" }}
        //             dragElastic={{ right: 0 }}
        //             style={{ originX: "30px" }}
        //             initial={false}
        //             animate={forecastTimescale}
        //             variants={variantsT}
        //             transition={transition}
        //         >
        //             <motion.g
        //                 onTap={() =>
        //                     setforecastTimescale(
        //                         forecastTimescale === "hourly" ? "daily" : "hourly"
        //                     )
        //                 }
        //             >
        //                 {/* {data.map((d, i) => {
        //                     return (
        //                         <Bar
        //                             key={`bar-${i}`}
        //                             x={
        //                                 timeScale(d.time) -
        //                                 width / (data.length - 2) / 2
        //                             }
        //                             y={0}
        //                             width={width / (data.length - 2) + 1}
        //                             height={yMax}
        //                             fill={colorScale(d.temp)}
        //                         />
        //                     );
        //                 })} */}
        //             </motion.g>
        //         </motion.g>
        //     </svg>
        <motion.div
            className="motionDiv"
            animate={{
                // scaleX: forecastTimescale === "daily" ? 1 : 4,
                width: forecastTimescale === "daily" ? width : width * 4,
            }}
            transition={transition}
            width={forecastTimescale === "daily" ? width : width * 4}
            height="200px"
            // width="200px"
            onClick={() =>
                setforecastTimescale(
                    forecastTimescale === "daily" ? "hourly" : "daily"
                )
            }
            style={{
                border: "1px solid blue",
                position: "absolute",
                top: 0,
            }}
        >
            <ResponsiveTestLine debounceTime={0} message={"message passed"} />
        </motion.div>
        // </div>
    );
};

export default Chart;
