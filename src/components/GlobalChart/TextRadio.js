import { motion } from "framer-motion";
import { Fragment, useRef, useState } from "react";
import { useRect } from "react-use-rect";

const TextRadio = ({
    groupName,
    options,
    selection,
    setSelection,
    className,
}) => {
    const [innerRect, setInnerRect] = useState(null);
    const [outerRect, setOuterRect] = useState(null);
    const [innerRectRef] = useRect(setInnerRect, { resize: true });
    const [outerRectRef] = useRect(setOuterRect, { resize: true });

    return (
        <fieldset
            className={className}
            style={{
                border: "none",
                padding: 0,
                margin: 0,
                color: "#eee",
                position: "relative",
                display: "flex",
                alignItems: "center",
            }}
            ref={outerRectRef}
        >
            {/* Labels group of radio buttons for accessability */}
            <legend className="hide-visually">{groupName}</legend>
            {options.map((option) => {
                return (
                    // Measures the width of each option when it is styled as selected in order to properly size the underline
                    <div
                        key={`option-dimensioner-${option}`}
                        id={`option-dimensioner--${option}`}
                        className="text-radio-dimensioner"
                        // onClick={() => setSelection(option)}
                        ref={option === selection ? innerRectRef : null}
                        aria-hidden={true}
                        style={{
                            opacity: 1,
                            fontSize: 17,
                            color: "#333",
                        }}
                    >
                        {option}
                    </div>
                );
            })}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {options.map((option) => {
                    return (
                        <Fragment key={`${option}`}>
                            <motion.label
                                id={`${groupName}-label--${option}`}
                                htmlFor={`${groupName}-radio--${option}`}
                                className={`text-radio text-radio--${option}`}
                                style={{}}
                                animate={{
                                    color:
                                        option === selection ? "#fff" : "#bbb",
                                    "font-size":
                                        option === selection ? "17px" : "15px",
                                }}
                                transition={{
                                    duration: 0.3,
                                    type: "spring",
                                }}
                            >
                                {option}
                            </motion.label>
                            <input
                                className="hide-visually"
                                type="radio"
                                id={`${groupName}-radio--${option}`}
                                name={groupName}
                                value={option}
                                onChange={() => {
                                    setSelection(option);
                                }}
                                checked={option === selection}
                            />
                        </Fragment>
                    );
                })}
            </div>

            <motion.div
                className="text-radio-underline"
                style={{
                    borderBottom: "1px solid #eee",
                    position: "absolute",
                    bottom: 0,
                }}
                animate={{
                    width: innerRect ? innerRect.width : 0,
                    left: innerRect ? innerRect.x - outerRect.x : 0,
                }}
                transition={{ duration: 0.3, type: "spring" }}
            ></motion.div>
        </fieldset>
    );
};

export default TextRadio;
