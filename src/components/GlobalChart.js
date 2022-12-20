import { useState, useEffect, useRef } from "react";
import {
    BsCaretLeft,
    BsCaretLeftFill,
    BsCaretRight,
    BsCaretRightFill,
} from "react-icons/bs";
import { IoExpand, IoClose, IoExpandSharp } from "react-icons/io5";

import TextRadio from "./TextRadio";

import { motion, AnimatePresence } from "framer-motion";

import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import map from "../assets/images/MillerCroppedNew.png";
import useChart from "../services/charts";
import useLocale from "hooks/useLocale";

const GlobalChart = () => {
    const locale = useLocale();
    // ====== Testing ======
    const [day, setDay] = useState(
        new Date(new Date(Date.now()).setMonth(10, 17))
    );
    const dateString = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        month: "numeric",
        day: "numeric",
    }).format(day);

    const changeDay = (deltaDays) => {
        let newDay = new Date(day);
        newDay.setDate(newDay.getDate() + deltaDays);
        setDay(newDay);
    };

    // const [day, setDay] = useState(new Date(Date.now()));
    const [fullscreen, setFullscreen] = useState({ state: "closed" });
    const [thermalIndex, setThermalIndex] = useState("UTCI");
    const [highLow, setHighLow] = useState("Highs");
    const [units, setUnits] = useState("C");

    // const isFullscreen = fullscreen.state !== "closed";
    const datestring = (offset = 0) => {
        let date = new Date(day.valueOf());
        date.setDate(date.getDate() + offset);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };
    const highLowString = highLow.toLowerCase();
    const visibleChart = useChart(datestring(), highLowString, true);
    const nextChart = useChart(
        datestring(1),
        highLowString,
        visibleChart.isFetched
    );
    const previousChart = useChart(
        datestring(-1),
        highLowString,
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
                    src={visibleChart.data}
                    alt="global temperatures"
                    style={{ opacity: fullscreen.state === "closed" ? 1 : 0 }}
                />
                <div className="global-chart_controls-container">
                    <div className="global-chart_time-controls">
                        <button
                            className="change-day change-day--previous"
                            disabled={previousChart.data ? false : true}
                            onClick={() => changeDay(-1)}
                        >
                            <BsCaretLeft className="change-day_icon" />
                            <BsCaretLeftFill className="change-day_icon--hover" />
                        </button>
                        <h4>{dateString}</h4>
                        {/* <h4>{`${day.getMonth()}, ${day.getDate()}`}</h4> */}
                        <button
                            className="change-day change-day--next"
                            disabled={nextChart.data ? false : true}
                            onClick={() => changeDay(1)}
                        >
                            <BsCaretRight className="change-day_icon" />
                            <BsCaretRightFill className="change-day_icon--hover" />
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
                            src={visibleChart.data}
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
                            src={visibleChart.data}
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
