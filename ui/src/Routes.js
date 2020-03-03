import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Events from "./containers/Events";
import EditEvent from "./containers/EditEvent";
import NotFound from "./containers/NotFound";
import withAuth from './withAuth';

export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
            <AppliedRoute path="/events" exact component={withAuth(Events)} appProps={appProps} />
            <AppliedRoute path="/events/:id" exact component={EditEvent} appProps={appProps} />
            <Route component={NotFound} />
        </Switch>
    );
}