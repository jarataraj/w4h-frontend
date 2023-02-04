import { AnimatePresence, motion } from "framer-motion";
import { thermalStressCategories } from "utils/thermalStressCategories";
import "./vertical-key.css";

const VerticalKey = ({ showKey }) => {
    const utciKey = [
        ["#e43a20", "extreme heat", "#000"],
        ["#f27946", "very strong heat", "#000"],
        ["#fcad6e", "strong heat", "#000"],
        ["#ffde98", "moderate heat", "#000"],
        ["#b3e8b6", "no thermal stress", "#000"],
        ["#75cdd6", "slight cold", "#000"],
        ["#5aadde", "moderate cold", "#000"],
        ["#468de0", "strong cold", "#fff"],
        ["#306cde", "very strong cold", "#fff"],
        ["#004adb", "extreme cold", "#fff"],
    ];
    return (
        <AnimatePresence>
            {showKey && (
                <motion.div
                    className="global-chart-vertical-key-container"
                    initial={{ marginLeft: -82 }}
                    animate={{ marginLeft: 3 }}
                    exit={{ marginLeft: -82 }}
                    transition={{
                        duration: 0.5,
                        type: "tween",
                    }}
                >
                    <div className="global-chart-vertical-key">
                        {utciKey.map(([color, label, textColor]) => {
                            return (
                                <div
                                    className="global-chart-key-category"
                                    key={color}
                                    style={{
                                        backgroundColor: color,
                                    }}
                                >
                                    <h4
                                        className="global-chart-key-category-label"
                                        style={{ color: textColor }}
                                    >
                                        {label}
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

export default VerticalKey;
