import { BsPin, BsPinFill } from "react-icons/bs";
import { IoMapOutline, IoMap } from "react-icons/io5";
import ButtonSwitch from "./ButtonSwitch";

const ForecastHeader = ({
    forecasts,
    setForecasts,
    location,
    showKey,
    toggleShowKey,
    isPinned,
    // nonPinnedForecast,
    // setNonPinnedForecast,
    // pinnedForecasts,
    // setPinnedForecasts,
}) => {
    const pinForecast = () => {
        // unpinned will only ever be the first forecast
        setForecasts([
            { ...forecasts[0], isPinned: true },
            ...forecasts.slice(1),
        ]);
    };
    const unPinForecast = () => {
        if (forecasts[0].key === location.key) {
            // keep forecast as unpinned if it is the first forecast, otherwise...
            setForecasts([
                { ...forecasts[0], isPinned: false },
                ...forecasts.slice(1),
            ]);
        } else {
            // ... remove the forecast
            setForecasts(
                forecasts.filter((forecast) => forecast.key !== location.key)
            );
        }
    };
    // const pinForecastOld = () => {
    //     // limit to 10 pinned forecasts for now
    //     setPinnedForecasts(
    //         [{ ...location, animateEntrance: false }].concat(
    //             pinnedForecasts.slice(0, 9)
    //         )
    //     );
    //     setNonPinnedForecast(null);
    // };
    // const unPinForecastOld = () => {
    //     setPinnedForecasts(
    //         pinnedForecasts.filter(
    //             (pinnedLocation) => pinnedLocation !== location
    //         )
    //     );
    //     if (!nonPinnedForecast) {
    //         setNonPinnedForecast({ ...location, animateEntrance: false });
    //     }
    // };
    const toggleIsPinned = () => {
        if (isPinned) {
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
                    title={isPinned ? "Un-pin forecast" : "Pin forecast"}
                    onClick={toggleIsPinned}
                >
                    {isPinned ? (
                        <BsPinFill className="pinned-icon" />
                    ) : (
                        <BsPin className="pin-icon" />
                    )}
                    {isPinned ? (
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
                    name={showKey ? "hide key" : "show key"}
                    onClick={toggleShowKey}
                    animationDelay={0.2}
                    animationDuration={0.2}
                />
            </div>
        </div>
    );
};

export default ForecastHeader;
