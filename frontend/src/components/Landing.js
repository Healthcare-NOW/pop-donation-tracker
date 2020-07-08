import React from 'react';
import {Message} from "semantic-ui-react";
import {StateSelector} from "./StateSelector";

const Landing = () => (

    <Message size='large'>
        <p><b>The <a href={'https://patientsoverprofits.org'}>Patients Over Profits campaign</a> calls on candidates for
            Congress to reject donations from healthcare corporations and executives who are funding opposition to
            Medicare for All.</b> You can use this Tracker to quickly identify candidates in your state who have
            accepted donations from flagged corporations and executives, and to ensure that candidates who have taken
            the pledge are abiding by it.
        </p>

        <p><b>Select your home state to begin your search.</b></p>
        <StateSelector/>
    </Message>

);

export default Landing;

