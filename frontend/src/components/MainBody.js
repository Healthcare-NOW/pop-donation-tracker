import {Route, Switch} from "react-router-dom";
import {map} from "lodash";
import React from "react";
import {routeMap} from "../App";

export const MainBody = () => (
    <Switch>
        {
            map(routeMap, ({path, MainComponent}) =>
                (<Route exact path={path} key={path}>
                    <MainComponent/>
                </Route>))
        }
    </Switch>
);