import {
    useState,
    useLayoutEffect,
    useRef,
    useContext,
    createContext,
} from "react";
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

import coverage from "./assets/images/Coverage_MillerCropped_Pattern.png";
import Footer from "components/Footer";
import useIsNewlyMounted from "hooks/useIsNewlyMounted";

export const AppNewlyMountedContext = createContext();

function App() {
    // ====== State ======
    const appIsNewlyMounted = useIsNewlyMounted(800);
    const [globalChartFullscreen, toggleGlobalChartFullscreen] =
        useBinaryState();
    // ------ Forecasts ------
    const [thermalIndex, toggleThermalIndex] = useBinaryState(["UTCI", "WBGT"]);
    const [units, toggleUnits] = useBinaryState(["C", "F"]);
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

    // ------ Coverage Modal ------
    const [coverageModal, setCoverageModal] = useState(false);
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

    return (
        <>
            <AppNewlyMountedContext.Provider value={appIsNewlyMounted}>
                <motion.div
                    className="global-chart-fullscreen-backdrop-filter"
                    initial={{
                        backdropFilter: "blur(0px) brightness(1)",
                        // "-webkit-backdrop-filter": "blur(0) brightness(1)",
                    }}
                    animate={
                        globalChartFullscreen
                            ? {
                                  backdropFilter: "blur(4px) brightness(0)",
                                  //   "-webkit-backdrop-filter":
                                  //       "blur(4px) brightness(0)",
                              }
                            : {
                                  backdropFilter: "blur(0px) brightness(1)",
                                  //   "-webkit-backdrop-filter":
                                  //       "blur(0) brightness(1)",
                              }
                    }
                    transition={{ duration: 0.5 }}
                ></motion.div>
                <ColorBar />
                <Header />
                <GlobalChart
                    fullscreen={globalChartFullscreen}
                    toggleFullscreen={toggleGlobalChartFullscreen}
                />
                <Search
                    forecasts={forecasts}
                    newForecast={newForecast}
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
                            />
                        );
                    })}
                </AnimatePresence>
                <About />
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
                            />
                        </>
                    )}
                </StaticModal>
            </AppNewlyMountedContext.Provider>
        </>
    );
}

export default App;
