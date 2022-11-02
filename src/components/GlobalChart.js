import { useState, useEffect, useRef } from "react";
import { BsCaretRight, BsCaretLeft } from "react-icons/bs";
import { IoExpand, IoClose, IoExpandSharp } from "react-icons/io5";

import TextRadio from "./TextRadio";

import { motion, AnimatePresence } from "framer-motion";

import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import map from "../assets/images/MillerCropped.png";
import useChart from "../services/charts";

const GlobalChart = () => {
    const [day, setDay] = useState(new Date(Date.now()));
    const [fullscreen, setFullscreen] = useState({ state: "closed" });
    const [thermalIndex, setThermalIndex] = useState("UTCI");
    const [highLow, setHighLow] = useState("Highs");
    const [units, setUnits] = useState("C");

    const isFullscreen = fullscreen !== "closed";
    const datestring = (offset = 0) => {
        let date = new Date(day.valueOf());
        date.setDate(date.getDate() + offset);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };
    const highLowString = highLow.toLowerCase();
    const visibleChart = useChart(
        datestring(),
        highLowString,
        isFullscreen,
        true
    );
    const nextChart = useChart(
        datestring(1),
        highLowString,
        isFullscreen,
        visibleChart.isFetched
    );
    const previousChart = useChart(
        datestring(-1),
        highLowString,
        isFullscreen,
        visibleChart.isFetched
    );

    const globalImg = useRef();
    const modalImg = useRef();
    const transitionImg = useRef();

    const fullscreenTransition = {
        duration: 0.5,
        type: "spring",
        bounce: 0,
    };

    const getModalPositions = () => {
        let originalPos = globalImg.current.getBoundingClientRect();
        let viewportWidth = window.document.documentElement.clientWidth;
        let viewportHeight = window.document.documentElement.clientHeight;
        let screenAspect = viewportWidth / viewportHeight;
        let imgAspect = originalPos.width / originalPos.height;
        let original = {
            top: `${originalPos.y}px`,
            left: `${originalPos.x}px`,
            width: `${originalPos.width}px`,
        };
        let width;
        if (screenAspect > imgAspect) {
            width = viewportHeight * screenAspect;
        } else {
            width = viewportWidth;
        }
        if (viewportWidth > 1200) width -= 40;
        let height = width / imgAspect;
        let modal = {
            top: `${viewportHeight / 2 - height / 2}px`,
            left: `${viewportWidth / 2 - width / 2}px`,
            width: `${width}px`,
        };
        return { original, modal };
    };

    const openFullscreen = () => {
        disableBodyScroll(transitionImg, {
            reserveScrollBarGap: true,
        });
        let { original, modal } = getModalPositions();
        setFullscreen({ from: original, to: modal, state: "opening" });
    };

    const closeFullscreen = () => {
        let { original, modal } = getModalPositions();
        setFullscreen({ from: modal, to: original, state: "closing" });
    };

    // Clear any scroll locks on unmount
    // useEffect(() => {
    //     return () => clearAllBodyScrollLocks();
    // }, []);

    let today = useRef(new Date());
    today.current.setUTCHours(0);
    today.current.setUTCMinutes(0);
    today.current.setUTCMilliseconds(0);

    return (
        <>
            <div className="global-chart_container">
                <div className="global-chart_inset"></div>
                <motion.img
                    onDoubleClick={openFullscreen}
                    ref={globalImg}
                    className="global-chart_image"
                    src={map}
                    alt="global temperatures"
                    style={{ opacity: fullscreen.state === "closed" ? 1 : 0 }}
                />
                <div className="global-chart_controls-container">
                    <div className="global-chart_time-controls">
                        <button>
                            <BsCaretLeft />
                        </button>
                        <h4>Today, August 1</h4>
                        <button>
                            <BsCaretRight />
                        </button>
                    </div>
                    <TextRadio
                        groupName="Temperature"
                        options={["UTCI", "WBGT"]}
                        selection={thermalIndex}
                        setSelection={setThermalIndex}
                        className="thermal-index-selection"
                    />
                    <TextRadio
                        groupName="High-or-Low"
                        options={["Highs", "Lows"]}
                        selection={highLow}
                        setSelection={setHighLow}
                        className="high-low-selection"
                    />
                    <button
                        className="global-chart_fullscreen-button"
                        onClick={openFullscreen}
                    >
                        <IoExpand />
                    </button>
                </div>
            </div>
            {fullscreen.state !== "closed" && (
                <motion.div
                    className="modal-background"
                    initial={{
                        backdropFilter: "blur(0px) brightness(1)",
                    }}
                    animate={fullscreen.state}
                    variants={{
                        opening: {
                            backdropFilter: "blur(4px) brightness(.3)",
                        },
                        open: {
                            backdropFilter: "blur(4px) brightness(.3)",
                        },
                        closing: {
                            backdropFilter: "blur(0px) brightness(1)",
                        },
                    }}
                    transition={fullscreenTransition}
                    onClick={closeFullscreen}
                >
                    {fullscreen.state === "closing" ||
                    fullscreen.state === "opening" ? (
                        <motion.img
                            ref={transitionImg}
                            // onClick={(e) => e.stopPropagation()}
                            // onDoubleClick={modal.exit}
                            className="global-chart_image"
                            src={map}
                            alt="global temperatures"
                            style={{ position: "absolute" }}
                            initial={fullscreen.from}
                            animate={fullscreen.to}
                            // exit={fullscreen.from}
                            transition={fullscreenTransition}
                            onAnimationComplete={() => {
                                if (fullscreen.state === "opening") {
                                    setFullscreen({ state: "open" });
                                } else {
                                    setFullscreen({ state: "closed" });
                                    clearAllBodyScrollLocks();
                                }
                            }}
                        />
                    ) : (
                        <img
                            className="global-chart_image--modal"
                            alt="global temperature"
                            src={map}
                            onClick={(e) => {
                                console.log(
                                    modalImg.current.getBoundingClientRect()
                                );
                                e.stopPropagation();
                            }}
                            onDoubleClick={closeFullscreen}
                            ref={modalImg}
                        />
                    )}
                </motion.div>
            )}
        </>
    );
};

export default GlobalChart;
