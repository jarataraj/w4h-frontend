import { useState, useEffect } from "react";

const useLocale = () => {
    const [locale, setLocale] = useState(navigator.language);
    const changeLocale = () => {
        setLocale(navigator.language);
    };
    useEffect(() => {
        window.addEventListener("languagechange", changeLocale);
        return () => window.removeEventListener("languagechange", changeLocale);
    }, []);
    return locale;
};

export default useLocale;
