import { motion } from "framer-motion";

const Xgrid = ({
    timeData,
    bottomPad,
    yHeight,
    forecastTimescale,
    chartHeight,
    tempScale,
}) => {
    return (
        <>
            <div className="x-grid x-grid--midnights">
                {/* ------ Midnights ------ */}
                {Array.from(timeData.values())
                    .slice(1, -1)
                    .filter(({ time }) => time.hour === 0)
                    .map(({ time, position }) => {
                        return (
                            <div
                                key={`midnight-gridline-${time.valueOf()}`}
                                className="x-gridline x-gridline--midnight"
                                style={{
                                    bottom: bottomPad,
                                    left: `${position * 100}%`,
                                    height: yHeight,
                                }}
                            ></div>
                        );
                    })}
            </div>
            {/* ------ Hourly Gridlines ------ */}
            {forecastTimescale === "hourly" && (
                <motion.div
                    className="x-grid x-grid--hourly"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, type: "tween" }}
                >
                    {Array.from(timeData.values())
                        .slice(1, -1)
                        .map(({ time, temp, position }) => {
                            return (
                                <div
                                    key={`hourly-gridline-${time.valueOf()}`}
                                    className="x-gridline x-gridline--hourly"
                                    style={{
                                        bottom: bottomPad,
                                        left: `${position * 100}%`,
                                        height:
                                            chartHeight -
                                            bottomPad -
                                            tempScale(temp),
                                    }}
                                ></div>
                            );
                        })}
                </motion.div>
            )}
            {/* ------ Daily Gridlines ------ */}
            {forecastTimescale === "daily" && (
                <motion.div
                    className="x-grid x-grid--daily"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, type: "tween" }}
                >
                    {Array.from(timeData.values())
                        .slice(1, -1)
                        .filter(({ time }) => {
                            return [0, 6, 12, 18].includes(time.hour);
                        })
                        .map(({ time, temp, position }) => {
                            return (
                                <div
                                    key={`daily-gridline-${time.valueOf()}`}
                                    className="x-gridline x-gridline--daily"
                                    style={{
                                        bottom: bottomPad,
                                        left: `${position * 100}%`,
                                        height:
                                            chartHeight -
                                            bottomPad -
                                            tempScale(temp),
                                    }}
                                ></div>
                            );
                        })}
                </motion.div>
            )}
        </>
    );
};

export default Xgrid;
