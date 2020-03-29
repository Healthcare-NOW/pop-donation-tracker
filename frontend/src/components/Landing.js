import React from 'react';
import {Header, Container} from "semantic-ui-react";
import {StateSelector} from "./StateSelector";

const Landing = () => (
    <Container textAlign="center">
        <Header as='h1'>Choose a state:</Header>
        <StateSelector />
    </Container>
);

export default Landing;

