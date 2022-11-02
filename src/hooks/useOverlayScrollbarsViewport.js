import { useLayoutEffect, useRef } from "react";

const useOverlayScrollbarsViewport = (ref) => {
    const viewport = useRef(null);
    useLayoutEffect(() => {
        if (ref.current) {
            viewport.current = ref.current.osInstance().getElements().viewport;
        }
    }, [ref]);
    return viewport;
};

export default useOverlayScrollbarsViewport;
