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

export const candidateSummarySlice = createSlice({
    name: 'candidateSummary',
    initialState: {
        candidate: {committees: []},
        flaggedIndividualContributions: [],
        flaggedCommitteeContributions: []
    },
    reducers: {
        receiveData: (state, action) => action.payload
    }
});

export const flaggedIndividualContributionsSlice = createSlice({
    name: 'flaggedIndividualContributions',
    initialState: {
        candidate: {},
        contributions: []
    },
    reducers: {
        receiveData: (state, action) => action.payload
    }
});

export const breadCrumbsSlice = createSlice({
    name: 'breadcrumbs',
    initialState: {
        isLoading: true,
        state: null,
        year: null,
        candidate: {
            id: null,
            name: null,
            partyAffiliation: null
        }
    },
    reducers: {
        receiveData: (state, action) => ({
            ...state,
            ...action.payload
        }),
        setLoading: (state, action) => {
            state.isLoading = action.payload
        }
    }
});

export const errorsSlice = createSlice({
    name: 'errors',
    initialState: {
        hasError: false
    },
    reducers: {
        setHasError: (state, action) => {
            state.hasError = action.payload
        }
    }
});