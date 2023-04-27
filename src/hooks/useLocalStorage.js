import { useState, useEffect } from "react";

const useLocalStorage = (key, initialState) => {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        } else if (initialState instanceof Function) {
            return initialState();
        } else {
            return initialState;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
