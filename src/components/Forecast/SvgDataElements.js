import DataBackground from "./DataBackground";
import DataLine from "./DataLine";
import { scaleTime } from "@visx/scale";

const SvgDataElements = ({
    dataWidth,
    chartHeight,
    data,
    yMin,
    yHeight,
    tempScale,
    colorScale,
    times,
}) => {
    const timeScale = scaleTime({
        domain: [times[0], times[times.length - 1]],
        range: [0, dataWidth],
    });
    return (
        <>
            <DataBackground
                dataWidth={dataWidth}
                chartHeight={chartHeight}
                data={data}
                yMin={yMin}
                yHeight={yHeight}
                timeScale={timeScale}
                colorScale={colorScale}
            />
            <DataLine
                dataWidth={dataWidth}
                chartHeight={chartHeight}
                data={data}
                timeScale={timeScale}
                tempScale={tempScale}
            />
        </>
    );
};

export default SvgDataElements;
