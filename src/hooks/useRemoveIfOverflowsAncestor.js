import { useLayoutEffect } from "react";

// ENHANCEMENT: use resize observer to determine if hidding is needed upon resize
const useRemoveIfOverflowsAncestor = (descendant, ancestor, dependencies) => {
    useLayoutEffect(() => {
        let des = descendant.current;
        let ans = ancestor.current;
        if (des && ans) {
            let desRect = des.getBoundingClientRect();
            let ansRect = ans.getBoundingClientRect();
            if (
                desRect.left < ansRect.left ||
                desRect.right > ansRect.right ||
                desRect.bottom > ansRect.bottom ||
                desRect.top < ansRect.top
            ) {
                des.style.display = "none";
                // des.classList.add("hide-visually");
            }
        }
    }, [descendant, ancestor, dependencies]);
};

export default useRemoveIfOverflowsAncestor;
