import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const reverseGeolocation = axios.create({
    baseURL: "https://nominatim.openstreetmap.org",
});

// for params: https://nominatim.org/release-docs/develop/api/Search/
// sample: https://nominatim.openstreetmap.org/search.php?q=raleigh&format=jsonv2&limit=1&addressdetails=1&namedetails=1
const getLocation = async ({ queryKey }) => {
    const [key, lat, lon] = queryKey;
    const params = {
        lat: lat,
        lon: lon,
        email: "admin@weatherforhumans.com",
        format: "jsonv2",
        limit: 1,
        addressdetails: 1,
    };
    const res = await reverseGeolocation.get("/search?", { params });
    return res.data;
};

const useReverseLocationSearch = (query, onSuccess, onError) => {
    return useQuery(["search", query], getLocation, {
        enabled: Boolean(query),
        onSuccess,
        onError,
    });
};

export default useReverseLocationSearch;
