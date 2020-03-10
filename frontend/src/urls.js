export const stateSummaryApiUrl = (year, state) => `/api/year/${year}/state/${state}`;

export const stateSummaryUrl = (year, state) => `/year/${year}/state/${state}`;

export const candidateSummaryApiUrl = (candidateId) => `/api/candidate/${candidateId}`;

export const candidateSummaryUrl = (candidateId) => `/candidate/${candidateId}`;

export const flaggedIndividualContributionsApiUrl = (candidateId, employerId) =>
    `/api/candidate/${candidateId}/flagged-employer/${employerId}`;

export const flaggedIndividualContributionsUrl = (candidateId, employerId) =>
    `/candidate/${candidateId}/flagged-employer/${employerId}`;