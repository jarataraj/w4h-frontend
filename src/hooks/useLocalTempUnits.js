import useLocalStorage from "hooks/useLocalStorage";

// US, USA: USA
// UM, UMI: US Minor Outlying Islands
// KY, CYM: Cayman Islands
// LR, LBR: Liberia
// MH, MHL: Marshall Islands
// PW, PLW: Palau
// FM, FSM: Micronesia
const farenheightLocales = new Set([
    "US",
    "USA",
    "UM",
    "UMI",
    "KY",
    "CYM",
    "LR",
    "LBR",
    "MH",
    "MHL",
    "PW",
    "PLW",
    "FM",
    "FSM",
]);

const useLocalTempUnits = () => {
    const [units, setUnits] = useLocalStorage("temperatureUnits", () => {
        let locale = navigator.language.split("-");
        if (locale.length > 1 && farenheightLocales.has(locale[1])) {
            return "F";
        } else return "C";
    });
    const toggleUnits = () => {
        if (units === "C") {
            setUnits("F");
        } else setUnits("C");
    };
    return [units, toggleUnits];
};

export default useLocalTempUnits;
