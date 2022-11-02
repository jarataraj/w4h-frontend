import { AxisLeft } from "@visx/axis";

const ForecastChartLeftPadContent = ({
    leftPad,
    topPad,
    bottomPad,
    yHeight,
    chartHeight,
    tempScale,
    tempTwos,
    tempTens,
}) => {
    return (
        <div
            className="forecast-left-pad-content-container"
            style={{
                width: leftPad,
            }}
        >
            <h4
                className="days-header chart-header"
                style={{ height: topPad + 1.5 }}
            >
                Day<span className="chart-header-space-fix"></span>:
            </h4>
            <h4
                className="temp-units"
                style={{ top: topPad, height: yHeight, width: leftPad }}
            >
                &#176;C
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
                    tickValues={tempTwos}
                    tickClassName="temp-tick"
                    tickLabelProps={(tick) => {
                        return {
                            className: "temp-label",
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
                    tickClassName="temp-tick"
                    tickLabelProps={(tick) => {
                        return {
                            className: "temp-label",
                        };
                    }}
                    axisLineClassName="temp-axis"
                />
            </svg>
            <div
                className="bottom-left-container"
                style={{ height: bottomPad }}
            >
                <h4 className="times-header chart-header" style={{}}>
                    Time<span className="chart-header-space-fix"></span>:
                </h4>
                <h4 className="temps-header chart-header" style={{}}>
                    Temp<span className="chart-header-space-fix"></span>:
                </h4>
            </div>
        </div>
    );
};

export default ForecastChartLeftPadContent;
