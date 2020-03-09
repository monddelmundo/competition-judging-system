import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import axios from "axios";
import Auth from "../Auth";

export default function Login(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [ipAddress, setIPAddress] = useState("");
    const [currBrowser, setCurrBrowser] = useState("");
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });

    useEffect(() => {
      onLoad();
    }, []);

    async function onLoad() {
      
      if(Auth.isUserAuthenticated()) {
        props.history.push('/events');
      }

      const publicIp = require('public-ip');
      const { detect } = require('detect-browser');
      const browser = detect();
      
      // handle the case where we don't detect the browser
      if (browser) {
        setCurrBrowser(browser.name);
      }
      setIPAddress(await publicIp.v4());
    }

    function validateForm() {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        setIsLoading(true); //to tell users that the page is loading.

        const newInfo = {
          username: fields.username,
          password: fields.password,
          ipAddress: ipAddress,
          browser: currBrowser
        };
        
        axios.post('http://localhost:5000/api/authenticate', newInfo, { timeout: 5000 })
        .then(res => {
            if (res.status === 200) {
              Auth.authenticateUser(res.data);
              const token = Auth.getToken();
              const jwt = require('jsonwebtoken');
              const decoded = jwt.decode(token);
              
              //localStorage.setItem('cool-jwt', res.data);
              props.setDecodedUser(decoded);
              props.userHasAuthenticated(true);
              props.history.push({ pathname: '/events', state: decoded });
            } else {
              setIsLoading(false);
              const error = new Error(res.error);
              throw error;
            }
        })
        .catch(err => {
            setIsLoading(false);
            console.error(err);
            alert('Error logging in please try again');
        });
    }

    return (
        <div className="Login">
          <form onSubmit={handleSubmit}>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                autoFocus
                type="username"
                value={fields.username}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                value={fields.password}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <LoaderButton
              block
              type="submit"
              bsSize="large"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Login
            </LoaderButton>
          </form>
        </div>
      );
}