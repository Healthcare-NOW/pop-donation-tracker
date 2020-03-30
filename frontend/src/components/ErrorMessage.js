import React from 'react';
import {errorsSelector} from "../selectors";
import {useSelector} from "react-redux";
import {Message} from "semantic-ui-react";

export const ErrorMessage = () => {
    const {hasError} = useSelector(errorsSelector);
    return (
        <Message negative hidden={!hasError}>
            <Message.Header>We're sorry, there's been an unforeseen error.</Message.Header>
            <p>We're aware of the problem and are working on a fix.</p>
        </Message>
    )
};