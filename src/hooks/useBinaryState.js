import { useState } from "react";

const useBinaryState = (options) => {
    const [state, setState] = useState(options[0]);
    const toggleState = () => {
        if (state === options[0]) {
            setState(options[1]);
        } else {
            setState(options[0]);
        }
    };

    return [state, toggleState];
};

export default useBinaryState;
