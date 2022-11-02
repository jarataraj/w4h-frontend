// from: https://stackoverflow.com/questions/56153797/horizontal-scrolling-on-react-component-using-vertical-mouse-wheel
import { useRef, useEffect } from "react";

const useHorizontalScroll = (refOrElement) => {
    const nullRef = useRef(null);
    useEffect(() => {
        let element;
        if (refOrElement instanceof nullRef.constructor) {
            element = refOrElement.current;
        } else {
            element = refOrElement;
        }
        if (element) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                if (
                    !(element.scrollLeft === 0 && e.deltaY < 0) &&
                    !(
                        element.scrollWidth -
                            element.clientWidth -
                            Math.round(element.scrollLeft) ===
                            0 && e.deltaY > 0
                    )
                ) {
                    e.preventDefault();
                }
                element.scrollBy({ left: e.deltaY, behavior: "smooth" });
            };
            element.addEventListener("wheel", onWheel);
            return () => element.removeEventListener("wheel", onWheel);
        }
    }, [refOrElement]);
};

export default useHorizontalScroll;
