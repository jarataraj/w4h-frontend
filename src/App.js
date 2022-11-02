import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
// import axios from "axios";
import { motion } from "framer-motion";
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";

import Header from "./components/Header";
import Search from "./components/Search";
import Error from "./components/Error";
import About from "./components/About";
import ColorBar from "./components/ColorBar";
import StaticModal from "./components/StaticModal";
import GlobalChart from "./components/GlobalChart";
import Forecast from "./components/Forecast";

import map from "./assets/images/MillerCropped.png";
import coverage from "./assets/images/Coverage_MillerCropped.png";

function App() {
    // ====== State ======
    const [coverageModal, setCoverageModal] = useState(false);
    const [thermalIndex, setThermalIndex] = useState("UTCI");
    const [units, setUnits] = useState("C");
    const [nonPinned, setNonPinned] = useState([]);
    // ------ Stored Locally ------
    const [recentSearches, setRecentSearches] = useLocalStorage("recents", "");
    const [pinned, setPinned] = useLocalStorage("pinned", []);

    // ------ Dummy Forecasts ------
    const nonPinnedTest = nonPinned.map((location) => ({
        forecastLat: "40.00",
        forecastLon: "255.00",
        name: "Denver, CO",
        link: "https://www.openstreetmap.org/relation/1411339",
    }));

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
            <Search setNonPinned={setNonPinned} />
            {/* {nonPinned && <Forecast location={nonPinned} />} */}
            {/* {nonPinned.map((forecast) => {
                <Forecast />;
            })}
            {pinned.map((forecast) => {
                <Forecast />;
            })} */}
            <About />
            <ColorBar width="20px" />
            <footer>
                <button className="show-coverage-map" onClick={openCoverage}>
                    Coverage Map
                </button>
            </footer>
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
