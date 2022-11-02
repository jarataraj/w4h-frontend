import { useEffect } from "react";

const useVisibleOnlyInViewport = (viewport, descendantsSelector) => {
    useEffect(() => {
        if (viewport.current) {
            const toggleVisibility = (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio === 1) {
                        entry.target.style.opacity = 1;
                    } else {
                        entry.target.style.opacity = 0;
                    }
                });
            };
            const options = {
                root: viewport.current,
                rootMargin: "0px",
                threshold: 1,
            };
            const observer = new IntersectionObserver(
                toggleVisibility,
                options
            );
            const targets =
                viewport.current.querySelectorAll(descendantsSelector);
            for (let target of targets) {
                observer.observe(target);
            }
        }
    }, [viewport, descendantsSelector]);
};

export default useVisibleOnlyInViewport;
