import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Auth from './Auth';

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
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
      
      return <ComponentToProtect {...this.props} />;
    }
  }
}