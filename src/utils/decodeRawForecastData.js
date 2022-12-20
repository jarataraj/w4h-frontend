// TODO: ensure sort on backend rather than front, add WBGT to data pipeline and remove temp
const decodeRawForecastData = (data) => {
    const start = new Date(data.forecastStart);
    return data.tempTimesEncoded
        .map((tempTime) => {
            return {
                time: new Date(
                    start.getTime() + (tempTime % 1000) * 1000 * 60 * 60
                ),
                UTCI: Math.floor(tempTime / 1000) / 100 - 100,
                WBGT: Math.floor(tempTime / 1000) / 100 - 100,
                temp: Math.floor(tempTime / 1000) / 100 - 100,
            };
        })
        .sort(
            (tempTimeA, tempTimeB) =>
                tempTimeA.time.getTime() - tempTimeB.time.getTime()
        );
};

export default decodeRawForecastData;
