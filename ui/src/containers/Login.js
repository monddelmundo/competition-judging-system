import React, { useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import axios from "axios";

export default function Login(props) {

    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });

    function validateForm() {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        setIsLoading(true); //to tell users that the page is loading.
      
        axios.post('http://localhost:5000/api/authenticate', fields, { timeout: 5000 })
        .then(res => {
            if (res.status === 200) {
                props.history.push('/');
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