import React, { Component } from 'react';
import { ApolloClient, gql, graphql, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './schema';
import logo from './logo.svg';
import './App.css';
import AddChannel from './components/AddChannel';

//const schema = makeExecutableSchema({ typeDefs });
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
});
const client = new ApolloClient({networkInterface});

const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

const ChannelsList = ({ data: { loading, error, channels } }) => {
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

const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to Apollo</h2>
          </div>
          <div className="Channels-container">
            <AddChannel/>
            <ChannelsListWithData/>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
