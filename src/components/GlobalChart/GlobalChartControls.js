import useMediaQuery from "@mui/material/useMediaQuery";
import useIsNewlyMounted from "hooks/useIsNewlyMounted";
import { AnimatePresence, motion } from "framer-motion";

import {
    BsCaretLeft,
    BsCaretLeftFill,
    BsCaretRight,
    BsCaretRightFill,
} from "react-icons/bs";
import { IoExpand, IoContract, IoSettingsOutline } from "react-icons/io5";
import ButtonSwitch from "components/ButtonSwitch";
import { useState } from "react";

const GlobalChartControls = ({
    className = "",
    showKey,
    toggleShowKey,
    fullscreen,
    toggleFullscreen,
    isPreviousChart,
    isNextChart,
    visibleDatetime,
    changeDay,
    isFullscreenControls,
    highLow,
    setHighLow,
}) => {
    const [showDataSelectors, setShowDataSelectors] = useState(false);
    const isNewlyMounted = useIsNewlyMounted();
    const useCompactTitle = useMediaQuery(
        "@media screen and (max-width: 485px)"
    );
    const useCompactKeyButton = useMediaQuery(
        "@media screen and (max-width: 390px)"
    );
    return (
        <>
            <div className={`global-chart-controls-container-test`}>
                <AnimatePresence>
                    {!fullscreen && showDataSelectors && (
                        <motion.div
                            className="global-chart-data-selection-tray"
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.4, type: "tween" }}
                            onClick={() => setShowDataSelectors(false)}
                        >
                            <div className="global-chart-data-selection-container">
                                <button onClick={() => setHighLow("Highs")}>
                                    UTCI Highs
                                </button>
                                <button onClick={() => setHighLow("Lows")}>
                                    UTCI Lows
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* <AnimatePresence>
                    {!showDataSelectors && (
                        <motion.div
                            className="global-chart-controls-tray"
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.4, type: "tween" }}
                        > */}
                <div className={`global-chart-controls-container ${className}`}>
                    <div
                        className={`global-chart-controls-date ${
                            useCompactTitle
                                ? "global-chart-controls-date--left"
                                : ""
                        }`}
                    >
                        <button
                            className="change-day change-day--previous"
                            disabled={!isPreviousChart}
                            onClick={() => changeDay(-1)}
                        >
                            <BsCaretLeft className="change-day_icon" />
                            <BsCaretLeftFill className="change-day_icon--hover" />
                        </button>
                        {useCompactTitle ? (
                            <h4 className="global-chart-title">
                                {visibleDatetime.toLocaleString({
                                    month: "numeric",
                                    day: "numeric",
                                })}
                                &ensp;UTCI&ensp;{highLow}
                            </h4>
                        ) : (
                            <div className="global-chart-title">
                                <h4>UTCI&ensp;{highLow}</h4>
                                <div className="global-chart-title-divider">
                                    |
                                </div>
                                <h4>
                                    {visibleDatetime
                                        .toLocaleString({
                                            weekday: "short",
                                            month: "numeric",
                                            day: "numeric",
                                        })
                                        .replace(",", "")}
                                </h4>
                            </div>
                        )}
                        <button
                            className="change-day change-day--next"
                            disabled={!isNextChart}
                            onClick={() => changeDay(1)}
                        >
                            <BsCaretRight className="change-day_icon" />
                            <BsCaretRightFill className="change-day_icon--hover" />
                        </button>
                    </div>

                    <div className="global-chart-controls-right">
                        <ButtonSwitch
                            className="global-chart-toggle-key"
                            onClick={toggleShowKey}
                            name={
                                useCompactKeyButton
                                    ? "key"
                                    : showKey
                                    ? "hide key"
                                    : "show key"
                            }
                            animationDelay={isNewlyMounted ? 0 : 0.2}
                            animationDuration={isNewlyMounted ? 0 : 0.2}
                            crossOut={useCompactKeyButton && showKey}
                        />
                        <button
                            className="global-chart-fullscreen-button"
                            onClick={() =>
                                setShowDataSelectors(!showDataSelectors)
                            }
                        >
                            <IoSettingsOutline />
                        </button>
                        <button
                            className="global-chart-fullscreen-button"
                            onClick={toggleFullscreen}
                        >
                            {isFullscreenControls ? (
                                <IoContract />
                            ) : (
                                <IoExpand />
                            )}
                        </button>
                    </div>
                </div>
                {/* </motion.div>
                    )}
                </AnimatePresence> */}
            </div>
        </>
    );
};

export default GlobalChartControls;
