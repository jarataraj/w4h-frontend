import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";

const DataLine = ({ dataWidth, chartHeight, data, timeScale, tempScale }) => {
    return (
        <svg
            className="forecast-data-line"
            style={{ width: dataWidth, height: chartHeight }}
        >
            <LinePath
                curve={curveMonotoneX}
                stroke="#333"
                strokeWidth="2px"
                data={data}
                x={(d) => timeScale(d.time)}
                y={(d) => tempScale(d.temp)}
            />
        </svg>
    );
};

export default DataLine;
