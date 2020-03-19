import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Events from "./containers/Events";
import EditEvent from "./containers/EditEvent";
import CreateEvent from "./containers/CreateEvent";
import Competitions from "./containers/Competitions";
import EditCompetition from "./containers/EditCompetition";
import CreateCompetition from "./containers/CreateCompetition";
import Criterias from "./containers/Criterias";
import CreateCriteria from "./containers/CreateCriteria";
import EditCriteria from "./containers/EditCriteria";
import NotFound from "./containers/NotFound";
import withAuth from './withAuth';

export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
            <AppliedRoute path="/events" exact component={withAuth(Events)} appProps={appProps} />
            <AppliedRoute path="/events/add" exact component={withAuth(CreateEvent)} appProps={appProps} />
            <AppliedRoute path="/events/:id" exact component={withAuth(EditEvent)} appProps={appProps} />
            <AppliedRoute path="/competitions" exact component={withAuth(Competitions)} appProps={appProps} />
            <AppliedRoute path="/competitions/add" exact component={withAuth(CreateCompetition)} appProps={appProps} />
            <AppliedRoute path="/competitions/:id" exact component={withAuth(EditCompetition)} appProps={appProps} />
            <AppliedRoute path="/criterias" exact component={withAuth(Criterias)} appProps={appProps} />
            <AppliedRoute path="/criterias/add" exact component={withAuth(CreateCriteria)} appProps={appProps} />
            <AppliedRoute path="/criterias/:id" exact component={withAuth(EditCriteria)} appProps={appProps} />
            <AppliedRoute path="/criterias/:id" exact component={withAuth(EditCriteria)} appProps={appProps} />
            <Route component={NotFound} />
        </Switch>
    );
}