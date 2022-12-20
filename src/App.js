import { useState, useLayoutEffect, useRef } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import useBinaryState from "hooks/useBinaryState";
// import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import Header from "./components/Header";
import Search from "./components/Search";
import About from "./components/About";
import ColorBar from "./components/ColorBar";
import StaticModal from "./components/StaticModal";
import GlobalChart from "./components/GlobalChart";
import Forecast from "./components/Forecast";

import map from "./assets/images/MillerCropped.png";
import coverage from "./assets/images/Coverage_MillerCropped_Pattern.png";
import Footer from "components/Footer";

function App() {
    // ====== State ======
    // NEW
    const [forecasts, setForecasts] = useLocalStorage("forecasts", []);
    // Remove old unpinned forecast on app mount
    const isNewlyMounted = useRef(true);
    useLayoutEffect(() => {
        if (isNewlyMounted.current) {
            setForecasts(forecasts.filter((forecast) => forecast.isPinned));
            isNewlyMounted.current = false;
        }
    }, [forecasts, setForecasts]);
    const newForecast = (location) => {
        // if available, use key of existing nonpinned forecast to prevent
        // new component mount and animation
        const key =
            forecasts[0] && !forecasts[0].isPinned
                ? forecasts[0].key
                : Date.now();
        const newForecasts = [{ ...location, isPinned: false, key }].concat(
            forecasts.filter((forecast) => forecast.isPinned)
        );
        setForecasts(newForecasts);
    };
    // OLD
    const [coverageModal, setCoverageModal] = useState(false);
    const [thermalIndex, toggleThermalIndex] = useBinaryState(["UTCI", "WBGT"]);
    const [units, toggleUnits] = useBinaryState(["C", "F"]);

    // DELETE
    // const [nonPinnedForecast, setNonPinnedForecast] = useState(null);
    // const [pinnedForecasts, setPinnedForecasts] = useLocalStorage(
    //     "pinnedForecastsV4",
    //     []
    // );
    // const newNonPinnedForecast = (location) => {
    //     if (!location) {
    //         console.log("one");
    //         // case: nonpinned is pinned
    //         setNonPinnedForecast(null);
    //     } else if (nonPinnedForecast) {
    //         console.log("two");
    //         // case: nonpinned is replaced with a different location.
    //         setNonPinnedForecast({ ...location, animateEntrance: false });
    //     } else if (!("animateEntrance" in location)) {
    //         console.log("three");
    //         // case: a location that hasn't been forecasted is forecasted (location.animateEntrance is undefined)
    //         // and there is no nonpinned forecast.
    //         setNonPinnedForecast({ ...location, animateEntrance: true });
    //     } else if (!location.animateEntrance) {
    //         console.log("four");
    //         // case: pinned is unpinned and no current unpinned. (location.animateEntrance is defined and false)
    //         setNonPinnedForecast(location);
    //     } else {
    //         console.log("five");
    //         // case: pinned forecast is unpinned.
    //         setNonPinnedForecast({ ...location, animateEntrance: false });
    //     }
    // };

    // ------ Coverage Modal ------
    const coverageImg = useRef();
    const openCoverage = () => {
        disableBodyScroll(coverageImg, {
            reserveScrollBarGap: true,
        });
        setCoverageModal(true);
    };
    const closeCoverage = () => {
        enableBodyScroll(coverageImg);
        setCoverageModal(false);
    };

    // ====== Queries ======

    return (
        <>
            <ColorBar />
            <Header />
            <GlobalChart />
            <Search
                forecasts={forecasts}
                newForecast={newForecast}
                // pinnedForecasts={pinnedForecasts}
                // nonPinnedForecast={nonPinnedForecast}
                // setNonPinnedForecast={newForecast}
                // setNonPinnedForecast={newNonPinnedForecast}
                openCoverage={openCoverage}
            />
            <AnimatePresence>
                {forecasts.map((location) => {
                    return (
                        <Forecast
                            forecasts={forecasts}
                            setForecasts={setForecasts}
                            key={location.key}
                            units={units}
                            toggleUnits={toggleUnits}
                            thermalIndex={thermalIndex}
                            toggleThermalIndex={toggleThermalIndex}
                            location={location}
                            isPinned={location.isPinned}
                            // nonPinnedForecast={nonPinnedForecast}
                            // setNonPinnedForecast={newNonPinnedForecast}
                            // pinnedForecasts={pinnedForecasts}
                            // setPinnedForecasts={setPinnedForecasts}
                        />
                    );
                })}
            </AnimatePresence>

            {/* {nonPinnedForecast && (
                <Forecast
                    key={nonPinnedForecast.key}
                    units={units}
                    toggleUnits={toggleUnits}
                    thermalIndex={thermalIndex}
                    toggleThermalIndex={toggleThermalIndex}
                    location={nonPinnedForecast}
                    isPinned={false}
                    nonPinnedForecast={nonPinnedForecast}
                    setNonPinnedForecast={newNonPinnedForecast}
                    pinnedForecasts={pinnedForecasts}
                    setPinnedForecasts={setPinnedForecasts}
                />
            )}
            {pinnedForecasts.map((location) => {
                return (
                    <Forecast
                        key={location.name}
                        units={units}
                        toggleUnits={toggleUnits}
                        thermalIndex={thermalIndex}
                        toggleThermalIndex={toggleThermalIndex}
                        location={location}
                        isPinned={true}
                        nonPinnedForecast={nonPinnedForecast}
                        setNonPinnedForecast={newNonPinnedForecast}
                        pinnedForecasts={pinnedForecasts}
                        setPinnedForecasts={setPinnedForecasts}
                    />
                );
            })} */}
            {/* {nonPinned.map((forecast) => {
                <Forecast />;
            })}
            {pinned.map((forecast) => {
                <Forecast />;
            })} */}
            <About />
            <ColorBar width="20px" />
            <Footer openCoverage={openCoverage} />
            <StaticModal openCondition={coverageModal} exit={closeCoverage}>
                {(modal) => (
                    <>
                        <motion.img
                            className="coverage-map"
                            ref={coverageImg}
                            src={coverage}
                            // initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={modal.transition}
                            // style={{position: 'relative', bottom:0, right:0}}
                        />
                    </>
                )}
            </StaticModal>
        </>
    );
}

export default App;
