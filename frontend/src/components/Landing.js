import React, {useState} from 'react';
import {stateOptions} from '../constants'
import {useHistory} from 'react-router-dom';
import {Button, Dropdown, Header} from "semantic-ui-react";
import {stateSummaryUrl} from "../urls";

const Landing = () => {
    const [state, setState] = useState('AL');
    const history = useHistory();
    const handleChange = (e, {value}) => {
        setState(value)
    };
    return (
        <div>
            <Header as='h1'>Choose a state</Header>
            <Dropdown
                placeholder='State'
                onChange={handleChange}
                clearable={false}
                defaultValue={'AL'}
                search
                selection
                options={stateOptions}
            />
            <Button onClick={()=> history.push(stateSummaryUrl(2020, state))}>Go</Button>
        </div>
    );
};

export default Landing;

