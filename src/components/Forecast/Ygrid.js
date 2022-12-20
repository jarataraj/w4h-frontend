import { GridRows } from "@visx/grid";

const Ygrid = ({
    chartHeight,
    dataViewWidth,
    tempScale,
    tempTwos,
    tempTens,
}) => {
    return (
        <svg
            className="y-grid"
            style={{
                height: chartHeight,
                width: dataViewWidth,
            }}
        >
            <GridRows
                scale={tempScale}
                width={dataViewWidth}
                tickValues={tempTwos}
                // stroke="#888"
                stroke="#666"
                strokeWidth={1}
                strokeDasharray="1, 2"
            />
            <GridRows
                scale={tempScale}
                width={dataViewWidth}
                tickValues={tempTens}
                // stroke="#909090"
                stroke="#6f6f6f"
                strokeWidth={2}
                strokeDasharray="3, 4"
            />
        </svg>
    );
};

export default Ygrid;
