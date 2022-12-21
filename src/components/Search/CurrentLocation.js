import { useReverseGeolocate } from "services/search";
import SpinLoader from "components/SpinLoader";
import { MdMyLocation } from "react-icons/md";

const CurrentLocation = ({
    isLoadingCurrentLocation,
    setIsLoadingCurrentLocation,
    reverseGeolocateCoords,
    setReverseGeolocateCoords,
    onSuccess,
    onError,
}) => {
    // ====== Geolocating using browser current location ======
    // (i.e. user has clicked the "Current Location" button)
    const determineCurrentLocation = (event) => {
        event.preventDefault();
        setIsLoadingCurrentLocation(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setReverseGeolocateCoords({
                    lat: coords.latitude,
                    lon: coords.longitude,
                });
            },
            (error) => {
                onError("Location access was denied");
            }
        );
    };

    // De-activate query onSuccess (otherwise a query observer persists
    // regardless of whether a forecast for the current location is shown
    // or not)
    // const onReverseGeolocateSuccess = () => {
    //     onSuccess();
    //     setReverseGeolocateCoords;
    // };

    useReverseGeolocate(reverseGeolocateCoords, onSuccess, onError);

    return (
        <div className="current-location-container">
            <button
                className="current-location"
                type="button"
                onClick={determineCurrentLocation}
            >
                {isLoadingCurrentLocation ? (
                    <SpinLoader className="current-location-loader" />
                ) : (
                    <MdMyLocation className="icon" />
                )}
                {/* Q: Does nesting button text inside a div affect accessibility? */}
                <div id="spacingFix">Current Location</div>
            </button>
        </div>
    );
};

export default CurrentLocation;
