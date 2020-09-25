import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import Auth from "../Auth";
import { notify } from "../components/notifications/Notification";
import { authenticateApi, authenticateJudgeApi } from "../api/Api";

export default function Login(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIPAddress] = useState("");
  const [currBrowser, setCurrBrowser] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    password: "",
  });

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    if (Auth.isUserAuthenticated()) {
      props.history.push("/events");
    }

    const publicIp = require("public-ip");
    const { detect } = require("detect-browser");
    const browser = detect();

    // handle the case where we don't detect the browser
    try {
      if (browser) {
        setCurrBrowser(browser.name);
      }
      setIPAddress(await publicIp.v4());
    } catch (e) {
      console.log(e);
    }

    /*Being used for Testing*/
    /*--START--
    await dispatch({ type: "SAMPLE_ACTION", users });
    --END--*/
  }

  function validateForm() {
    return fields.username.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true); //to tell users that the page is loading.

    const newInfo = {
      username: fields.username,
      password: fields.password,
      ipAddress: ipAddress,
      browser: currBrowser,
    };

    //axios
    //  .post("http://localhost:5000/api/authenticate", newInfo, {
    //    timeout: 5000,
    //  })
    const jwt = require("jsonwebtoken");

    authenticateApi(newInfo)
      .then((res) => {
        if (res.status === 200) {
          Auth.authenticateUser(res.data);
          const token = Auth.getToken();
          //const jwt = require("jsonwebtoken");
          const decoded = jwt.decode(token);

          //localStorage.setItem('cool-jwt', res.data);
          props.setDecodedUser(decoded);
          props.userHasAuthenticated(true);
          notify(`Hi  ${decoded.username}!`, "success");
          props.history.push({ pathname: "/events", state: decoded });
        } else {
          setIsLoading(false);
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        authenticateJudgeApi(newInfo)
          .then((res) => {
            if (res.status === 200) {
              Auth.authenticateJudge(res.data);
              const token = Auth.getTokenJudge();
              const decoded = jwt.decode(token);
              props.setDecodedJudge(decoded);
              props.judgeHasAuthenticated(true);
              props.history.push({ pathname: "/scoresheet", state: decoded });

              notify(`Hi  ${decoded.firstName}!`, "success");
            } else {
              setIsLoading(false);
              console.error(err);
              notify("Incorrect username/password!", "error");
            }
          })
          .catch((err) => {
            setIsLoading(false);
            console.error(err);
            notify("Incorrect username/password!", "error");
          });
        // setIsLoading(false);
        // console.error(err);
        // notify("Incorrect username/password!", "error");
      });
  }

  return (
    <div className="login container">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="username">
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="username"
            value={fields.username}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
