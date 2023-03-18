import { useEffect } from "react";

const useAncestorVisibleOnlyInViewport = (
    viewport,
    descendantsSelector,
    ancestorSelector,
    dependencies
) => {
    useEffect(() => {
        if (viewport.current) {
            const toggleVisibility = (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio === 1) {
                        entry.target.closest(
                            ancestorSelector
                        ).style.opacity = 1;
                    } else {
                        entry.target.closest(
                            ancestorSelector
                        ).style.opacity = 0;
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
    }, [viewport, descendantsSelector, ancestorSelector, dependencies]);
};

export default useAncestorVisibleOnlyInViewport;
