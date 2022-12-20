import { useLayoutEffect, useState } from "react";

const useMeasureOnMount = (targetRef) => {
    let [targetRect, setTargetRect] = useState(undefined);
    useLayoutEffect(() => {
        if (targetRef.current) {
            setTargetRect(targetRef.current.getBoundingClientRect());
        }
    }, [targetRef]);
    return targetRect;
};

export default useMeasureOnMount;
