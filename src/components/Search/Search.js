import { useState, useRef } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { useQueryClient } from "@tanstack/react-query";
import decodeRawForecastData from "utils/decodeRawForecastData";
import SearchInput from "./SearchInput";
import RecentSearches from "./RecentSearches";
import CurrentLocation from "./CurrentLocation";
import Error from "./Error";

const Search = ({ forecasts, newForecast, openCoverage }) => {
    // ====== State ======
    const searchContainer = useRef();
    const queryClient = useQueryClient();
    // ------ Search Input ------
    const searchInput = useRef();
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingSearchInput, setIsLoadingSearchInput] = useState(false);
    // ------ Recent Locations ------
    const [forecastRecentLocation, setForecastRecentLocation] = useState();
    const [recentLocations, setRecentLocations] = useLocalStorage(
        "recentLocationsV8",
        []
    );
    const addRecent = (latestLocation) => {
        // Add new recent to beginning of recents
        let newRecentLocations = [latestLocation].concat(
            recentLocations
                // Remove any duplicate recents
                .filter((location) => location.name !== latestLocation.name)
                //Limit to maximum of 3 other recents
                .slice(0, 3 + forecasts.length)
        );
        // Set recents
        setRecentLocations(newRecentLocations);
    };
    // ------ Current Location ------
    const [reverseGeolocateCoords, setReverseGeolocateCoords] = useState();
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
        useState(false);
    // ------ Errors ------
    const [searchError, setSearchError] = useState(null);
    const newError = (error) => {
        let message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            error;
        if (message.slice(0, 16) === "No forecast for ") {
            message = (
                <>
                    {`${message}. See `}
                    <a
                        className="search-error-coverage-link"
                        href="https://duckduckgo.com"
                        onClick={(e) => {
                            e.preventDefault();
                            openCoverage();
                        }}
                    >
                        coverage
                    </a>
                </>
            );
        }
        setSearchError({ key: Date.now(), message });
    };
    const clearError = () => {
        setSearchError(null);
    };

    // ====== On Search Success/Error ======
    const resetSearchState = () => {
        setSearchQuery("");
        setReverseGeolocateCoords();
        setForecastRecentLocation();
        searchInput.current.blur();
        setInput("");
        setIsLoadingSearchInput(false);
        setIsLoadingCurrentLocation(false);
    };

    const onSuccess = ({ location, forecast }) => {
        // Add forecast data to forecast query cache
        queryClient.setQueryData(["forecast", location.forecastId], forecast);
        // Remove any previous errors if no error
        clearError(null);
        // Create new forecast
        newForecast(location);
        addRecent(location);
        // Reset all search state
        resetSearchState();
    };

    const onError = (error) => {
        newError(error);
        resetSearchState();
    };

    return (
        <>
            <div className="search-container" ref={searchContainer}>
                <SearchInput
                    searchInput={searchInput}
                    input={input}
                    setInput={setInput}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isLoadingSearchInput={isLoadingSearchInput}
                    onSuccess={onSuccess}
                    onError={onError}
                />
                <div className="search-error-veil">
                    {!!recentLocations.length && (
                        <RecentSearches
                            forecasts={forecasts}
                            newForecast={newForecast}
                            recentLocations={recentLocations}
                            addRecent={addRecent}
                            forecastRecentLocation={forecastRecentLocation}
                            setForecastRecentLocation={
                                setForecastRecentLocation
                            }
                            input={input}
                            setInput={setInput}
                            setIsLoadingSearchInput={setIsLoadingSearchInput}
                            resetSearchState={resetSearchState}
                            onSuccess={onSuccess}
                            onError={onError}
                        />
                    )}
                    <CurrentLocation
                        isLoadingCurrentLocation={isLoadingCurrentLocation}
                        setIsLoadingCurrentLocation={
                            setIsLoadingCurrentLocation
                        }
                        reverseGeolocateCoords={reverseGeolocateCoords}
                        setReverseGeolocateCoords={setReverseGeolocateCoords}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </div>
                {/* <div className="search-container-background"></div> */}
                {searchError && (
                    <Error
                        key={searchError.key}
                        error={searchError}
                        originBox={searchContainer}
                        setError={setSearchError}
                    />
                )}
            </div>
        </>
    );
};

export default Search;
