import { AxisLeft } from "@visx/axis";

const ChartLeft = ({
    leftPad,
    topPad,
    bottomPad,
    yHeight,
    chartHeight,
    tempScale,
    tempTwos,
    tempTens,
    minorYLabels,
    thermalIndex,
    units,
}) => {
    return (
        <div
            className="chart-left-container"
            style={{
                width: leftPad,
            }}
        >
            <h4
                className="chart-header chart-header--days"
                style={{ height: topPad + 1 }}
            >
                Day<span className="chart-header-space-fix"></span>:
            </h4>
            <h4
                className="y-title"
                style={{ top: topPad, height: yHeight, width: leftPad }}
            >
                {`${thermalIndex} (\u00B0${units})`}
            </h4>
            <svg
                className="y-axis-and-labels"
                style={{
                    height: chartHeight,
                    width: leftPad,
                }}
            >
                <AxisLeft
                    scale={tempScale}
                    left={leftPad}
                    strokeWidth={1}
                    tickLength={7}
                    tickStroke="#555"
                    tickValues={minorYLabels}
                    tickClassName="y-tick"
                    tickLabelProps={(tick) => {
                        return {
                            className: "y-label",
                        };
                    }}
                    axisLineClassName="temp-axis"
                />
                <AxisLeft
                    scale={tempScale}
                    left={leftPad}
                    strokeWidth={2}
                    tickLength={7}
                    tickStroke="#777"
                    tickValues={tempTens}
                    tickClassName="y-tick"
                    tickLabelProps={(tick) => {
                        return {
                            className: "y-label",
                        };
                    }}
                    axisLineClassName="temp-axis"
                />
            </svg>
            <div
                className="bottom-left-container"
                style={{ height: bottomPad }}
            >
                <h4 className="chart-header chart-header--times" style={{}}>
                    Time<span className="chart-header-space-fix"></span>:
                </h4>
                <h4 className="chart-header chart-header--temps" style={{}}>
                    Temp<span className="chart-header-space-fix"></span>:
                </h4>
            </div>
        </div>
    );
};

export default ChartLeft;
