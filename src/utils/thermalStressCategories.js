import { scaleThreshold } from "@visx/scale";

const utciColors = [
    "#849ff1",
    "#92afec",
    "#9dc0e7",
    "#a8d1e2",
    "#b1e2dc",
    "#cceecc",
    "#f4e1b1",
    "#f5c59d",
    "#f4a88a",
    "#f18a77",
];
const utciCategoryNames = [
    "extreme cold",
    "very strong cold",
    "strong cold",
    "moderate cold",
    "slight cold",
    "no thermal stress",
    "moderate heat",
    "strong heat",
    "very strong heat",
    "extreme heat",
];
const utciCategoryBoundaries = [-40, -27, -13, 0, 9, 26, 32, 38, 46];

const wbgtMilitaryColors = [
    // "#f7f5f7",
    // "#efedf0",
    // "#eceaed",
    "#ebebeb",
    "#cceecc",
    "#ffe69b",
    "#ff8080",
    "#ababab",
];
const wbgtNiceColors = utciColors.slice(5);
const wbgtColors = wbgtMilitaryColors;
const wbgtCategoryNames = [
    "low risk",
    "elevated risk",
    "moderate risk",
    "high risk",
    "extreme risk",
];
const wbgtCategoryBoundaries = [82, 85, 88, 90].map(
    (temp) => (5 / 9) * (temp - 32)
);

const zipCategories = (names, colors) => {
    return names.map((category, index) => ({
        index,
        category,
        color: colors[index],
    }));
};

const utciCategories = zipCategories(utciCategoryNames, utciColors);
const wbgtCategories = zipCategories(wbgtCategoryNames, wbgtColors);

const utciColorScale = scaleThreshold({
    domain: utciCategoryBoundaries,
    range: utciCategories,
});
const wbgtColorScale = scaleThreshold({
    domain: wbgtCategoryBoundaries,
    range: wbgtCategories,
});

const thermalStressCategories = {
    UTCI: utciCategories,
    WBGT: wbgtCategories,
};

const colorScales = {
    UTCI: utciColorScale,
    WBGT: wbgtColorScale,
};

export { thermalStressCategories, colorScales };
