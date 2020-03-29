import {useEffect, useState} from "react";
import {getRequest} from "./request";
import {useDispatch, useSelector} from "react-redux";
import {isEqual} from 'lodash';
import {breadCrumbsSlice} from "./slices";

export const useReduxFetch = ({url, key, selector, onSuccess}) => {
    const dispatch = useDispatch();
    const data = useSelector(selector);

    const [isLoading, setLoading] = useState(!isEqual(key, data.key));

    useEffect(() => {
        if (!isLoading) return;

        dispatch(breadCrumbsSlice.actions.setLoading(true));

        getRequest(url).then(data => {
            onSuccess(dispatch, data);
            setLoading(false);
            dispatch(breadCrumbsSlice.actions.setLoading(false));
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, key);

    return {data, isLoading};
};