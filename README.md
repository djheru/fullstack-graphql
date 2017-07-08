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
- Install stuff we need
  - `yarn add graphql-tools apollo-test-utils graphql`
- Create a mock network interface for the apollo client
```javascript
import React, { Component } from 'react';
import { ApolloClient, gql, graphql, ApolloProvider } from 'react-apollo';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { typeDefs } from './schema';
import logo from './logo.svg';
import './App.css';

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });
const networkInterface = mockNetworkInterfaceWithSchema({ schema });
const client = new ApolloClient({networkInterface});

```
- More information about mocking GQL
  - http://dev.apollodata.com/tools/graphql-tools/mocking.html

# 2. The Backend

### Initial Setup
- Make a directory `server` in the same directory as the `client` 
  - `cd ../ && mkdir server && cd $_`
- Create a basic server
```javascript
import express from 'express';
const PORT = 4000;
const server = express();
server.get('/', function (req, res) {
  res.send('Hello World!');
});
server.listen(PORT, () => 
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
```

### Add the Schema
- `cp ../client/src/schema.js ./src/schema.js`
```javascript
import {addMockFunctionsToSchema, makeExecutableSchema} from 'graphql-tools';
import { resolvers } from './resolvers';
const typeDefs = `
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
const schema = makeExecutableSchema({ typeDefs, resolvers });
// use this to mock the resolvers
// addMockFunctionsToSchema({ schema });
export { schema };
```

### Add a Resolver with Mock Data
- `touch ./src/resolvers.js`
```javascript
// it fake
const channels = [ {
  id: 1,
  name: 'soccer',
}, {
  id: 2,
  name: 'baseball',
} ];
export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
  },
};
```

### Wire up the server
- `yarn add graphql-server-express body-parser graphql`
```javascript
// server.js
import express from 'express';
import {graphiqlExpress, graphqlExpress} from 'graphql-server-express';
import bodyParser from 'body-parser';
import {schema} from './src/schema'
const PORT = 4000;
const server = express();
server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
server.listen(PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
```
