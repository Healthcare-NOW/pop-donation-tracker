import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import StateSummary from './components/StateSummary';
import CandidateSummary from './components/CandidateSummary';
import {Container} from 'semantic-ui-react';
import './App.css';
import FlaggedIndividualContributions from "./components/FlaggedIndividualContributions";
import Landing from "./components/Landing";

export default function App() {
    return (
        <Router>
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