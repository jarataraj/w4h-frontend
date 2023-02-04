import ColorBar from "components/ColorBar";
import { AnimatePresence, motion } from "framer-motion";
import { thermalStressCategories } from "utils/thermalStressCategories";
import "./horizontal-key.css";

const HorizontalKey = ({ showKey }) => {
    const utciKey = [
        ["#b3e8b6", "no thermal stress", "#000"],
        ["#ffde98", "moderate heat", "#000"],
        ["#fcad6e", "strong heat", "#000"],
        ["#f27946", "very strong heat", "#000"],
        ["#e43a20", "extreme heat", "#000"],
        ["#75cdd6", "slight cold", "#000"],
        ["#5aadde", "moderate cold", "#000"],
        ["#468de0", "strong cold", "#fff"],
        ["#306cde", "very strong cold", "#fff"],
        ["#004adb", "extreme cold", "#fff"],
    ];
    const utciKey2 = [
        ["#306cde", "very strong cold", "#fff"],
        ["#5aadde", "moderate cold", "#fff"],
        ["#b3e8b6", "no thermal stress", "#000"],
        ["#fcad6e", "strong heat", "#000"],
        ["#e43a20", "extreme heat", "#000"],
        ["#004adb", "extreme cold", "#fff"],
        ["#468de0", "strong cold", "#fff"],
        ["#75cdd6", "slight cold", "#000"],
        ["#ffde98", "moderate heat", "#000"],
        ["#f27946", "very strong heat", "#000"],
    ];
    const utciKey3 = [
        ["#004adb", "extreme cold", "#fff"],
        ["#306cde", "very strong cold", "#fff"],
        ["#468de0", "strong cold", "#fff"],
        ["#5aadde", "moderate cold", "#000"],
        ["#75cdd6", "slight cold", "#000"],
        ["#b3e8b6", "no thermal stress", "#000"],
        ["#ffde98", "moderate heat", "#000"],
        ["#fcad6e", "strong heat", "#000"],
        ["#f27946", "very strong heat", "#000"],
        ["#e43a20", "extreme heat", "#000"],
    ];
    const colors = [
        "#004adb",
        "#306cde",
        "#468de0",
        "#5aadde",
        "#75cdd6",
        "#b3e8b6",
        "#ffde98",
        "#fcad6e",
        "#f27946",
        "#e43a20",
    ];
    return (
        <AnimatePresence>
            {showKey && (
                <motion.div
                    className="global-chart-horizontal-key-container"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{
                        duration: 0.4,
                        type: "tween",
                        ease: "easeOut",
                    }}
                    style={{}}
                >
                    <div className="global-chart-key">
                        <div className="global-chart-key-row">
                            {utciKey3.map(([color, label, textColor]) => {
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
                        {/* <div className="global-chart-key-row">
                            {utciKey2
                                .slice(0, 5)
                                .map(([color, label, textColor]) => {
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
                        <div className="global-chart-key-row">
                            {colors.map((color) => {
                                return (
                                    <div
                                        className="global-chart-key-category"
                                        key={color}
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                        <div className="global-chart-key-row">
                            {utciKey2
                                .slice(5, 10)
                                .map(([color, label, textColor]) => {
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
                        </div> */}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HorizontalKey;
