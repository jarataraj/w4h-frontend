import { BiError } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

const Error = ({ error, originBox, setError }) => {
    const errorRef = useRef();
    const originHeight = originBox.current.getBoundingClientRect().top;
    const buffer = 100;
    const [animate, setAnimate] = useState();
    const initialPosition = useRef(
        originHeight > buffer ? { top: 0 } : { bottom: 0 }
    );
    const transition = { type: "spring", duration: 0.5, bounce: 0.3 };

    // ------ Determine and set position to animate to ------
    useLayoutEffect(() => {
        if (errorRef.current) {
            const errorRect = errorRef.current.getBoundingClientRect();
            const offset = 8;
            if (initialPosition.current.top !== undefined) {
                setAnimate({
                    top: errorRect ? -1 * (errorRect.height + offset) : -30,
                });
            } else {
                setAnimate({
                    bottom: errorRect ? -1 * (errorRect.height + offset) : -30,
                });
            }
        }
    }, []);

    const test = (
        <>
            {error.message}
            <a href="https://www.duckduckgo.com">link</a>
        </>
    );

    return (
        <motion.div
            key={error.key}
            className="search-error"
            ref={errorRef}
            transition={transition}
            initial={initialPosition.current}
            animate={animate}
        >
            <BiError className="search-error-icon" />
            <p className="search-error-text">{error.message}</p>
            {/* <p className="search-error-text">{test}</p> */}
            <button className="close-error" onClick={() => setError(null)}>
                <MdClear />
            </button>
        </motion.div>
    );
};

export default Error;
