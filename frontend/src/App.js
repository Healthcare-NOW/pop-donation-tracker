import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import StateSummary from "./components/StateSummary";
import {Container} from 'semantic-ui-react';

export default function App() {
    return (
        <Router>
            <Container>
                <Switch>
                    <Route path="/year/:year/state/:state">
                        <StateSummary/>
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}