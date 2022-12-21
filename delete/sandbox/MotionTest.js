import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState } from "react";

const Square = () => {
    const [slideTransform, setSlideTransform] = useState(
        () => () => console.log("no transform set")
    );
    const composeTransform = (scaleStart, scaleEnd, xStart, xEnd) => {
        return (x) =>
            ((x - scaleStart) * (xEnd - xStart)) / (scaleEnd - scaleStart) +
            xStart;
    };

    const width = useMotionValue(300);
    const one = useTransform(width, (v) => v / 3);
    const two = useTransform(width, (v) => (2 * v) / 3);
    const slide = useTransform(width, slideTransform);
    return (
        <>
            <motion.div
                style={{
                    marginLeft: slide,
                    height: "100px",
                    width: one,
                    backgroundColor: "green",
                    display: "inline-block",
                }}
            ></motion.div>
            <motion.div
                onClick={() => {
                    setSlideTransform(() =>
                        composeTransform(300, 600, 0, -200)
                    );
                    animate(width, width.get() === 300 ? 600 : 300, {
                        bounce: 0,
                        duration: 0.2,
                    });
                }}
                style={{
                    height: "100px",
                    width: two,
                    backgroundColor: "blue",
                    display: "inline-block",
                }}
            ></motion.div>
        </>
    );
};

export default Square;
