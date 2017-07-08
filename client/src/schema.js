export const typeDefs = `
type Channel {
  id: ID!, # "!" denotes required fields
  name: String
}

# the "Query" type specifies the API of the graphql interface. Here you expose the data that clients can query
type Query {
  channels: [Channel] # A list of channels
}
`;
