import { useLayoutEffect, useEffect } from "react";

const useVisibleOnlyInViewport = (
    viewport,
    descendantsSelector,
    dependencies
) => {
    useLayoutEffect(() => {
        // Hide elements not in viewport on init
        if (viewport.current) {
            const targets =
                viewport.current.querySelectorAll(descendantsSelector);
            const viewportRect = viewport.current.getBoundingClientRect();
            for (let target of targets) {
                let targetRect = target.getBoundingClientRect();
                if (
                    targetRect.x < viewportRect.x ||
                    targetRect.x + targetRect.width >
                        viewportRect.x + viewportRect.width
                ) {
                    target.style.opacity = 0;
                }
            }
        }
    }, [viewport, descendantsSelector, ...dependencies]);
    // Observer setup
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
                target.classList.add("visible-only-in-viewport");
                observer.observe(target);
            }
        }
        // TODO: return cleanup func
    }, [viewport, descendantsSelector, ...dependencies]);
};

export default useVisibleOnlyInViewport;
