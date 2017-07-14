import {PubSub, withFilter} from 'graphql-subscriptions';

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

const pubSub = new PubSub();

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, {id}) => channels.find(ch => ch.id === id)
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), name: args.name, messages: [] };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, {message}) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if(!channel)
        throw new Error("Channel does not exist");
      const newMessage = { id: String(nextMessageId++), text: message.text };
      channel.messages.push(newMessage);

      // Let subscribers know about it
      pubSub.publish('messageAdded', {messageAdded: newMessage, channelId: message.channelId});
      return newMessage;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('messageAdded'),
        (payload, variables, ctx, info) => {
          return (payload.channelId === variables.channelId);
        }
      )
    }
  }
};
