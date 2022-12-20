import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
const ButtonSwitch = ({
    name,
    title,
    onClick,
    className,
    animationDelay,
    animationDuration,
}) => {
    const transition = {
        duration: animationDuration ?? 0,
        type: "tween",
    };
    return (
        <button
            className={`button-switch ${className}`}
            title={title}
            onClick={onClick}
        >
            <AnimatePresence>
                <motion.div
                    className="button-switch-label"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: {
                            ...transition,
                            delay: animationDelay ?? 0,
                        },
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            ...transition,
                            delay: 0,
                        },
                    }}
                    key={name}
                >
                    {name}
                </motion.div>

                {/* {forecastTimescale === "hourly" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, type: "tween" }}
                >
                    daily
                </motion.div>
            )}
            {forecastTimescale === "daily" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, type: "tween" }}
                >
                    hourly
                </motion.div>
            )} */}
            </AnimatePresence>
        </button>
    );
};

export default ButtonSwitch;
