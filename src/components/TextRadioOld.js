import { motion } from "framer-motion";
import { useRef, useState } from "react";
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
                border: "1px solid red",
                padding: 0,
                margin: 0,
                color: "#eee",
                position: "relative",
                display: "flex",
                alignItems: "center",
            }}
            ref={outerRectRef}
        >
            <legend className="hide-visually">{groupName}</legend>
            {options.map((option) => {
                return (
                    <>
                        {/* Cannot use motion.label for animatimation for some reason. Seems to break ref functionality */}
                        <label
                            key={`label-${option}`}
                            for={`radio-${option}`}
                            id={`label-${option}`}
                            className="text-radio-label"
                            // onClick={() => setSelection(option)}
                            ref={option === selection ? innerRectRef : null}
                            style={{
                                margin: "0 .5rem",
                                color: option === selection ? "#fff" : "#bbb",
                                fontSize: option === selection ? 16 : 14,
                            }}
                        >
                            {option}
                        </label>
                        <input
                            key={`radio-${option}`}
                            type="radio"
                            id={`radio-${option}`}
                            name={groupName}
                            value={option}
                            onChange={() => {
                                setSelection(option);
                            }}
                            checked={option === selection}
                            className="hide-visually"
                        />
                    </>
                );
            })}
            <motion.div
                className="underline-selected"
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

//. checked = {option === selection}
