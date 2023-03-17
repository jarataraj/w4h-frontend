import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

const getChart = async (queryKey, source_date) => {
    const [, date, highsOrLows] = queryKey;
    const res = await axios.get(
        `https://weatherforhumans.b-cdn.net/${date}Z/${date}Z_utci_${highsOrLows.toLowerCase()}_from_gfs_data_up_to_${source_date}.png`,
        {
            responseType: "blob",
        }
    );
    // const res = await charts.get(`/${date}_UTCI_${highLow}_highres.png`, {
    //     responseType: "blob",
    // });
    return await blobToDataURL(res.data);
};

const useChart = (date, highsOrLows, source_date, enable) => {
    return useQuery({
        queryKey: ["chart", date, highsOrLows],
        queryFn: ({ queryKey }) => getChart(queryKey, source_date),
        enabled: enable,
        cacheTime: 10 * 60 * 1000,
        staleTime: "Infinity",
        // Refetches when queryClient.invalidateQueries()
        refetchInterval: false,
        // Already Default: refetchOnWindowFocus: true,
        // Already Default: refetchOnReconnect: true
    });
};

export default useChart;
