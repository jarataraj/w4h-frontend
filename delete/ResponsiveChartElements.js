import { GridColumns } from "@visx/grid";
import { AxisBottom, AxisTop } from "@visx/axis";
import { Bar, LinePath } from "@visx/shape";
import { withParentSize } from "@visx/responsive";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime } from "@visx/scale";

import colorScale from "../utils/colorScale";

const ResponsiveChartElements = ({
    parentWidth,
    data,
    yMax,
    yHeight,
    topPad,
    leftPad,
    times,
    tempScale,
    timeView,
    days,
    height,
}) => {
    const timeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [leftPad, parentWidth],
    });
    return (
        <>
            <svg
                className="backgroundXgridXaxis"
                width={parentWidth}
                style={{ height: height }}
            >
                {data.map((d, i) => {
                    return (
                        <Bar
                            key={`bar-${i}`}
                            x={
                                timeScale(d.time) -
                                parentWidth / (data.length - 2) / 2
                            }
                            y={topPad}
                            width={parentWidth / (data.length - 2) + 1}
                            height={yHeight}
                            fill={colorScale(d.temp)}
                        />
                    );
                })}
                <GridColumns
                    scale={timeScale}
                    height={yHeight}
                    top={topPad}
                    tickValues={days}
                    stroke={timeView === "daily" ? "#888" : "#999"}
                    strokeWidth={timeView === "daily" ? 1 : 2}
                    strokeDasharray={timeView === "daily" ? "5,3" : "8,7"}
                    style={{
                        vectorEffect: "non-scaling-stroke",
                    }}
                />
                <AxisTop
                    scale={timeScale}
                    tickValues={days}
                    top={topPad}
                    tickLineProps={{
                        vectorEffect: "non-scaling-stroke",
                    }}
                />
                <AxisBottom
                    scale={timeScale}
                    tickValues={days}
                    top={yMax}
                    tickLineProps={{
                        vectorEffect: "non-scaling-stroke",
                    }}
                />
                {/* <LinePath
                    curve={curveMonotoneX}
                    stroke="#ddddddaa"
                    strokeWidth="8px"
                    data={data}
                    x={(d) => timeScale(d.time)}
                    y={(d) => tempScale(d.temp)}
                /> */}
            </svg>
            <svg
                className="line"
                width={parentWidth}
                style={{ height: height }}
            >
                {/* <LinePath
                    curve={curveMonotoneX}
                    stroke="#fff"
                    strokeWidth="3px"
                    data={data}
                    x={(d) => timeScale(d.time)}
                    y={(d) => tempScale(d.temp)}
                /> */}
                <LinePath
                    curve={curveMonotoneX}
                    stroke="#444"
                    strokeWidth="2px"
                    data={data}
                    x={(d) => timeScale(d.time)}
                    y={(d) => tempScale(d.temp)}
                />
            </svg>
        </>
    );
};

export default withParentSize(ResponsiveChartElements);
