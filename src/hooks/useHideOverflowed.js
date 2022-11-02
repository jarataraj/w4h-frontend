import { useLayoutEffect, useRef } from "react";

// ENHANCEMENT: use resize observer to determine if hidding is needed upon resize
const useHideOverflowed = (ref) => {
    useLayoutEffect(() => {
        let element = ref.current;
        if (element) {
            if (element.scrollWidth > element.clientWidth) {
                element.style.visibility = "hidden";
            }
        }
    }, [ref]);
};

export default useHideOverflowed;
