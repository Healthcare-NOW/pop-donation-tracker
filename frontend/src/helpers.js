import {partyDisplayNames} from "./constants";

export const candidateDisplayName = (candidate) => {
    const {name, partyAffiliation} = candidate;
    const partyAffiliationDisplay = partyDisplayNames[partyAffiliation] || partyAffiliation;
    return `${name} (${partyAffiliationDisplay})`;
};

export const displayZip = (zip) => {
    const nineDigitZip = /^\d{9}$/;
    if (nineDigitZip.test(zip)) {
        return zip.slice(0, 5) + "-" + zip.slice(5)
    } else return zip
};