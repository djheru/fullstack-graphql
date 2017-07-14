import {addMockFunctionsToSchema, makeExecutableSchema} from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
type Channel {
  id: ID!, # "!" denotes required fields
  name: String
  messages: [Message]
}

type Message {
  id: ID!
  text: String
}

# the "Query" type specifies the API of the graphql interface. 
# Here you expose the data that clients can query
type Query {
  channels: [Channel] # A list of channels
  channel(id: ID!): Channel
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

# Subscriptions allow clients to be notified of certain topics
type Subscription {
  messageAdded(channelId: ID!): Message
}
`;
const schema = makeExecutableSchema({ typeDefs, resolvers });
// addMockFunctionsToSchema({ schema });
export { schema };
