import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

const status = axios.create({
    baseURL: "/api/status",
});

const getStatus = async () => {
    const res = await status.get();
    return res.data;
};

const fiveMinMillisec = 5 * 60 * 1000;

const useStatus = () => {
    const queryClient = useQueryClient();
    const currentStatus = useRef(null);
    const isFirstFetch = useRef(true);

    return useQuery(["status", "test"], getStatus, {
        cacheTime: fiveMinMillisec,
        staleTime: fiveMinMillisec,
        refetchInterval: fiveMinMillisec,
        onSuccess: (status) => {
            if (isFirstFetch.current) {
                currentStatus.current = status;
                isFirstFetch.current = false;
            } else if (
                status.latestSuccessfulUpdateSource !==
                currentStatus.current.latestSuccessfulUpdateSource
            ) {
                currentStatus.current = status;
                // fetch new forecasts and charts
                queryClient.invalidateQueries({ queryKey: ["forecast"] });
                queryClient.invalidateQueries({ queryKey: ["chart"] });
            }
        },
        // Already Default: refetchOnWindowFocus: true,
        // Already Default: refetchOnReconnect: true
    });
};

export default useStatus;
