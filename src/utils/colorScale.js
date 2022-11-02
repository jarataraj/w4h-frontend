import { scaleThreshold } from "@visx/scale";

const softColors = [
    "#306cde",
    "#004adb",
    "#468de0",
    "#5aadde",
    "#75cdd6",
    "#b3e8b6",
    "#ffde98",
    "#fcad6e",
    "#f27946",
    "#e43a20",
];
// const hardColors = [
//     "#0000ff",
//     "#4752ef",
//     "#5d7fdf",
//     "#6da7cf",
//     "#83cdc0",
//     "#aeeeb2",
//     "#ffde98",
//     "#ffae6b",
//     "#ff763c",
//     "#ff0000",
// ];

const colorScale = scaleThreshold({
    domain: [-40, -27, -13, 0, 9, 26, 32, 38, 46],
    range: softColors,
});

export default colorScale;
