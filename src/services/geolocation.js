import axios from "axios";
import { useQuery } from "react-query";

const geolocation = axios.create({
    baseURL: "https://nominatim.openstreetmap.org",
});

// for params: https://nominatim.org/release-docs/develop/api/Search/
// sample: https://nominatim.openstreetmap.org/search.php?q=raleigh&format=jsonv2&limit=1&addressdetails=1&namedetails=1
const getLocation = async ({ queryKey }) => {
    const [key, query] = queryKey;
    const params = {
        q: query,
        email: "admin@weatherforhumans.com",
        format: "jsonv2",
        limit: 1,
        addressdetails: 1,
    };
    const res = await geolocation.get("/search?", { params });
    return res.data;
};

const useLocationSearch = (query, onSuccess, onError) => {
    return useQuery(["search", query], getLocation, {
        enabled: Boolean(query),
        onSuccess,
        onError,
    });
};

export default useLocationSearch;
