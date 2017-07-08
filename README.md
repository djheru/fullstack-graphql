# graphql-tutorial
Full-stack GraphQL tutorials with React, Redux and Apollo

# 1. The Frontend

### Bootstrap the client with create-react-app
- Create a new react app in `./client`
  - `create-react-app client && cd ./client`
- Start the server
  - `npm start`

### Writing the first component
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

### Creating a Schema
- `touch ./src/schema.js`
```javascript
export const typeDefs = `
type Channel {
  id: ID!, # "!" denotes required fields
  name: String
}

# the "Query" type specifies the API of the graphql interface. 
# Here you expose the data that clients can query
type Query {
  channels: [Channel] # A list of channels
}
`;
```
- This gives us a query like
```
query ChannelsListQuery {
  channels {
    id
    name
  }
}
```

### Install Apollo Client
- `yarn add react-apollo`
- Allows you to use a higher-order component to handle data
- Add the client to App.js
```javascript
import {
  ApolloClient,
  gql,
  graphql,
  ApolloProvider,
} from 'react-apollo';
const client = new ApolloClient();
```
- Wrap the ChannelsList component with gql
// We define the query and pass it to the HOC
```javascript
const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

// Wrapping the component allows it to receive this additional data
const ChannelsList = ({data: {loading, error, channels}}) => {
  if (loading) {
    return (<p>Loading ...</p>);
  }
  if (error) {
    return (<p>{error.message}</p>);
  }
  return (
    <ul className="Item-list">
      { channels.map(ch => (<li key={ch.id}>{ch.name}</li>)) }
    </ul>
  )
};

// We wrap the ChannelsList in the functtion that's
// returned by graphql(channelsListQuery)
const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);

class App extends Component {
  render() {
    // We wrap the markup in the <ApolloProvider/> component and pass  
    // it the client, which makes the requests to the server
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to Apollo</h2>
          </div>
          <div className="Channels-container">
            <ChannelsListWithData/>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
```
- Now we see the error: 
  - `Network error: Network request failed with status 404 - "Not Found"`
  - Network request was made to `http://localhost:3000/graphql`

### Create a Mock Endpoint
