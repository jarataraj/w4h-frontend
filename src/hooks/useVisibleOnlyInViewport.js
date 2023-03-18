import { useEffect } from "react";

// Hides elements via opacity that are not fully contained by viewport.
// Consider changing to useHideIfOverflowsAncestor
const useVisibleOnlyInViewport = (
    viewport,
    descendantsSelector,
    dependencies
) => {
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
            return () => observer.disconnect();
        }
    }, [viewport, descendantsSelector, dependencies]);
};

export default useVisibleOnlyInViewport;
