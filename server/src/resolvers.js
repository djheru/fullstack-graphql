const channels = [
  {
    id: '1',
    name: 'soccer',
    messages: [
      { id: '1', text: 'soccer is football' },
      { id: '2', text: 'hello soccer world cup', }
    ]
  },
  {
    id: '2',
    name: 'baseball',
    messages: [
      { id: '3', text: 'baseball is life' },
      { id: '4', text: 'hello baseball world series' }
    ]
  }
];
let nextId = 3;
let nextMessageId = 5;

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    }
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: `${nextId++}`, name: args.name, messages: [] };
      channels.push(newChannel);
      return newChannel;
    }
  }
};
