import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { MdMyLocation } from "react-icons/md";
// import axios from "axios";

import Error from "./components/Error";
import About from "./components/About";
import RainbowBar from "./components/RainbowBar";

import map from "./assets/images/MillerCropped.png";

function App() {
    // ====== State ======
    const [search, setSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [forecasts, setForecasts] = useState([]);
    // ------ Stored Locally ------
    const [recentSearches, setRecentSearches] = useLocalStorage("recents", "");
    const [pinned, setPinned] = useLocalStorage("pinned", []);

    // ------ Retrieve pinned forecasts ------
    useEffect(() => {
        // TODO
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        console.log(`Searching for ${search}`);
    };

    const findLocation = (event) => {
        event.preventDefault();
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLoading(false);
                console.log(
                    `latitude: ${position.coords.latitude}\nlongitude: ${position.coords.longitude}`
                );
            },
            (error) => {
                setLoading(false);
                setErrorMessage("Location access was denied");
                setTimeout(() => {
                    setErrorMessage(null);
                }, 4000);
                console.log(error);
            }
        );
    };

    return (
        <>
            <RainbowBar width="15px" />
            {/* <RainbowBar className="test" /> */}
            <header>
                <h1>Weather for Humans</h1>
                <h4>Forecasts of UTCI and WBGT</h4>
            </header>
            {/* <RainbowBar width="17px" /> */}

            <img src={map} alt="global temperatures" />
            <div className="searchContainer">
                <form onSubmit={handleSearch}>
                    <input
                        className="search"
                        type="search"
                        value={search}
                        name="search"
                        autocomplete="off"
                        placeholder="Search Locations"
                        onChange={({ target }) => setSearch(target.value)}
                    />
                    {/* <button
                    type="button"
                    className="plain-button"
                    onClick={findLocation}
                >
                    <MdMyLocation />
                </button> */}
                </form>
                <button
                    className="sub-button"
                    type="button"
                    onClick={findLocation}
                >
                    {loading ? (
                        <span class="loader"></span>
                    ) : (
                        <MdMyLocation className="icon" />
                    )}
                    {/* Q: Does nesting button text inside a div affect accessibility? */}
                    <div id="spacingFix">Current Location</div>
                </button>
                {/* <p className="recents">
                    <span className="bold">Recents:</span>&emsp;
                    <a href="./">Raleigh NC,</a>&ensp;
                    <a href="./">Fleetwood NC</a>
                </p> */}
            </div>

            <Error message={errorMessage} />

            <About />

            <RainbowBar width="20px" />
        </>
    );
}

export default App;
