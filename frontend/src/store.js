import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {stateSummarySlice} from "./slices";

const rootReducer = combineReducers({
    stateSummary: stateSummarySlice.reducer
});

export const store = configureStore({
    reducer: rootReducer
});