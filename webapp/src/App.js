import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

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
      this.state = { message: 'unknown' };
    }

    async componentDidMount() {
      let response = await axios.get('/api/message');
      this.setState({ message: response.data.message });
    }

    render() {
      return <WrappedComponent message={this.state.message} />;
    }
  }
}

export default hoc(App);