import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Button, Dropdown} from "semantic-ui-react";
import {stateOptions} from "../constants";
import {stateSummaryUrl} from "../urls";

export const StateSelector = ({activeState}) => {
    const [state, setState] = useState(activeState || 'AL');
    const history = useHistory();
    const handleChange = (e, {value}) => {
        setState(value)
    };
    return (
        <div>
            <Dropdown
                placeholder='State'
                onChange={handleChange}
                clearable={false}
                defaultValue={activeState || 'AL'}
                search
                selection
                options={stateOptions}
            />
            <span className='stateNavigationButton'>
                <Button
                    onClick={() => history.push(stateSummaryUrl(2020, state))}
                    disabled={state === activeState}
                >
                    Go
                </Button>
            </span>
        </div>
    )
};