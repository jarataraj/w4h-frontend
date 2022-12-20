import { useLayoutEffect } from "react";
// Hides elements whose content overflows the element's box size
// ENHANCEMENT: use resize observer to determine if hidding is needed upon resize
const useHideIfOverflowing = (ref) => {
    useLayoutEffect(() => {
        let element = ref.current;
        if (element) {
            if (element.scrollWidth > element.clientWidth) {
                element.style.visibility = "hidden";
            }
        }
    }, [ref]);
};

export default useHideIfOverflowing;
