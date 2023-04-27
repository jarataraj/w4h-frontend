import { useRef } from "react";
import { ImArrowDown2, ImArrowUp2 } from "react-icons/im";
import useAncestorVisibleOnlyInViewport from "hooks/useAncestorVisibleOnlyInViewport";
import useVisibleOnlyInViewport from "hooks/useVisibleOnlyInViewport";
import useRemoveIfOverflowsAncestor from "hooks/useRemoveIfOverflowsAncestor";
import { DateTime } from "luxon";

const Xticks = ({
    location,
    forecastTimescale,
    chartHeight,
    bottomPad,
    days,
    timeData,
    yMax,
    chartMiddleViewport,
}) => {
    // ------ Remove Chart-Middle-Full Overflow ------
    // Removes elements that fully or partly exist outside of the
    // boundaries of chart-middle-full, and therefore incorrectly extend
    // the scrollable area
    const xTicksContainer = useRef(null);
    const firstTime = useRef(null);
    const lastTime = useRef(null);
    // Effect dependencies include location (really location.name as simple
    // identifier) so that effects take place when chart data changes due
    // to changing location)
    useRemoveIfOverflowsAncestor(firstTime, xTicksContainer, [
        forecastTimescale,
        location,
    ]);
    useRemoveIfOverflowsAncestor(lastTime, xTicksContainer, [
        forecastTimescale,
        location,
    ]);
    // ------

    useAncestorVisibleOnlyInViewport(
        // ^ NOTE: didn't work in Chrome or Edge when used on SVG elements;
        // seems to be problems with intersection observer and svg elements
        chartMiddleViewport,
        ".x-tick-hitbox",
        ".x-tick",
        [forecastTimescale, location]
    );
    useVisibleOnlyInViewport(
        chartMiddleViewport,
        ".x-label--min, .x-label--max",
        [forecastTimescale, location]
    );

    return (
        <>
            {/* ------ Hourly X Ticks ------ */}
            {forecastTimescale === "hourly" && (
                <div className="x-ticks x-ticks--hourly">
                    {Array.from(timeData.values())
                        .slice(1, -1)
                        .map(({ time, temp, position, vertex }) => {
                            return (
                                <div
                                    key={`hourly-x-tick-${time.valueOf()}`}
                                    className="x-tick x-tick--hourly"
                                    style={{
                                        left: `${position * 100}%`,
                                        top: chartHeight - bottomPad,
                                    }}
                                >
                                    <div
                                        className={`x-tick-hitbox x-labels-container ${
                                            vertex
                                                ? `x-labels-container--${vertex}`
                                                : ""
                                        }`}
                                    >
                                        <div className="x-label x-label--time">
                                            {/* {((time.hour + 11) % 12) + 1} */}
                                            {
                                                time
                                                    .toLocaleString({
                                                        hour: "numeric",
                                                    })
                                                    .match(/^(\d{1,2})/)[0]
                                            }
                                        </div>
                                        <div className="x-label x-label--temp">
                                            {Math.round(temp)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
            {/* ------ Daily X Ticks ------ */}
            {forecastTimescale === "daily" && (
                <div
                    className="x-ticks x-ticks--daily-times"
                    ref={xTicksContainer}
                >
                    {Array.from(timeData.values())
                        .slice(1, -1)
                        .filter(({ time }) => {
                            return [0, 6, 12, 18].includes(time.hour);
                        })
                        .map(({ time, position }, i, array) => {
                            return (
                                <div
                                    key={`daily-x-tick-${time.valueOf()}`}
                                    className="x-tick"
                                    style={{
                                        left: `${position * 100}%`,
                                        top: chartHeight - bottomPad,
                                    }}
                                >
                                    <div
                                        className="x-label x-tick-hitbox"
                                        ref={
                                            i === 0
                                                ? firstTime
                                                : i === array.length - 1
                                                ? lastTime
                                                : undefined
                                        }
                                    >
                                        {time
                                            .toLocaleString({
                                                hour: "numeric",
                                            })
                                            .match(
                                                /^(\d+)[^a-zA-Z]*([a-zA-Z])?/
                                            )
                                            .slice(1)
                                            .join("")
                                            .toLowerCase()}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
            {/* ------ Min/Max Temp Labels ------ */}
            {forecastTimescale === "daily" && (
                <div className="x-ticks x-ticks--min-max">
                    {days
                        // filter for days that have a min (and by extension, a max)
                        .filter((day) => day.min)
                        .map((day) => {
                            return (
                                <div
                                    key={`min-max-x-tick-${day.start.toISODate()}`}
                                    className="min-max-labels-container"
                                    style={{
                                        top: yMax + 24.6,
                                        left: `${
                                            timeData.get(day.start.valueOf())
                                                .position * 100
                                        }%`,
                                        width: `${day.period}%`,
                                    }}
                                >
                                    <div className="x-label--min">
                                        <ImArrowDown2 />
                                        {Math.round(day.min)}
                                    </div>
                                    <div className="x-label--max">
                                        <ImArrowUp2 />
                                        {Math.round(day.max)}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </>
    );
};

export default Xticks;
