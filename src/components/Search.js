import { useState } from "react";
import { MdMyLocation, MdClear } from "react-icons/md";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useLocationSearch from "../services/geolocation";
import { useQuery } from "react-query";
import Error from "./Error";
import SpinLoader from "./SpinLoader";

const Search = ({ nonPinned, setNonPinned }) => {
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [recents, setRecents] = useLocalStorage("recents", []);
    const onSearchSuccess = ([data]) => {
        console.log(`found ${searchQuery}`);
        const { lat, lon } = data;
        const splitName = data["display_name"].split(",");
        let name = data.address.city || splitName[0];
        if (data.address.state) {
            name = name + ", " + data.address["ISO3166-2-lvl4"].split("-")[1];
        } else if (data.address.country) {
            name = name + ", " + data.address.country;
        } else if (splitName[1]) {
            name = name + ", " + splitName[1];
        }
        let newLocation = { lat, lon, name };
        if (data["osm_id"] && data["osm_type"]) {
            newLocation.link = `https://www.openstreetmap.org/${data.osm_type}/${data.osm_id}`;
        }
        newLocation.forecastLat = (Math.round(parseFloat(lat) * 4) / 4).toFixed(
            2
        );
        newLocation.forecastLon = (Math.round(parseFloat(lon) * 4) / 4).toFixed(
            2
        );
        console.log(newLocation);
        setNonPinned(newLocation);
        setSearchQuery("");
        setInput("");
    };
    const onSearchError = (error) => {
        setErrorMessage(error.message);
        setSearchQuery("");
        setInput("");
    };
    useLocationSearch(searchQuery, onSearchSuccess, onSearchError);

    const findLocation = (event) => {
        event.preventDefault();
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLoadingLocation(false);
                // setNonPinned(getForecastID(position.coords.latitude, position.coords.longitude))
                console.log(
                    `latitude: ${position.coords.latitude}\nlongitude: ${position.coords.longitude}`
                );
            },
            (error) => {
                setLoadingLocation(false);
                setErrorMessage("Location access was denied");
                setTimeout(() => {
                    setErrorMessage(null);
                }, 4000);
                console.log(error);
            }
        );
    };

    const onSearch = (e) => {
        e.preventDefault();
        console.log(`Searching for ${input}`);
        setSearchQuery(input);
    };

    return (
        <>
            <div className="search-container">
                <form className="search-form" onSubmit={onSearch}>
                    <input
                        className="search-input"
                        type="search"
                        value={input}
                        name="search"
                        autoComplete="off"
                        placeholder="Search Locations"
                        onChange={({ target }) => setInput(target.value)}
                    />
                    {input && !searchQuery && (
                        <button
                            className="clear-search position-in-searchbar"
                            type="button"
                            onClick={() => setInput("")}
                        >
                            <MdClear />
                        </button>
                    )}
                    {searchQuery && (
                        <SpinLoader className="search-loader position-in-searchbar" />
                    )}
                </form>
                {/* <p className="recents">
                    <span className="bold">Recents:</span>&emsp;
                    <a href="./">Raleigh NC,</a>&ensp;
                    <a href="./">Fleetwood NC</a>
                </p> */}
                <button
                    className="sub-button"
                    type="button"
                    onClick={findLocation}
                >
                    {loadingLocation ? (
                        <SpinLoader />
                    ) : (
                        <MdMyLocation className="icon" />
                    )}
                    {/* Q: Does nesting button text inside a div affect accessibility? */}
                    <div id="spacingFix">Current Location</div>
                </button>
            </div>
            <Error message={errorMessage} />
        </>
    );
};

export default Search;
