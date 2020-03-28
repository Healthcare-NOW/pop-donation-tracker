import {useEffect, useState} from "react";
import {getRequest} from "./request";
import {useDispatch, useSelector} from "react-redux";
import {isEqual} from 'lodash';

export const useReduxFetch = ({url, key, selector, action}) => {
    const dispatch = useDispatch();
    const data = useSelector(selector);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {

        if (isEqual(key, data.key)) {
            setLoading(false);
            return;
        }
        getRequest(url).then(data => {
            setLoading(false);
            dispatch(action({
                key,
                ...data
            }));
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, key);

    return {data, isLoading};
};