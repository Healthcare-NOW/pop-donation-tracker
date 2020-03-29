import React from 'react';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {wrapHistory} from "oaf-react-router";
import StateSummary from './components/StateSummary';
import CandidateSummary from './components/CandidateSummary';
import {Container} from 'semantic-ui-react';
import './App.css';
import FlaggedIndividualContributions from "./components/FlaggedIndividualContributions";
import Landing from "./components/Landing";
import {
    CandidateBreadcrumb,
    HomeBreadcrumb,
    StateBreadcrumb
} from "./breadcrumbs";
import {TopNav} from "./components/TopNav";
import {MainBody} from "./components/MainBody";

const history = createBrowserHistory();
wrapHistory(history);

export const routeMap = [
    {
        path: '/year/:year/state/:state',
        MainComponent: StateSummary,
        breadcrumbs: [HomeBreadcrumb, StateBreadcrumb]
    },
    {
        path: '/candidate/:candidateId/flagged-employer/:employerId',
        MainComponent: FlaggedIndividualContributions,
        breadcrumbs: [HomeBreadcrumb, StateBreadcrumb, CandidateBreadcrumb]
    },
    {
        path: '/candidate/:candidateId',
        MainComponent: CandidateSummary,
        breadcrumbs: [HomeBreadcrumb, StateBreadcrumb, CandidateBreadcrumb]
    },
    {
        path: '/',
        MainComponent: Landing,
        breadcrumbs: []
    },
];

export default function App() {
    return (
        <Router history={history}>
            <div className='App-mainBody'>
                <Container>
                    <TopNav/>
                    <MainBody/>
                </Container>
            </div>
        </Router>
    );
}