import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {stateSummarySlice, candidateSummarySlice, flaggedIndividualContributionsSlice} from "./slices";

const rootReducer = combineReducers({
    stateSummary: stateSummarySlice.reducer,
    candidateSummary: candidateSummarySlice.reducer,
    flaggedIndividualContributions: flaggedIndividualContributionsSlice.reducer
});

export const store = configureStore({
    reducer: rootReducer
});