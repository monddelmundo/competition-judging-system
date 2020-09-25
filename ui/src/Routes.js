import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Scoresheet from "./containers/judges/Scoresheet";
import Events from "./containers/events/Events";
import EditEvent from "./containers/events/EditEvent";
import CreateEvent from "./containers/events/CreateEvent";
import Competitions from "./containers/competitions/Competitions";
import EditCompetition from "./containers/competitions/EditCompetition";
import CreateCompetition from "./containers/competitions/CreateCompetition";
import Criterias from "./containers/criterias/Criterias";
import CreateCriteria from "./containers/criterias/CreateCriteria";
import EditCriteria from "./containers/criterias/EditCriteria";
import Churches from "./containers/churches/Churches";
import ChurchForm from "./containers/churches/ChurchForm";
import Participants from "./containers/participants/Participants";
import ParticipantForm from "./containers/participants/ParticipantForm";
import Judges from "./containers/judges/Judges";
import JudgeForm from "./containers/judges/JudgeForm";
import Scoresheets from "./containers/scoresheets/Scoresheets";
import NotFound from "./containers/NotFound";
import withAuth from "./withAuth";
import withAuthJudge from "./withAuthJudge";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
      <AppliedRoute
        path="/scoresheet"
        exact
        component={withAuthJudge(Scoresheet)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/events"
        exact
        component={withAuth(Events)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/events/add"
        exact
        component={withAuth(CreateEvent)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/events/:id"
        exact
        component={withAuth(EditEvent)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/competitions"
        exact
        component={withAuth(Competitions)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/competitions/add"
        exact
        component={withAuth(CreateCompetition)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/competitions/:id"
        exact
        component={withAuth(EditCompetition)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/criterias"
        exact
        component={withAuth(Criterias)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/criterias/add"
        exact
        component={withAuth(CreateCriteria)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/criterias/:id"
        exact
        component={withAuth(EditCriteria)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/churches"
        exact
        component={withAuth(Churches)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/churches/add"
        exact
        component={withAuth(ChurchForm)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/churches/:id"
        exact
        component={withAuth(ChurchForm)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/participants"
        exact
        component={withAuth(Participants)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/participants/add"
        exact
        component={withAuth(ParticipantForm)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/participants/:id"
        exact
        component={withAuth(ParticipantForm)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/judges"
        exact
        component={withAuth(Judges)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/judges/add"
        exact
        component={withAuth(JudgeForm)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/judges/:id"
        exact
        component={withAuth(JudgeForm)}
        appProps={appProps}
      />
      <AppliedRoute
        path="/scoresheets"
        exact
        component={withAuth(Scoresheets)}
        appProps={appProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
