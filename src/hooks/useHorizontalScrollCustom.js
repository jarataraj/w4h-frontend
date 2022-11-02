// from: https://stackoverflow.com/questions/56153797/horizontal-scrolling-on-react-component-using-vertical-mouse-wheel
import { useEffect } from "react";

const useHorizontalScrollCustom = (ref) => {
    useEffect(() => {
        if (ref.current) {
            const element = ref.current.osInstance().getElements().viewport;
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
    }, [ref]);
};

export default useHorizontalScrollCustom;
