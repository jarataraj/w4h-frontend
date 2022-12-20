const decodeForecastData = (data) => {
    const start = new Date(data.forecastStart);
    return data.tempTimesEncoded
        .map((tempTime) => {
            return {
                time: new Date(
                    start.getTime() + (tempTime % 1000) * 1000 * 60 * 60
                ),
                temp: Math.floor(tempTime / 1000) / 100 - 100,
            };
        })
        .sort(
            (tempTimeA, tempTimeB) =>
                tempTimeA.time.getTime() - tempTimeB.time.getTime()
        );
};

export default decodeForecastData;
