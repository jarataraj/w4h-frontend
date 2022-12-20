import { BiError } from "react-icons/bi";
import { usePrevious } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";

const Error = ({ message, originBox }) => {
    const previousMessage = usePrevious(message);
    const transition = { type: "spring", duration: 10, bounce: 1 };
    const exit = { opacity: 0 };
    let initial = { top: 0 };
    let animate = { top: -20 };

    if (message === null) {
        return null;
        // if previous message === null animate new error entrance
    } else if (previousMessage === null) {
        // Animate entrance from bottom if scroll position is too high
        if (originBox.current) {
            const scrollHeight = window.scrollY;
            const originHeight = originBox.current.getBoundingClientRect().top;
            console.log("scroll: ", scrollHeight, " top: ", originHeight);
            const buffer = 50;
            if (scrollHeight > originHeight - buffer) {
                initial = { bottom: 0 };
                animate = { bottom: -20 };
            }
        }
        return (
            <AnimatePresence>
                <motion.div
                    className="search-error"
                    transition={transition}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                >
                    <BiError className="search-error-icon" />
                    <p className="search-error-text">{message}</p>
                </motion.div>
            </AnimatePresence>
        );
    } else {
        // if previous message not null (error already exists) simply change the message
        return (
            <AnimatePresence>
                <motion.div className="search-error" exit={exit}>
                    <BiError className="search-error-icon" />
                    <p className="search-error-text">{message}</p>
                </motion.div>
            </AnimatePresence>
        );
    }
};

export default Error;
