import Forecast from "./Forecast";
import useForecast from "services/forecasts";

const ForecastFacade = ({
    forecasts,
    setForecasts,
    units,
    toggleUnits,
    thermalIndex,
    toggleThermalIndex,
    location,
}) => {
    const forecast = useForecast(location);

    if (forecast.isSuccess) {
        return (
            <Forecast
                forecasts={forecasts}
                setForecasts={setForecasts}
                units={units}
                toggleUnits={toggleUnits}
                thermalIndex={thermalIndex}
                toggleThermalIndex={toggleThermalIndex}
                location={location}
                data={forecast.data}
            />
        );
    } else if (forecast.isError) {
        return (
            // TODO: style/format error
            <h4 className="forecast-error">{`Error loading forecast for ${location.name}`}</h4>
        );
    } else {
        return;
    }
};

export default ForecastFacade;
