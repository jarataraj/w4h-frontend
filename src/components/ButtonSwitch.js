import { AnimatePresence, motion } from "framer-motion";
const ButtonSwitch = ({
    name,
    title,
    onClick,
    className,
    animationDelay,
    animationDuration,
    crossOut,
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
            style={{ overflow: "hidden" }}
        >
            <AnimatePresence>
                {crossOut && (
                    <motion.svg
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
                        style={{ zIndex: 1000, width: "100%", height: "100%" }}
                    >
                        <line x1="0" y1="0%" x2="100%" y2="100%" />
                    </motion.svg>
                )}
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
            </AnimatePresence>
        </button>
    );
};

export default ButtonSwitch;
