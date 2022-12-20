import { useRef, useState } from "react";
import useVisibleOnlyInViewport from "hooks/useVisibleOnlyInViewport";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useForecast from "services/forecasts";

const RecentSearches = ({
    forecasts,
    newForecast,
    recentLocations,
    addRecent,
    // nonPinnedForecast,
    // setNonPinnedForecast,
    // pinnedForecasts,
    input,
    setInput,
    setIsLoadingSearchInput,
    resetSearchState,
    onSuccess,
    onError,
}) => {
    const recentsContainer = useRef();
    const queryClient = useQueryClient();
    const [forecastLocation, setForecastLocation] = useState();

    let recents = recentLocations;
    // NEW
    // remove any forecasted locations
    // ENHANCEMENT: optimize (don't map for every location)
    recents = recents.filter((location) => {
        return !forecasts.map((loc) => loc.name).includes(location.name);
    });
    // OLD
    // remove any forecasted locations
    // recents = recents.filter((location) => {
    //     return !pinnedForecasts.map((loc) => loc.name).includes(location.name);
    // });
    // if (nonPinnedForecast) {
    //     recents = recents.filter(
    //         (location) => location.name !== nonPinnedForecast.name
    //     );
    // }
    // limit to three recents
    recents = recents.slice(0, 3);

    // ENHANCEMENT: react to changes in container width due to responsive resizing
    useVisibleOnlyInViewport(recentsContainer, ".recent-item", recents);

    // Add location to onSuccess
    const onForecastRecentSuccess = (forecast) =>
        onSuccess({ location: forecastLocation, forecast });

    useForecast(forecastLocation, onForecastRecentSuccess, onError);

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
                setForecastLocation(location);
            }
        };
    };

    if (recents.length) {
        return (
            <motion.p
                className="recent-locations"
                ref={recentsContainer}
                initial={{ height: 0, marginTop: 0 }}
                animate={{ height: "auto", marginTop: ".5em" }}
                transition={{ duration: 0.7 }}
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
                            <span className="recent-item" key={location.name}>
                                &emsp;
                                <a href="./" onClick={onRecentClick(location)}>
                                    {location.name}
                                </a>
                            </span>
                        );
                    }
                })}
            </motion.p>
        );
    }
};

export default RecentSearches;
