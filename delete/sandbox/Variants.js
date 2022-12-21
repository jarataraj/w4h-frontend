import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState } from "react";

const Square = () => {
    const [state, setState] = useState(false);

    return (
        <>
            <motion.div
                animate={"true"}
                style={{
                    width: 100,
                    height: 100,
                }}
                variants={{
                    false: {
                        border: "5px solid red",
                    },
                    true: {
                        border: "5px solid blue",
                    },
                }}
                onClick={() => setState(!state)}
            ></motion.div>
        </>
    );
};

export default Square;
