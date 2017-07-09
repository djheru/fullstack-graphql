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
# The mutation root type, used to define all mutations.
type Mutation {
  # A mutation to add a new channel to the list of channels
  addChannel(name: String!): Channel
}
`;
const schema = makeExecutableSchema({ typeDefs, resolvers });
// addMockFunctionsToSchema({ schema });
export { schema };
