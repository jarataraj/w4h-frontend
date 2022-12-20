// from: https://stackoverflow.com/questions/56153797/horizontal-scrolling-on-react-component-using-vertical-mouse-wheel
import { useRef, useEffect } from "react";

const useHorizontalScroll = () => {
    const scrollable = useRef(null);
    useEffect(() => {
        const element = scrollable.current;
        if (element) {
            const onWheel = (e) => {
                e.preventDefault();
                if (e.deltaY === 0) return;
                if (
                    !(element.scrollLeft === 0 && e.deltaY < 0) &&
                    !(
                        element.scrollWidth -
                            element.clientWidth -
                            Math.round(element.scrollLeft) ===
                            0 && e.deltaY > 0
                    )
                )
                    element.scrollBy(e.deltaY, 0);
            };
            element.addEventListener("wheel", onWheel);
            return () => element.removeEventListener("wheel", onWheel);
        }
    }, []);
    return scrollable;
};

export default useHorizontalScroll;
