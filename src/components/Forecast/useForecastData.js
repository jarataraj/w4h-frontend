import { useMemo } from "react";
import useLocale from "hooks/useLocale";
import { range } from "d3-array";
import { floor, ceiling, isMultipleOf } from "utils/mathUtils";
import {
    colorScales,
    thermalStressCategories,
} from "utils/thermalStressCategories";

const CELCIUS_CONFIG = {
    gridlineSpacing: 2,
    majorGridFactor: 10,
    minorYLabelFactor: 2,
};

const FARENHEIGHT_CONFIG = {
    gridlineSpacing: 2,
    majorGridFactor: 10,
};

const processRawForecastData = (
    data,
    units,
    thermalIndex,
    earliestForecastTime,
    timeZone
) => {
    const presentThermalStressCategories = new Set();
    // plotData = [{time, temp, color}]
    // (serves as [{x, y, color}] in forecasts)
    const plotData = data
        .filter(({ time }) => time >= earliestForecastTime)
        .map((record) => {
            const { time } = record;
            const temp = record[thermalIndex];
            const category = colorScales[thermalIndex](temp);
            presentThermalStressCategories.add(category);
            return {
                time: time.setZone(timeZone),
                temp: units === "C" ? temp : (9 / 5) * temp + 32,
                color: category.color,
            };
        });
    // times = [time]
    const times = plotData.map((record) => record.time);
    // temps = [temp]
    const temps = plotData.map((record) => record.temp);
    const { gridlineSpacing, majorGridFactor, minorYLabelFactor } =
        units === "C" ? CELCIUS_CONFIG : FARENHEIGHT_CONFIG;

    // Add gridline to above or below major gridlines for Farenheight for
    // better visual formating (most importantly, adds whitespace around
    // major gridline label)
    let chartMinGridline = floor(Math.min(...temps), gridlineSpacing);
    if (isMultipleOf(majorGridFactor, chartMinGridline) && units === "F")
        chartMinGridline -= gridlineSpacing;
    let chartMaxGridline = ceiling(Math.max(...temps), gridlineSpacing);
    if (isMultipleOf(majorGridFactor, chartMaxGridline) && units === "F")
        chartMaxGridline += gridlineSpacing;
    //

    const chartMinTemp = chartMinGridline - 0.75 * gridlineSpacing;
    const chartMaxTemp = chartMaxGridline + 0.75 * gridlineSpacing;
    const yGridlines = range(
        ceiling(chartMinTemp + 1, gridlineSpacing),
        chartMaxTemp,
        gridlineSpacing
    );
    const majorYGridlines = yGridlines.filter((n) =>
        isMultipleOf(majorGridFactor, n)
    );
    const minorYGridlines = yGridlines.filter(
        (n) => !isMultipleOf(majorGridFactor, n)
    );
    const minorYLabels = minorYLabelFactor
        ? range(
              ceiling(chartMinTemp + 1, minorYLabelFactor),
              chartMaxTemp,
              minorYLabelFactor
          )
        : [];
    // timeData = Map(time: {time, temp, position, vertex})
    const timeData = new Map(
        plotData.map((record, i) => [
            record.time.valueOf(),
            {
                time: record.time,
                temp: record.temp,
                position: i / (plotData.length - 1),
                vertex: false,
            },
        ])
    );

    // ====== Data organized by day ======
    const getDailyData = () => {
        // REMOVED FEATURE (better to use a line to label current time):
        // const localDate = new Date(Date.now()).getDate();
        // const getDayName = (date) => {
        //     const today = localToday(localDate, date.getDate(), locale);
        //     if (!today) {
        //         const name = new Intl.DateTimeFormat(locale, {
        //             weekday: "short",
        //         }).format(date);
        //         return `${name} ${date.getDate()}`;
        //     } else {
        //         return today;
        //     }
        // };

        // const getDayName = (date) => {
        // const name = new Intl.DateTimeFormat(locale, {
        //     weekday: "short",
        // }).format(date);
        // return `${name} ${date.getDate()}`;
        // };
        // For each day in data, create a record of {name, start, period, end}
        let i = 0;
        let days = [];
        let start = times[0];
        let end = times[times.length - 1];
        let total = end - start;
        // let next = new Date(start);
        // next.setDate(next.getDate() + 1);
        // next.setHours(0);
        let next = start.plus({ days: 1 }).startOf("day");
        while (next < end) {
            days.push({
                // name: getDayName(start),
                name: start.toLocaleString({
                    weekday: "short",
                    day: "numeric",
                }),
                start,
                period: (100 * (next - start)) / total,
                end: next,
            });
            start = next;
            // next = new Date(next);
            // next.setDate(next.getDate() + 1);
            next = next.plus({ days: 1 });
            i++;
        }
        days.push({
            // name: getDayName(start),
            name: start.toLocaleString({
                weekday: "short",
                day: "numeric",
            }),
            start,
            period: (100 * (end - start)) / total,
            end,
        });

        // ------ Daily Min and Max ------
        // add {min, max} to each day record where the day is complete and
        // mark time of min/max with {vertex: "min" or "max"} in timeData
        for (let day of days) {
            if (day.start.hour === 0 && day.end.hour === 0) {
                // plotData = [{time, temp, color}]
                let dayData = plotData.filter(
                    ({ time }) => time.ordinal === day.start.ordinal
                );
                let max = dayData.reduce((previous, current) => {
                    if (previous.temp > current.temp) return previous;
                    return current;
                });
                let min = dayData.reduce((previous, current) => {
                    if (previous.temp < current.temp) return previous;
                    return current;
                });
                day.min = min.temp;
                day.max = max.temp;
                timeData.set(min.time.valueOf(), {
                    ...timeData.get(min.time.valueOf()),
                    vertex: "min",
                });
                timeData.set(max.time.valueOf(), {
                    ...timeData.get(max.time.valueOf()),
                    vertex: "max",
                });
            }
        }
        // days = [{name, start, period, end, min?, max?}]
        return days;
    };
    const days = getDailyData();
    const categories = Array.from(presentThermalStressCategories.values()).sort(
        (a, b) => a.index - b.index
    );

    return {
        times,
        days,
        timeData,
        plotData,
        yGridlines,
        majorYGridlines,
        minorYGridlines,
        minorYLabels,
        chartMinTemp,
        chartMaxTemp,
        categories,
    };
};

const useForecastData = (
    decodedRawForecastData,
    units,
    thermalIndex,
    earliestForecastTime,
    timeZone
) => {
    const locale = useLocale();
    const forecastData = useMemo(() => {
        return processRawForecastData(
            decodedRawForecastData,
            units,
            thermalIndex,
            earliestForecastTime,
            timeZone
        );
    }, [
        decodedRawForecastData,
        units,
        thermalIndex,
        // earliest forecast time calculated outside of useForecastData so
        // that if it changes, the forecast data changes
        earliestForecastTime,
        timeZone,
    ]);
    return forecastData;
};

export default useForecastData;
