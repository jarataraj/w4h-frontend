import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import "./globalchart.css";

import { motion, AnimatePresence } from "framer-motion";

import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import GlobalChartControls from "./GlobalChartControls";
import useChart from "services/charts";
import useLocale from "hooks/useLocale";
import useBinaryState from "hooks/useBinaryState";
import HorizontalKey from "./HorizontalKey";
import VerticalKey from "./VerticalKey";
import CompactKey from "./CompactKey";
import { useMediaQuery } from "@mui/material";
import useStatus from "services/status";

const GlobalChart = ({ fullscreen, toggleFullscreen }) => {
    const [visibleDateOffset, setVisibleDateOffset] = useState(0);
    const [showKey, toggleShowKey] = useBinaryState([false, true]);
    const [highLow, setHighLow] = useState("Highs");
    const status = useStatus();

    // ====== Dates ======
    const now = DateTime.now();

    // Adjust date label if timezone offset is outside of -11 to +12 hours
    let dateLabelOffset = 0;
    if (now.offset < -11 * 60) {
        dateLabelOffset = 1;
    } else if (now.offset > 12 * 60) {
        dateLabelOffset = -1;
    }
    const dateLabelAdjustedNow = now.plus({ days: dateLabelOffset });

    const visibleDatetime = dateLabelAdjustedNow.plus({
        days: visibleDateOffset,
    });
    const visibleDate = visibleDatetime.toISODate();
    const previousDate = dateLabelAdjustedNow
        .plus({ days: visibleDateOffset - 1 })
        .toISODate();
    const nextDate = dateLabelAdjustedNow
        .plus({ days: visibleDateOffset + 1 })
        .toISODate();

    const changeDay = (deltaDays) => {
        setVisibleDateOffset(visibleDateOffset + deltaDays);
    };

    const visibleChart = useChart(
        visibleDate,
        highLow,
        status.data?.globalCharts[visibleDate],
        Boolean(status.data)
    );

    // Preload previous and next chart once visible chart is fetched
    const isPreviousChart =
        status.data && previousDate in status.data.globalCharts;
    useChart(
        previousDate,
        highLow,
        status.data?.globalCharts[previousDate],
        // Not sure why I need Boolean() here but otherwise the chart is active
        Boolean(isPreviousChart && visibleChart.isFetched)
    );
    const isNextChart = status.data && nextDate in status.data.globalCharts;
    useChart(
        nextDate,
        highLow,
        status.data?.globalCharts[nextDate],
        Boolean(isNextChart && visibleChart.isFetched)
    );

    const modalImg = useRef();

    const useVerticalKey = useMediaQuery(
        "@media screen and (min-width: 1144px)"
    );
    const useHorizontalKey = useMediaQuery(
        "@media screen and (max-width: 1144px) and (min-width: 585px)"
    );
    const useCompactKey = useMediaQuery("@media screen and (max-width: 585px)");

    return (
        <>
            <motion.section className="global-chart-section">
                <div className="global-chart-background-container">
                    <div className="global-chart-background"></div>
                </div>
                <div className="global-chart-container">
                    <div className="global-chart-image-container">
                        {false && (
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
                    </div>
                    <GlobalChartControls
                        showKey={showKey}
                        toggleShowKey={toggleShowKey}
                        fullscreen={fullscreen}
                        toggleFullscreen={toggleFullscreen}
                        isPreviousChart={isPreviousChart}
                        isNextChart={isNextChart}
                        visibleDatetime={visibleDatetime}
                        changeDay={changeDay}
                        isFullscreenControls={false}
                        highLow={highLow}
                        setHighLow={setHighLow}
                    />
                    <HorizontalKey showKey={showKey && useHorizontalKey} />
                    <CompactKey showKey={showKey && useCompactKey} />
                </div>
                <VerticalKey showKey={showKey && useVerticalKey} />
            </motion.section>
            {/* ====== Fullscreen View ====== */}
            {/* NOTE: do not use AnimatePresence around the image - 
            otherwise the global chart fullscreen backdrop filter 
            animation seems to stutters due to framer-motion automatic 
            crossfade 
            effect applied to image layout transition */}
            <div
                className="global-chart-fullscreen-container"
                style={{
                    pointerEvents: fullscreen ? "auto" : "none",
                }}
            >
                {/* Must keep global-chart-fullscreen-image-container in dom to maintain 
                    position of fullscreen controls during fullscreen controls animation */}
                <div className="global-chart-fullscreen-image-container">
                    {fullscreen && (
                        <motion.img
                            layoutId="global-image"
                            className="global-chart-image--fullscreen"
                            alt="global temperature"
                            // src="https://www.weatherforhumans.com/charts/2022-11-17_UTCI_lows_highres.png"
                            src={visibleChart.data}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onDoubleClick={toggleFullscreen}
                            ref={modalImg}
                            style={{
                                border: "0px solid black",
                                borderRadius: 0,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                </div>
                <AnimatePresence>
                    {fullscreen && (
                        <motion.div
                            className="global-chart-controls--fullscreen-drawer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { delay: 0 } }}
                            transition={{
                                type: "tween",
                                duration: 0.25,
                                delay: 0.25,
                            }}
                        >
                            <GlobalChartControls
                                className="global-chart-controls--fullscreen"
                                toggleFullscreen={toggleFullscreen}
                                fullscreen={fullscreen}
                                isPreviousChart={isPreviousChart}
                                isNextChart={isNextChart}
                                visibleDatetime={visibleDatetime}
                                changeDay={changeDay}
                                isFullscreenControls={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default GlobalChart;
