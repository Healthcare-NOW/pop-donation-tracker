import {useEffect, useState} from "react";
import {getRequest} from "./request";

export const useFetch = (url, initialData) => {
    const [data, setData] = useState(initialData);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getRequest(url).then(data => {
            setLoading(false);
            setData(data);
        })
    }, [url]);

    return {data, isLoading}
};