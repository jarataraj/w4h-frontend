const Test = () => {
    return (
        <>
            <div
                style={{
                    position: "relative",
                    border: "solid 5px gray",
                    overflow: "visible",
                }}
            >
                <div
                    style={{
                        border: "10px solid black",
                        position: "static",
                        width: 120,
                        height: 120,
                        overflow: "clip",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: 100,
                            height: 100,
                            border: "8px solid red",
                            top: -10,
                            left: -20,
                            zIndex: -1,
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            width: 100,
                            height: 100,
                            border: "8px solid blue",
                            top: 10,
                            left: 10,
                            zIndex: 3,
                        }}
                    ></div>
                </div>
                <div
                    style={{
                        position: "absolute",
                        width: 100,
                        height: 100,
                        border: "8px solid green",
                        top: 30,
                        left: 30,
                        zIndex: 2,
                    }}
                ></div>
                <div
                    style={{
                        position: "absolute",
                        width: 100,
                        height: 100,
                        border: "8px solid gold",
                        zIndex: 4,
                    }}
                ></div>
                <svg
                    width={150}
                    height={150}
                    style={{
                        border: "solid 2px red",
                        position: "absolute",
                        zIndex: 4,
                    }}
                >
                    <rect width={100} height={100} fill="#999" x={10} y={10} />
                    <rect width={100} height={100} fill="#333" x={20} y={20} />
                </svg>
            </div>
        </>
    );
};

export default Test;
