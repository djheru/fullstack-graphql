# graphql-tutorial
Full-stack GraphQL tutorials with React, Redux and Apollo

# 1. The Frontend

#### Bootstrap the client with create-react-app
- Create a new react app in `./client`
  - `create-react-app client && cd ./client`
- Start the server
  - `npm start`

#### Writing the first component
- Copy the assets
  - `cp ../resources/* src`
- Modify the App component
```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ChannelsList = () => (
  <ul>
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
        <ChannelsList/>
      </div>
    );
  }
}

export default App;
```
