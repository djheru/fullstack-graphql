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

# 3. Implement Mutations

### Add CORS to the Server
  - `cd ../server && yarn add cors`
- Use CORS middleware in server
```javascript
// Add before the routes for graphql/graphiql
server.use('*', cors({origin: 'http://localhost:3000'}));
```

### Add a Real Network Interface to the Frontend
- Replace the `mockNetworkInterface`
  - before: `import { ApolloClient, gql, graphql, ApolloProvider } from 'react-apollo';`
  - after: `import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';`
  - before: `import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';`
  - after: `import { makeExecutableSchema } from 'graphql-tools';`
```javascript
// remove the mockNetworkInterface stuff
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
const schema = makeExecutableSchema({ typeDefs });
// addMockFunctionsToSchema({ schema });
// const networkInterface = mockNetworkInterfaceWithSchema({ schema });
const networkInterface = createNetworkInterface({ 
  uri: 'http://localhost:4000/graphql',
});
const client = new ApolloClient({networkInterface});
```

### Define the Mutation on the Server
- Define the mutation in the server schema
```
# Inside typeDefs
# The mutation root type, used to define all mutations.
type Mutation {
  # A mutation to add a new channel to the list of channels
  addChannel(name: String!): Channel
}
```
- Example mutation:
```javascript
/*
mutation {
  addChannel(name: "basketball"){
    id
    name
  }
}
 */
```

### Create a Resolver for the Mutation
```javascript
// In resolvers.js
const channels = [
  {
    id: 1,
    name: 'soccer'
  }, {
    id: 2,
    name: 'baseball'
  } 
];
let nextId = 3;
export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    }
  },
  Mutation: {
      addChannel: (root, args) => {
        const newChannel = { id: nextId++, name: args.name};
        channels.push(newChannel);
        return newChannel;
      }
  }
};
```
### Calling the Mutation from the Client
- `mkdir ../client/src/components && touch ../client/src/components/AddChannel.js`
```javascript
import React from 'react';
import { gql, graphql } from 'react-apollo';
import {channelsListQuery} from './ChannelsListWithData';
const AddChannel = ({mutate}) => {
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      e.persist();
      mutate({
        variables: {name: e.target.value},
        refetchQueries: [ { query: channelsListQuery }] // Re-runs the query after the mutation
      })
        .then(res => {
          e.target.value = '';
        });
    }
  };
  return (
    <input type="text" placeholder="new channel" onKeyUp={handleKeyUp} />
  );
};
const addChannelMutation = gql`
mutation addChannel($name: String!) {
  addChannel(name: $name) {
    id
    name
  }
}`;
const AddChannelWithMutation = graphql(addChannelMutation)(AddChannel);
export default AddChannelWithMutation;
```
# 4. Optimistic UI Updates

### Add an Artificical Delay
- `networkInterface.use([{applyMiddleware(req, next) { setTimeout(next, 1000)}}]);`

### Store Returned Mutation Data in the Store
- Apollo provides tools to perform store updates
  - `readQuery`
  - `writeQuery`
  - `readFragment`
  - `writeFragment`
- The `mutate` param passed to the component from the HOC contains `update` property
- You can assign a function to the `mutate.update` property to get the data from the store and append 
  mutation data to it
```javascript
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      e.persist();
      mutate({
        variables: {name: e.target.value},
        // refetchQueries: [ { query: channelsListQuery }] // Re-run query after the mutation
        update: (store, {data: {addChannel}}) => {
          // Read the data from the cache for this query
          const data = store.readQuery({query: channelsListQuery});
          // Add our channel from the mutation to the end of the list
          data.channels.push(addChannel);
          // Update the cache with the new data
          store.writeQuery({query: channelsListQuery, data});
        }
      })
        .then(res => {
          e.target.value = '';
        });
    }
  };
```

### Add the `optimisticResponse` Property to the Mutate Call

- `optimisticResponse` represents the expected server response
```javascript
mutate({
        variables: {name: e.target.value},
        optimisticResponse: {
          addChannel: {
            name: e.target.value,
            id: `${uuid()}-pending`, // Identify pending items for css changes
            __typename: 'Channel'
          }
        },
        update: (store, {data: {addChannel}}) => {
          // Read the data from the cache for this query
          const data = store.readQuery({query: channelsListQuery});
          // Add our channel from the mutation to the end of the list
          data.channels.push(addChannel);
          // Update the cache with the new data
          store.writeQuery({query: channelsListQuery, data})
        }
      })
        .then(res => {
          e.target.value = '';
        });
```

### Add Some CSS for Pending Items
```javascript
const itemClassFcn = (ch) => (ch.id.indexOf('-pending') < 0) ? 'channel' : 'channel pending';
  return (
    <div className="channelsList">
      <AddChannel />
      { channels.map( ch =>
        (<div key={ch.id} className={itemClassFcn(ch)}>{ch.name}</div>)
      )}
    </div>
  );
```

```css
div.pending {
    color: rgba(255, 255, 255, 0.5);
}
```

# 5. Input Types and Field Arguments

### Add the Channel Messages to the Server Schema
- Create a `Message` type
- Add the messages as a child of the `Channel` type
- Provide a way to fetch a single channel 
  - by adding a `channel` field to the root `Query` type
```javascript
const typeDefs = `
type Channel {
  id: ID!, # "!" denotes required fields
  name: String
  messages: [Message] # Add the messages to the channel
}
type Message {
  id: ID!
  text: String
}
# the "Query" type specifies the API of the graphql interface. 
# Here you expose the data that clients can query
type Query {
  channels: [Channel] # A list of channels
  channel(id: ID!): Channel # add the single channel query
}
# The mutation root type, used to define all mutations.
type Mutation {
  # A mutation to add a new channel to the list of channels
  addChannel(name: String!): Channel
}
`;
```
- Add a function to the resolver to get the data
```javascript
// add the channel resolver
export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (id) => channels.find(ch => ch.id === id)
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: `${nextId++}`, name: args.name, messages: [] };
      channels.push(newChannel);
      return newChannel;
    }
  }
};
```

### Add the Query to the Client
```javascript
import React from 'react';
import MessageList from './MessageList';
// import ChannelPreview from './ChannelPreview';
import NotFound from './NotFound';
import {
    gql,
    graphql,
} from 'react-apollo';
const ChannelDetails = (queryData) => {
  const { data: {loading, error, channel }} = queryData;
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  if (channel === null) {
    return (<NotFound/>);
  }
  return (
    <div>
      <div className="channelName">
        {channel.name}
      </div>
      <MessageList messages={channel.messages}/>
    </div>);
};
export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`;
export default graphql(channelDetailsQuery, {
  options: (props) => ({
    variables: { channelId: props.match.params.channelId}
  })
})(ChannelDetails);
```
### Setup for Mutation to Add Messages
- Create an Input type
```javascript
// ../server/schema.js
const typeDefs = `
type Channel {
  ...
}
type Message {
  ...
}
# the "Query" type specifies the API of the graphql interface. 
# Here you expose the data that clients can query
type Query {
  ...
}
# an object that can only contain basic scalar types, 
# list types, and other input types
input MessageInput {
  channelId: ID!
  text: String
}
# The mutation root type, used to define all mutations.
type Mutation {
  # A mutation to add a new channel to the list of channels
  addChannel(name: String!): Channel
  addMessage(message: MessageInput!): Message
}
`;
```
- Add to the resolver
```javascript
// ../server/src/resolvers
export const resolvers ={
  // ...
  addMessage: (root, {message}) => {
    const channel = channels.find(channel => channel.id === message.channelId);
    if(!channel)
      throw new Error("Channel does not exist");
    const newMessage = { id: String(nextMessageId++), text: message.text };
    channel.messages.push(newMessage);
    return newMessage;
  }
}
```

- Add query to the AddMessage and Wrap Component
```javascript
const addMessageMutation = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
    }
  }
`;

const AddMessageWithMutation = graphql(
  addMessageMutation,
)(withRouter(AddMessage));

export default AddMessageWithMutation;
```

- Add call to `mutate()` in the handler function
```javascript
const AddMessage = ({ match, mutate }) => {
  console.log('match');
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      mutate({
        variables: {
          message: {
            channelId: match.params.channelId,
            text: evt.target.value
          }
        },
        optimisticResponse: {
          addMessage: {
            text: evt.target.value,
            id: Math.round(Math.random() * -1000000),
            __typename: 'Message',
          },
        },
        // custom update function
        update: (store, { data: { addMessage } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({
            query: channelDetailsQuery,
            variables: {
              channelId: match.params.channelId,
            }
          });
          // Add our Message from the mutation to the end.
          data.channel.messages.push(addMessage);
          // Write the data back to the cache.
          store.writeQuery({
            query: channelDetailsQuery,
            variables: {
              channelId: match.params.channelId,
            },
            data
          });
        },
      });
      evt.target.value = '';
    }
  };
```

# 6. Reading From the Cache

- Apollo client stores each query result in its normalized cache
- Uses the query path to determine if an object is cached
- To use cached data from a different query path, create a custom resolver
```javascript
// ../client/src/App.js
const client = new ApolloClient({
  networkInterface,
  customResolvers: {
    Query: {
      channel: (_, args) => {
        console.log(args);
        // check the cache for the channel by id
        return toIdValue(dataIdFromObject({ __typename: 'Channel', id: args['id'] }));
      },
    },
  },
  dataIdFromObject,
});
```
// Now the channel is available from the passed in prop data in `ChannelDetails`
