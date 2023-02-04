import useIsNewlyMounted from "hooks/useIsNewlyMounted";
import { BsPin, BsPinFill } from "react-icons/bs";
import { IoMapOutline, IoMap } from "react-icons/io5";
import ButtonSwitch from "components/ButtonSwitch";
import { useMediaQuery } from "@mui/material";

const ForecastHeader = ({
    forecasts,
    setForecasts,
    location,
    showKey,
    toggleShowKey,
    newAlert,
}) => {
    const isNewlyMounted = useIsNewlyMounted();
    const useCompactKeyButton = useMediaQuery(
        "@media screen and (max-width: 390px)"
    );
    const pinForecast = () => {
        // unpinned will only ever be the first forecast
        setForecasts([
            { ...forecasts[0], isPinned: true },
            ...forecasts.slice(1),
        ]);
        newAlert("Pinned");
    };
    const unPinForecast = () => {
        if (forecasts[0].key === location.key) {
            // keep forecast as unpinned if it is the first forecast, otherwise...
            setForecasts([
                { ...forecasts[0], isPinned: false },
                ...forecasts.slice(1),
            ]);
            newAlert("Unpinned");
        } else {
            // ... remove the forecast
            setForecasts(
                forecasts.filter((forecast) => forecast.key !== location.key)
            );
        }
    };
    const toggleIsPinned = () => {
        if (location.isPinned) {
            unPinForecast();
        } else {
            pinForecast();
        }
    };

    return (
        <div className="forecast-header">
            <h2 className="forecast-location">{location.name}</h2>
            <div className="forecast-header-buttons">
                <button
                    className="pin-button"
                    title={
                        location.isPinned ? "Un-pin forecast" : "Pin forecast"
                    }
                    onClick={toggleIsPinned}
                >
                    {location.isPinned ? (
                        <BsPinFill className="pinned-icon" />
                    ) : (
                        <BsPin className="pin-icon" />
                    )}
                    {location.isPinned ? (
                        <BsPinFill className="pinned-icon--hovered" />
                    ) : (
                        <BsPinFill className="pin-icon--hovered" />
                    )}
                </button>
                <button className="map-button" title="Show on map">
                    <a href={location.link}>
                        <IoMapOutline className="map-icon" />
                        <IoMap className="map-icon--hovered" />
                    </a>
                </button>
                <ButtonSwitch
                    className="toggle-key"
                    name={
                        useCompactKeyButton
                            ? "key"
                            : showKey
                            ? "hide key"
                            : "show key"
                    }
                    onClick={toggleShowKey}
                    animationDelay={isNewlyMounted ? 0 : 0.2}
                    animationDuration={isNewlyMounted ? 0 : 0.2}
                    crossOut={useCompactKeyButton && showKey}
                />
            </div>
        </div>
    );
};

export default ForecastHeader;
