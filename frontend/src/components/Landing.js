import React from 'react';
import {Header} from "semantic-ui-react";
import {StateSelector} from "./StateSelector";

const Landing = () => (
    <div>
        <Header as='h1'>Choose a state</Header>
        <StateSelector />
    </div>
);

export default Landing;

