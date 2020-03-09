import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Auth from './Auth';

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        browser: '',
        ipAddress: '',
        loading: true,
        redirect: false,
        status: 0
      };
    }

    componentDidMount() {
      axios.defaults.withCredentials = true;
      axios.get('http://localhost:5000/api/checkToken', { 
        method: 'GET'
      })
        .then(res => {
          if (res.status === 200) {
            
            const { detect } = require('detect-browser');
            const browser = detect();
            
            // handle the case where we don't detect the browser
            if (browser) {
              this.state.browser = browser.name;
            }
            //this async method will check if the token has the same ip address
            //and browser with the current ip address and browser that is being
            //used by the user
            /*Uncomment this before deploying to Production
            (async() => {
              const publicIp = require('public-ip');
              this.state.ipAddress = await publicIp.v4();
              
              if ((this.props.decodedUser.ipAddress === this.state.ipAddress) && (this.props.decodedUser.browser === this.state.browser)) {
                this.setState({ loading: false, status: 200 });
              } else {
                console.log(this.state);
                this.setState({ loading: false, redirect: true, status: 401 });
              }
            })().catch((err) => { throw err });
            */
            this.setState({ loading: false, status: 200 });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true, status: err.response.status });
        });
    }

    render() {
      const { loading, redirect, status } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        Auth.deauthenticateUser();
        this.props.userHasAuthenticated(false);
        return <Redirect to="/login" />
      }
      //console.log(this.props.decodedUser);
      return <ComponentToProtect {...this.props} />;
    }
  }
}