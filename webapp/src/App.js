import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Cookies from 'js-cookie'
import Debug from 'debug';
import request from './request';

const debug = Debug('app');

function App(props) {
  return (
    <div className="App">
      <h2>{props.message}</h2>
    </div>
  );
}

let hoc = (WrappedComponent) => {
  return class EnhancedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: true, message: 'unknown' };
    }

    async componentDidMount() {
      let token = Cookies.get('token');

      if (!token) {
        let redirect_uri = `${encodeURIComponent(window.location)}`;
        let url = `${window.location.origin}/api/v1/oauth/authorize?response_type=token&redirect_uri=${redirect_uri}`;
        window.location = url;
      }

      request.token = token;

      let data = await request.message();
      this.setState({ loading: false, message: data.message });
    }

    render() {
      if (this.state.loading) {
        return <></>;
      } else {
        return <WrappedComponent message={this.state.message} />;
      }
    }
  }
}

export default hoc(App);