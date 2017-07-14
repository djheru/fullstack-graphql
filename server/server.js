import express from 'express';
import {graphiqlExpress, graphqlExpress} from 'graphql-server-express';
import { execute, subscribe} from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import bodyParser from 'body-parser';
import {schema} from './src/schema'
import cors from 'cors';

const PORT = 4000;
const server = express();

server.use('*', cors({origin: 'http://localhost:3000'}));
server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:4000/subscriptions'
}));

// wrap the Express server
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL server running on http://localhost:${PORT}`);

  // Set up the WebSocket to listen for subscriptions
  const options = {
    execute,
    subscribe,
    schema
  };
  const socketOptions = {server: ws, path: '/subscriptions'};
  new SubscriptionServer(options, socketOptions);
});
