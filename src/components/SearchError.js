import { BiError } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import useMeasureOnMount from "hooks/useMeasureOnMount";

const SearchError = ({ message, originBox }) => {
    const error = useRef();
    const errorRect = useMeasureOnMount(error);
    const offset = 5;
    const animation = useRef();

    // NEW
    if (!animation.current) {
        const scrollHeight = window.scrollY;
        const originHeight = originBox.current.getBoundingClientRect().top;
        const buffer = 50;
        // Animate entrance from bottom if scroll position is too high
        if (scrollHeight > originHeight - buffer) {
            animation.current = {
                initial: { bottom: 0 },
                animate: {
                    bottom: errorRect ? -1 * (errorRect.height + offset) : -30,
                },
            };
        } else {
            animation.current = {
                initial: { top: 0 },
                animate: {
                    top: errorRect ? -1 * (errorRect.height + offset) : -30,
                },
            };
        }
    }

    // Animation
    const transition = {
        default: { type: "spring", duration: 0.5, bounce: 0.5 },
        opacity: { type: "tween", duration: 1.5 },
    };
    let initial = { top: 0 };
    let animate = { top: errorRect ? -1 * (errorRect.height + offset) : -30 };
    // const exit = { opacity: 0 };

    return (
        <motion.div
            className="search-error"
            ref={error}
            transition={transition}
            initial={animation.initial}
            animate={animation.animate}
        >
            <BiError className="search-error-icon" />
            <p className="search-error-text">{message}</p>
        </motion.div>
    );
};

export default SearchError;
