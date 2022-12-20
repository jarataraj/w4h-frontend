import ButtonSwitch from "./ButtonSwitch";
const ForecastFooter = ({
    forecastTimescale,
    toggleHourly,
    units,
    toggleUnits,
    thermalIndex,
    toggleThermalIndex,
}) => {
    return (
        <div className="forecast-footer">
            <h2 className="forecast-footer-buttons-label">{"Change to:"}</h2>
            <div className="forecast-footer-buttons">
                <ButtonSwitch
                    className="toggle-units"
                    name={units === "C" ? "\u00B0F" : "\u00B0C"}
                    onClick={() => toggleUnits()}
                />
                <ButtonSwitch
                    className="toggle-thermal-index"
                    name={thermalIndex === "UTCI" ? "wbgt" : "utci"}
                    onClick={() => {
                        toggleThermalIndex();
                    }}
                />
                <ButtonSwitch
                    className="toggle-forecast-timescale"
                    name={
                        forecastTimescale === "hourly"
                            ? "daily"
                            : forecastTimescale === "daily"
                            ? "hourly"
                            : ""
                    }
                    // Not sure why onClick must be arrow func but breaks otherwise
                    onClick={() => toggleHourly()}
                    animationDuration={0.2}
                />
            </div>
        </div>
    );
};

export default ForecastFooter;
