import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ChannelsList = () => (
  <ul className="Item-list">
    <li>channel 1</li>
    <li>channel 2</li>
  </ul>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Apollo</h2>
        </div>
        <div className="Channels-container">
          <ChannelsList/>
        </div>
      </div>
    );
  }
}

export default App;
