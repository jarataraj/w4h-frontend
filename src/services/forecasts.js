import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import decodeRawForecastData from "utils/decodeRawForecastData";

const forecasts = axios.create({
    baseURL: "/api/forecast",
});

const getForecastById = async ({ queryKey }) => {
    const [key, id] = queryKey;
    const params = {
        id,
    };
    const res = await forecasts.get("", { params });
    return decodeRawForecastData(res.data);
};
const useForecast = (location, onSuccess, onError) => {
    return useQuery(["forecast", location?.forecastId], getForecastById, {
        enabled: Boolean(location),
        onSuccess,
        onError,
        cacheTime: 60 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
        // Already Default: refetchOnWindowFocus: true,
        // Already Default: refetchOnReconnect: true
    });
};

export default useForecast;
