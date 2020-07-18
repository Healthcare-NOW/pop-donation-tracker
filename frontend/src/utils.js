import React from "react";
import {stateOptions} from "./constants";
import {keyBy} from 'lodash';

export const handleEmptyList = (listBuilder, elements) => {
    if (elements.length > 0) {
        return listBuilder()
    } else {
        return <span>None</span>;
    }
};

const statesByAbbreviation = keyBy(stateOptions, ({key}) => key);

export const stateFromAbbreviation = (abbr) => statesByAbbreviation[abbr].text;