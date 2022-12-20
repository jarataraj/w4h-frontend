import { AnimatePresence, motion } from "framer-motion";

const Key = ({ showKey, values, forecastWidth }) => {
    return (
        <AnimatePresence>
            {showKey && (
                <motion.div
                    className="forecast-key-container"
                    inital={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.4, type: "tween" }}
                    style={{ margin: forecastWidth === "100%" ? 0 : "0 4px" }}
                >
                    <div className="forecast-key">
                        {values.map((value) => {
                            return (
                                <div
                                    className="forecast-key-category"
                                    key={value.color}
                                    style={{
                                        backgroundColor: value.color,
                                    }}
                                >
                                    <h4 className="forecast-key-category-label">
                                        {value.category}
                                    </h4>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Key;
