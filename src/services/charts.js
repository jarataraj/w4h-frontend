import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const charts = axios.create({
    baseURL: "/charts",
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
    const [key, date, highLow] = queryKey;
    const res = await charts.get(`/${date}_UTCI_${highLow}_highres.png`, {
        responseType: "blob",
    });
    return await blobToDataURL(res.data);
};

const useChart = (date, highLow, enable) => {
    return useQuery(["chart", date, highLow], getChart, {
        enabled: enable,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
        // Already Default: refetchOnWindowFocus: true,
        // Already Default: refetchOnReconnect: true
    });
};

export default useChart;
