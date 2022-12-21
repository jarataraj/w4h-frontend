import { useRef, useContext } from "react";
import useVisibleOnlyInViewport from "hooks/useVisibleOnlyInViewport";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import useForecast from "services/forecasts";
import { AppNewlyMountedContext } from "App";

const RecentSearches = ({
    forecasts,
    newForecast,
    recentLocations,
    addRecent,
    forecastRecentLocation,
    setForecastRecentLocation,
    input,
    setInput,
    setIsLoadingSearchInput,
    resetSearchState,
    onSuccess,
    onError,
}) => {
    const appIsNewlyMounted = useContext(AppNewlyMountedContext);
    const recentsContainer = useRef();
    const queryClient = useQueryClient();

    let recents = recentLocations;
    // remove any forecasted locations
    // ENHANCEMENT: optimize (don't map for every location)
    recents = recents.filter((location) => {
        return !forecasts.map((loc) => loc.name).includes(location.name);
    });
    // limit to three recents
    recents = recents.slice(0, 3);

    // ENHANCEMENT: react to changes in container width due to responsive resizing
    useVisibleOnlyInViewport(recentsContainer, ".recent-item", recents);

    // Add location to onSuccess
    const onForecastRecentSuccess = (forecast) =>
        onSuccess({ location: forecastRecentLocation, forecast });

    useForecast(forecastRecentLocation, onForecastRecentSuccess, onError);

    const onRecentClick = (location) => {
        return (e) => {
            e.preventDefault();
            const cachedForecastData = queryClient.getQueryData([
                "forecast",
                location.forecastId,
            ]);
            if (cachedForecastData) {
                newForecast(location);
                addRecent(location);
                resetSearchState();
            } else {
                // if forecast data fetch is needed, simulate search for location while forecast data loads
                setInput(location.name);
                setIsLoadingSearchInput(true);
                setForecastRecentLocation(location);
            }
        };
    };

    return (
        <AnimatePresence>
            {recents.length && (
                <motion.p
                    className="recent-locations"
                    ref={recentsContainer}
                    initial={{ height: 0, marginTop: 0 }}
                    animate={{ height: "auto", marginTop: ".5em" }}
                    exit={{ height: 0, marginTop: 0 }}
                    transition={{ duration: appIsNewlyMounted ? 0 : 0.7 }}
                >
                    <span className="bold">Recent:</span>&emsp;
                    {recents.map((location, i) => {
                        if (i === 0) {
                            return (
                                // First recent has no space and not part of useVisibleOnlyInViewport
                                <a
                                    href="./"
                                    key={location.name}
                                    onClick={onRecentClick(location)}
                                >
                                    {location.name}
                                </a>
                            );
                        } else {
                            return (
                                // Additional recents preceded by a space and are in useVisibleOnlyInViewport
                                <span
                                    className="recent-item"
                                    key={location.name}
                                >
                                    &emsp;
                                    <a
                                        href="./"
                                        onClick={onRecentClick(location)}
                                    >
                                        {location.name}
                                    </a>
                                </span>
                            );
                        }
                    })}
                </motion.p>
            )}
        </AnimatePresence>
    );
};

export default RecentSearches;
