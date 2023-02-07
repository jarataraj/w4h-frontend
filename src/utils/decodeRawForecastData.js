// TODO: ensure sort on backend rather than front, add WBGT to data pipeline and remove temp
const decodeRawForecastData = (data) => {
    const start = new Date(data.forecastStart);
    const oneHour = 1000 * 60 * 60;
    return data.tempTimesEncoded
        .map((tempTime) => {
            return {
                time: new Date(start.getTime() + (tempTime % 120) * oneHour),
                UTCI: (Math.floor(tempTime / 120) % 2000) / 10 - 100,
                WBGT: Math.floor(Math.floor(tempTime / 120) / 2000) / 10 - 100,
            };
        })
        .sort(
            (tempTimeA, tempTimeB) =>
                tempTimeA.time.getTime() - tempTimeB.time.getTime()
        );
};

export default decodeRawForecastData;
