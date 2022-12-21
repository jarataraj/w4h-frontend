const { useState, useEffect } = require("react");

// Returns true if newly mounted, false afterwards. Useful for preventing
// children animations on parent mount

const useIsNewlyMounted = (delay = 0) => {
    const [isNewlyMounted, setIsNewlyMounted] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsNewlyMounted(false);
        }, delay);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return isNewlyMounted;
};

export default useIsNewlyMounted;
