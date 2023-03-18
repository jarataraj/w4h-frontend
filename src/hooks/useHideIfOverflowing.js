import { useLayoutEffect } from "react";
// Hides elements whose content overflows the element's box size
// ENHANCEMENT: use resize observer to determine if hidding is needed upon resize
const useHideIfOverflowing = (ref, dependencies) => {
    useLayoutEffect(() => {
        let element = ref.current;
        if (element) {
            // need to make visible in order to use .scrollWidth and .clientWidth
            element.style.visibility = "visible";
            if (element.scrollWidth > element.clientWidth) {
                element.style.visibility = "hidden";
            }
        }
    }, [ref, dependencies]);
};

export default useHideIfOverflowing;
