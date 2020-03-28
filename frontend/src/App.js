import React from 'react';
import {
    Router,
    Switch,
    Route
} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {wrapHistory} from "oaf-react-router";
import StateSummary from './components/StateSummary';
import CandidateSummary from './components/CandidateSummary';
import {Container} from 'semantic-ui-react';
import './App.css';
import FlaggedIndividualContributions from "./components/FlaggedIndividualContributions";
import Landing from "./components/Landing";

const history = createBrowserHistory();
wrapHistory(history);

export default function App() {
    return (
        <Router history={history}>
            <div className='App-mainBody'>
                <Container>
                    <Switch>
                        <Route path='/year/:year/state/:state'>
                            <StateSummary/>
                        </Route>
                        <Route path='/candidate/:candidateId/flagged-employer/:employerId'>
                            <FlaggedIndividualContributions/>
                        </Route>
                        <Route path='/candidate/:candidateId'>
                            <CandidateSummary/>
                        </Route>
                        <Route path='/'>
                            <Landing/>
                        </Route>
                    </Switch>
                </Container>
            </div>
        </Router>
    );
}