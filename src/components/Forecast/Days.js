import { useRef } from "react";
import useHideIfOverflowing from "hooks/useHideIfOverflowing";

const Days = ({
    dataWidth,
    chartHeight,
    scrollbarBuffer,
    days,
    toggleHourly,
    yMin,
    forecastTimescale,
    yHeight,
}) => {
    // ENHANCEMENT: create dependency on hourly vs daily
    const firstDay = useRef(null);
    const lastDay = useRef(null);
    useHideIfOverflowing(firstDay);
    useHideIfOverflowing(lastDay);

    return (
        <div
            className="forecast-days"
            style={{
                width: dataWidth,
                height: chartHeight - scrollbarBuffer,
            }}
        >
            {days.map((day, i) => {
                return (
                    <div
                        key={`${day.start}`}
                        className="forecast-day"
                        style={{
                            width: `${day.period}%`,
                            height: chartHeight - scrollbarBuffer,
                        }}
                        onClick={() => {
                            toggleHourly(day);
                        }}
                    >
                        <h5
                            className="day-label"
                            ref={
                                i === 0
                                    ? firstDay
                                    : i === days.length - 1
                                    ? lastDay
                                    : undefined
                            }
                            style={{
                                height: yMin,
                            }}
                        >
                            {day.name}
                        </h5>
                        <div
                            className={`forecast-day-filter ${forecastTimescale}`}
                            style={{
                                height: yHeight,
                                top: yMin,
                            }}
                        ></div>
                    </div>
                );
            })}
        </div>
    );
};

export default Days;
