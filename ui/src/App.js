import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
//import { Nav, Navbar, NavItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
//import Navbar from "./components/NavBar";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import withAuth from './withAuth';

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      
      //await Auth.currentSession(); //will throw error if nobody is logged in.
      //userHasAuthenticated(true); //authenticate the user
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  return (
    <div className="App container">
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">ADJUDICATOR</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/events" className="nav-link">Events</Link>
          </li>
          <li className="navbar-item">
            <Link to="/user" className="nav-link">Create User</Link>
          </li>
          <li className="navbar-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        </ul>
        </div>
      </nav>
      <Routes appProps={{ }} />
    </div>
  );
}

//export default withRouter(App);
export default withRouter(App);
