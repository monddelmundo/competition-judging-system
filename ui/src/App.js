import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
//import { Nav, Navbar, NavItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
//import Navbar from "./components/NavBar";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import Auth from "./Auth";
import { Button } from "react-bootstrap";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

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
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">ADJUDICATOR</Link>
        
          {
            isAuthenticated 
            ? <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/events" className="nav-link">Events</Link>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto">
                <li className="navbar-item">
                  <Link to="" onClick={handleLogout} className="nav-link">Logout</Link>
                </li>
              </ul>
              </div>
            : <div className="collpase navbar-collapse">
                <ul className="navbar-nav ml-auto">
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                </ul>
              </div>
            }     
      </nav>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

//export default withRouter(App);
export default withRouter(App);
