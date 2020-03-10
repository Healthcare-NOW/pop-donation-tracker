import React from "react";

export const handleEmptyList = (listBuilder, elements) => {
    if (elements.length > 0) {
        return listBuilder()
    } else {
        return <span>None</span>;
    }
};