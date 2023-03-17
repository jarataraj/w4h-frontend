import { DateTime } from "luxon";

// TODO: ensure sort on backend rather than front
const decodeRawForecastData = (data) => {
    const start = DateTime.fromISO(data.forecastStart);
    // returns [{time: naive, UTCI, WBGT}]
    return data.tempTimesEncoded
        .map((tempTime) => {
            return {
                time: start.plus({ hours: tempTime % 200 }),
                UTCI: (Math.floor(tempTime / 200) % 2000) / 10 - 100,
                WBGT: Math.floor(Math.floor(tempTime / 200) / 2000) / 10 - 100,
            };
        })
        .sort((tempTimeA, tempTimeB) => tempTimeA.time - tempTimeB.time);
};

export default decodeRawForecastData;
