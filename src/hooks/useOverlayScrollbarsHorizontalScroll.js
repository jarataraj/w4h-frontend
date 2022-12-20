// with help from: https://stackoverflow.com/questions/56153797/horizontal-scrolling-on-react-component-using-vertical-mouse-wheel
import { useEffect } from "react";

const useOverlayScrollbarsHorizontalScroll = (ref) => {
    useEffect(() => {
        if (ref.current) {
            const osInstance = ref.current.osInstance();
            const scrollPort = osInstance.getElements().viewport;
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                if (
                    !(scrollPort.scrollLeft === 0 && e.deltaY < 0) &&
                    !(
                        scrollPort.scrollWidth -
                            scrollPort.clientWidth -
                            Math.round(scrollPort.scrollLeft) ===
                            0 && e.deltaY > 0
                    )
                ) {
                    e.preventDefault();
                }
                // Stop old scroll animation and start new scroll animation
                osInstance
                    .scrollStop()
                    .scroll({ left: `+= ${e.deltaY}px` }, 200, "swing");
            };
            scrollPort.addEventListener("wheel", onWheel);
            return () => scrollPort.removeEventListener("wheel", onWheel);
        }
    }, [ref]);
};

export default useOverlayScrollbarsHorizontalScroll;
