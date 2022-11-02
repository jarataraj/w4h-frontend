import axios from "axios";
import { useQuery } from "react-query";

const charts = axios.create({
    baseURL: "http://localhost:3003/charts",
});

const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
    });
};

const getChart = async ({ queryKey }) => {
    const [key, date, highLow, fullscreen] = queryKey;
    const id = fullscreen
        ? `${date}_${highLow}_highres.png`
        : `${date}_${highLow}.png`;
    const res = await charts.get(`/${id}`, {
        responseType: "blob",
    });
    return await blobToDataURL(res.data);
};

const useChart = (date, highLow, fullscreen, enable) => {
    return useQuery(["chart", date, highLow, fullscreen], getChart, {
        enabled: enable,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
        // Already Default: refetchOnWindowFocus: true,
        // Already Default: refetchOnReconnect: true
    });
};

export default useChart;
