import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import decodeRawForecastData from "utils/decodeRawForecastData";

const search = axios.create({
    baseURL: "/api/search",
});

const searchLocation = async ({ queryKey }) => {
    const [key, query] = queryKey;
    const params = {
        location: query,
    };
    const res = await search.get("", { params });
    let { location, forecast } = res.data;
    forecast = decodeRawForecastData(forecast);
    return { location, forecast };
};

const searchLatLon = async ({ queryKey }) => {
    const [key, { lat, lon }] = queryKey;
    const params = {
        lat,
        lon,
    };
    const res = await search.get("", { params });
    let { location, forecast } = res.data;
    forecast = decodeRawForecastData(forecast);
    return { location, forecast };
};

const useGeolocate = (query, onSuccess, onError) => {
    return useQuery(["search", query], searchLocation, {
        enabled: Boolean(query),
        onSuccess,
        onError,
        // Prevent retries from overloading Nominatim service
        retry: false,
    });
};

const useReverseGeolocate = (query, onSuccess, onError) => {
    return useQuery(["search", query], searchLatLon, {
        enabled: Boolean(query),
        onSuccess,
        onError,
        // Prevent retries from overloading Nominatim service
        retry: false,
    });
};

export { useGeolocate, useReverseGeolocate };
