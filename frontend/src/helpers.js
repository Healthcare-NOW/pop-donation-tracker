import {partyDisplayNames} from "./constants";
import {truncate} from 'lodash';

export const candidateDisplayName = ({candidate, maxLength}) => {
    const {name} = candidate;
    const partyAffiliation = candidatePartyAffiliation(candidate);
    const partyAffiliationDisplay = partyDisplayNames[partyAffiliation] || partyAffiliation;
    const truncatedName = maxLength ? truncate(name, maxLength) : name;
    return `${truncatedName} (${partyAffiliationDisplay})`;
};

export const candidatePartyAffiliation = (candidate) => {
    return candidate.campaigns[0].partyAffiliation;
}

export const displayZip = (zip) => {
    const nineDigitZip = /^\d{9}$/;
    if (nineDigitZip.test(zip)) {
        return zip.slice(0, 5) + "-" + zip.slice(5)
    } else return zip
};