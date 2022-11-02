import { useEffect, useRef } from "react";

const useIsRef = (ref) => {
    // useEffect(() => console.log(ref));
    const nullRef = useRef(null);
    useEffect(() => console.log(ref instanceof nullRef.constructor));
};

export default useIsRef;
