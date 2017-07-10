import React from 'react';
import { gql, graphql } from 'react-apollo';
import {channelsListQuery} from './ChannelsListWithData';
import uuid from 'uuid/v1';

const AddChannel = ({mutate}) => {
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      e.persist();

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
