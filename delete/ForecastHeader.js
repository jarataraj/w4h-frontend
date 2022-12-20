import { BsPin, BsPinFill } from "react-icons/bs";
import { IoMapOutline, IoMap } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ForecastHeader = ({ title, link, timeView }) => {
    return (
        <div className="forecast-header">
            <h2 className="forecast-location">{title}</h2>
            <div className="forecast-header-buttons">
                <button className="pin-button" title="Pin Forecast">
                    <BsPin className="pin-icon" />
                    <BsPinFill className="pin-icon--hovered" />
                </button>
                <button className="map-button" title="Show On Map">
                    <a href={link}>
                        <IoMapOutline className="map-icon" />
                        <IoMap className="map-icon--hovered" />
                    </a>
                </button>
                <button
                    className="time-view-button"
                    title={`View ${
                        timeView === "daily" ? "Hourly" : "Daily"
                    } Forecast`}
                >
                    <AnimatePresence>
                        {timeView === "hourly" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, type: "tween" }}
                            >
                                daily
                            </motion.div>
                        )}
                        {timeView === "daily" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, type: "tween" }}
                            >
                                hourly
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );
};

export default ForecastHeader;
