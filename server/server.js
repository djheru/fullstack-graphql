import express from 'express';
import {graphiqlExpress, graphqlExpress} from 'graphql-server-express';
import bodyParser from 'body-parser';
import {schema} from './src/schema'
const PORT = 4000;
import cors from 'cors';

const server = express();

server.use('*', cors({origin: 'http://localhost:3000'}));
server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.listen(PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
