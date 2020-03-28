import {createSlice} from "@reduxjs/toolkit";

export const stateSummarySlice = createSlice({
    name: 'stateSummary',
    initialState: {
        key: null,
        state: null,
        year: null,
        senate: [],
        house: []
    },
    reducers: {
        receiveData: (state, action) => action.payload
    }
});