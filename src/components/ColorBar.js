const ColorBar = () => {
    const colors = [
        "#004adb",
        "#306cde",
        "#468de0",
        "#5aadde",
        "#75cdd6",
        "#b3e8b6",
        "#ffde98",
        "#ffb963",
        "#f89440",
        "#ef6c2b",
        "#e43a20",
    ];
    const barStyle = {
        display: "flex",
        flex: "row nowrap",
        alignSelf: "stretch",
    };
    const blockStyle = {
        flexGrow: 1,
    };
    return (
        <div style={barStyle} className="rainbow-bar">
            {colors.map((color) => (
                <div
                    key={color}
                    style={{ ...blockStyle, backgroundColor: color }}
                ></div>
            ))}
        </div>
    );
};

export default ColorBar;
