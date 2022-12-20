import { Bar } from "@visx/shape";
import { Group } from "@visx/group";

// For testing (see bottom of page)
// import { thermalStressCategories } from "utils/thermalStressCategories";

const DataBackground = ({
    dataWidth,
    chartHeight,
    data,
    yMin,
    yHeight,
    timeScale,
}) => {
    const firstHour = data[0];
    const lastHour = data[data.length - 1];
    const overExtension = 5;
    return (
        <svg
            className="forecast-data-background"
            style={{ width: dataWidth, height: chartHeight }}
        >
            <Group className="forecast-chart-background">
                <Bar
                    className="first-bar"
                    key={`bar-0`}
                    x={
                        timeScale(firstHour.time) -
                        dataWidth / (data.length - 2) / 2 -
                        overExtension
                    }
                    // -5 to overextend for blurred background
                    y={yMin - 5}
                    width={dataWidth / (data.length - 2) + 1 + overExtension}
                    // + 10 to overextend for blurred background
                    height={yHeight + 10}
                    fill={firstHour.color}
                />
                {data.slice(1, -1).map((record, i) => {
                    return (
                        <Bar
                            key={`bar-${i}`}
                            x={
                                timeScale(record.time) -
                                dataWidth / (data.length - 2) / 2
                            }
                            // -5 to overextend for blurred background
                            y={yMin - 5}
                            width={dataWidth / (data.length - 2) + 1}
                            // + 10 to overextend for blurred background
                            height={yHeight + 10}
                            fill={record.color}
                        />
                    );
                })}
                <Bar
                    key={`bar-${data.length - 1}`}
                    x={
                        timeScale(lastHour.time) -
                        dataWidth / (data.length - 2) / 2
                    }
                    // -5 to overextend for blurred background
                    y={yMin - 5}
                    width={dataWidth / (data.length - 2) + 1 + overExtension}
                    // + 10 to overextend for blurred background
                    height={yHeight + 10}
                    fill={lastHour.color}
                />
            </Group>
        </svg>
    );

    // FOR TESTING COLOR PALETTES
    // return (
    //     <div
    //         style={{
    //             height: chartHeight,
    //             width: dataWidth,
    //             display: "flex",
    //             alignItems: "stretch",
    //             position: "absolute",
    //             top: 0,
    //         }}
    //     >
    //         {thermalStressCategories.WBGT.map((cat) => cat.color).map(
    //             (color) => {
    //                 return (
    //                     <div
    //                         key={color}
    //                         style={{
    //                             backgroundColor: color,
    //                             flexGrow: 1,
    //                             width: 1,
    //                         }}
    //                     ></div>
    //                 );
    //             }
    //         )}
    //     </div>
    // );
};

export default DataBackground;
