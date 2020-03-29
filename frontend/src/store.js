import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {
    stateSummarySlice,
    candidateSummarySlice,
    flaggedIndividualContributionsSlice,
    breadCrumbsSlice
} from "./slices";

const rootReducer = combineReducers({
    stateSummary: stateSummarySlice.reducer,
    candidateSummary: candidateSummarySlice.reducer,
    flaggedIndividualContributions: flaggedIndividualContributionsSlice.reducer,
    breadcrumbs: breadCrumbsSlice.reducer
});

export const store = configureStore({
    reducer: rootReducer
});