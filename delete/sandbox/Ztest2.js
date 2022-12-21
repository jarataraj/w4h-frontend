const Test = () => {
    const left = 10;
    return (
        <div
            position="relative"
            width={400}
            height={400}
            border="solid 2px green"
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    border: "solid 15px red",
                    overflow: "visible",
                }}
            >
                <svg
                    width={150}
                    height={150}
                    style={{
                        border: "dashed 2px orange",
                        position: "absolute",
                        zIndex: 0,
                    }}
                >
                    <rect
                        width={100}
                        height={100}
                        fill="#999"
                        x={left}
                        y={10}
                    />
                </svg>
                <svg
                    width={150}
                    height={150}
                    style={{
                        border: "solid 2px gold",
                        position: "absolute",
                        zIndex: -2,
                    }}
                >
                    <rect
                        width={100}
                        height={100}
                        fill="#333"
                        x={left + 10}
                        y={20}
                    />
                </svg>
            </div>
            <div
                style={{
                    backgroundColor: "#bbb",
                    position: "absolute",
                    top: 32,
                    left: 32,
                    width: 100,
                    height: 100,
                    zIndex: -1,
                }}
            ></div>
        </div>
    );
};

export default Test;
