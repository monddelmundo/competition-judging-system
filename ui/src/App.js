import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import "./App.css";
import "./DefaultStyles.css";
import Routes from "./Routes";
import Auth from "./Auth";
import Notification from "./components/notifications/Notification";
import { Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [decodedUser, setDecodedUser] = useState({});
  const [decodedJudge, setDecodedJudge] = useState({});
  const [isAuthenticatedJudge, judgeHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      if (await Auth.isUserAuthenticated()) {
        userHasAuthenticated(true);
      }
      if (await Auth.isJudgeAuthenticated()) {
        judgeHasAuthenticated(true);
      }
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.deauthenticateUser();
    userHasAuthenticated(false);
    judgeHasAuthenticated(false);
    props.history.push("/login"); //will redirect the user to login page after logging out
  }

  return (
    <div className="App container">
      <Notification />
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <NavLink className="navbar-brand" to="/">
          Adjudicator
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {isAuthenticated ? (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavLink className="Nav_Link" to="/events">
                Events
              </NavLink>
              <NavLink className="Nav_Link" to="/competitions">
                Competitions
              </NavLink>
              <NavLink className="Nav_Link" to="/judges">
                Judges
              </NavLink>
              <NavLink className="Nav_Link" to="/churches">
                Churches
              </NavLink>
            </Nav>
            <Nav className="ml-auto">
              <NavLink className="Nav_Link Log" to="" onClick={handleLogout}>
                Logout
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        ) : isAuthenticatedJudge ? (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavLink className="Nav_Link" to="/scoresheet">
                Scoresheet
              </NavLink>
            </Nav>
            <Nav className="ml-auto">
              <NavLink className="Nav_Link Log" to="" onClick={handleLogout}>
                Logout
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        ) : (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <NavLink className="Nav_Link Log" to="/login">
                Login
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>

      <Routes
        appProps={{
          isAuthenticated,
          userHasAuthenticated,
          isAuthenticatedJudge,
          judgeHasAuthenticated,
          decodedUser,
          setDecodedUser,
          decodedJudge,
          setDecodedJudge,
        }}
      />
    </div>
  );
}

//export default withRouter(App);
export default withRouter(App);
