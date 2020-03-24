import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import "./App.css";
import Routes from "./Routes";
import Auth from "./Auth";
import { Nav, Navbar } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Notifications from './components/Notifications/Notification';

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [decodedUser, setDecodedUser] = useState({});
  
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {

      if(await Auth.isUserAuthenticated()) {
        userHasAuthenticated(true);
      }
      
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.deauthenticateUser();
    userHasAuthenticated(false);
    props.history.push("/login"); //will redirect the user to login page after logging out
  }

  return (
    <div className="App container">
      <Notifications />
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Adjudicator</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        { isAuthenticated ?
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/competitions">Competitions</Nav.Link>
            <Nav.Link href="/judges">Judges</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
          </Navbar.Collapse> 
          : <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
          </Navbar.Collapse>  
        }
        </Navbar>

      <Routes appProps={{ isAuthenticated, userHasAuthenticated, decodedUser, setDecodedUser }} />
    </div>
  );
}

//export default withRouter(App);
export default withRouter(App);
