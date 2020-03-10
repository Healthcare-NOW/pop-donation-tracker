import {partyDisplayNames} from "./constants";

export const candidateDisplayName = (candidate) => {
    const {name, partyAffiliation} = candidate;
    const partyAffiliationDisplay = partyDisplayNames[partyAffiliation] || partyAffiliation;
    return `${name} (${partyAffiliationDisplay})`;
};