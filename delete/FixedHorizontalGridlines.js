import { GridRows } from "@visx/grid";

const FixedHorizontalGridlines = ({
    chartHeight,
    dataViewWidth,
    tempScale,
    tempTwos,
    tempTens,
}) => {
    return (
        <svg
            className="forecast-temp-grid"
            style={{
                height: chartHeight,
                width: dataViewWidth,
            }}
        >
            <GridRows
                scale={tempScale}
                width={dataViewWidth}
                tickValues={tempTwos}
                stroke="#888"
                strokeWidth={1}
                strokeDasharray="1, 2"
            />
            <GridRows
                scale={tempScale}
                width={dataViewWidth}
                tickValues={tempTens}
                stroke="#909090"
                strokeWidth={2}
                strokeDasharray="3, 4"
            />
        </svg>
    );
};

export default FixedHorizontalGridlines;
