import { useState, useEffect, useRef } from "react";
import {
    BsCaretLeft,
    BsCaretLeftFill,
    BsCaretRight,
    BsCaretRightFill,
} from "react-icons/bs";
import {
    IoExpand,
    IoContract,
    IoClose,
    IoExpandSharp,
    IoCaretDownCircleOutline,
} from "react-icons/io5";

import TextRadio from "./TextRadio";

import { motion, AnimatePresence } from "framer-motion";

import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import DesktopKey from "./VerticalKey";

import GlobalChartControls from "./GlobalChartControls";
import useChart from "services/charts";
import useLocale from "hooks/useLocale";
import useBinaryState from "hooks/useBinaryState";

const GlobalChart = ({ fullscreen, toggleFullscreen }) => {
    const locale = useLocale();
    const [showKey, toggleShowKey] = useBinaryState([false, true]);
    // ====== Testing ======
    const [day, setDay] = useState(
        new Date(new Date(Date.now()).setFullYear(2022, 10, 17))
    );
    const dateString = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "numeric",
        day: "numeric",
    }).format(day);

    const changeDay = (deltaDays) => {
        let newDay = new Date(day);
        newDay.setDate(newDay.getDate() + deltaDays);
        setDay(newDay);
    };

    // const [day, setDay] = useState(new Date(Date.now()));
    // NEW
    // const [fullscreen, toggleFullscreen] = useBinaryState();
    // OLD
    // const [fullscreen, setFullscreen] = useState({ state: "closed" });
    const [thermalIndex, setThermalIndex] = useState("UTCI");
    const [highLow, setHighLow] = useState("Highs");

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
        duration: 2.5,
        type: "spring",
        bounce: 0,
    };

    // const getModalPositions = () => {
    //     let originalPos = globalImg.current.getBoundingClientRect();
    //     let viewportWidth = window.document.documentElement.clientWidth;
    //     let viewportHeight = window.document.documentElement.clientHeight;
    //     let screenAspect = viewportWidth / viewportHeight;
    //     let imgAspect = originalPos.width / originalPos.height;
    //     let original = {
    //         top: `${originalPos.y}px`,
    //         left: `${originalPos.x}px`,
    //         width: `${originalPos.width}px`,
    //     };
    //     let width;
    //     if (screenAspect > imgAspect) {
    //         width = viewportHeight * screenAspect;
    //     } else {
    //         width = viewportWidth;
    //     }
    //     if (viewportWidth > 1200) width -= 40;
    //     let height = width / imgAspect;
    //     let modal = {
    //         top: `${viewportHeight / 2 - height / 2}px`,
    //         left: `${viewportWidth / 2 - width / 2}px`,
    //         width: `${width}px`,
    //     };
    //     return { original, modal };
    // };

    // const openFullscreen = () => {
    //     disableBodyScroll(transitionImg, {
    //         reserveScrollBarGap: true,
    //     });
    //     let { original, modal } = getModalPositions();
    //     setFullscreen({ from: original, to: modal, state: "opening" });
    // };

    // const closeFullscreen = () => {
    //     let { original, modal } = getModalPositions();
    //     setFullscreen({ from: modal, to: original, state: "closing" });
    // };

    // Clear any scroll locks on unmount
    // useEffect(() => {
    //     return () => clearAllBodyScrollLocks();
    // }, []);

    let today = useRef(new Date());
    today.current.setUTCHours(0);
    today.current.setUTCMinutes(0);
    today.current.setUTCMilliseconds(0);

    const fullscreenVariant = fullscreen ? "fullscreen" : "notFullscreen";

    // const visibleChart2 = `https://www.weatherforhumans.com/charts/${datestring()}_UTCI_${highLowString}_highres.png`;

    return (
        <>
            <motion.section className="global-chart-section">
                <div className="global-chart-section-background"></div>
                <div className="global-chart-image-container">
                    {!visibleChart.isSuccess && (
                        <h4 className="global-chart-load-status">
                            {visibleChart.isError
                                ? "Error Loading Global Chart"
                                : "Loading Global Chart"}
                        </h4>
                    )}
                    {/* Better animation performance by only showing one motion.img with the same 
                    layoutId in order to prevent framer motion's automatic crossfade effect  */}
                    {!fullscreen && (
                        <motion.img
                            // key="two"
                            // layout
                            layoutId={"global-image"}
                            onDoubleClick={toggleFullscreen}
                            className="global-chart-image"
                            // src={visibleChart2}
                            src={visibleChart.data}
                            alt="global temperatures"
                            style={{
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                    {/* <DesktopKey /> */}
                </div>
                {/* {!fullscreen && (
                    <motion.img
                        key="two"
                        layoutId="1234"
                        onDoubleClick={toggleFullscreen}
                        className="global-chart_image"
                        src={visibleChart.data}
                        alt="global temperatures"
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            border: "1px solid black",
                            opacity: fullscreen ? 0 : 1,
                            zIndex: 100,
                        }}
                        transition={{ duration: 1 }}
                    />
                )} */}
                <GlobalChartControls
                    showKey={showKey}
                    toggleShowKey={toggleShowKey}
                    fullscreen={fullscreen}
                    toggleFullscreen={toggleFullscreen}
                    previousChart={previousChart}
                    nextChart={nextChart}
                    dateString={dateString}
                    changeDay={changeDay}
                />
            </motion.section>
            {/* ====== Fullscreen View ====== */}
            {/* <AnimatePresence> */}
            {fullscreen && (
                <div
                    className="global-chart-fullscreen-container"
                    onClick={toggleFullscreen}
                    style={{
                        pointerEvents: fullscreen ? "auto" : "none",
                    }}
                >
                    <div
                        className="global-chart-fullscreen-image-container"
                        style={{
                            overflow: "auto",
                            aspectRatio: "2000/1008",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <motion.img
                            layoutId="global-image"
                            className="global-chart-image--fullscreen"
                            alt="global temperature"
                            // src="https://www.weatherforhumans.com/charts/2022-11-17_UTCI_lows_highres.png"
                            src={visibleChart.data}
                            onClick={(e) => {
                                console.log(
                                    modalImg.current.getBoundingClientRect()
                                );
                                e.stopPropagation();
                            }}
                            onDoubleClick={toggleFullscreen}
                            ref={modalImg}
                            style={{
                                border: "1px solid black",
                                borderRadius: 0,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                        {/* Need to remove; otherwise is persisted by AnimatePresence and as a result triggers crossfade effect of layout animation  */}
                    </div>
                    <GlobalChartControls
                        toggleFullscreen={toggleFullscreen}
                        fullscreen={fullscreen}
                        previousChart={previousChart}
                        nextChart={nextChart}
                        dateString={dateString}
                        changeDay={changeDay}
                    />
                </div>
            )}
            {/* </AnimatePresence> */}
        </>
    );
};

export default GlobalChart;
