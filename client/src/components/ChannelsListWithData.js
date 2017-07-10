import React from 'react';
import {
  gql,
  graphql,
} from 'react-apollo';

import AddChannel from './AddChannel';

const ChannelsList = ({ data: {loading, error, channels }}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const itemClassFcn = (ch) => (ch.id.indexOf('-pending') < 0) ? 'channel' : 'channel pending';

  return (
    <div className="channelsList">
      <AddChannel />
      { channels.map( ch =>
        (<div key={ch.id} className={itemClassFcn(ch)}>{ch.name}</div>)
      )}
    </div>
  );
};

export const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

export default graphql(channelsListQuery, {
  options: { pollInterval: 5000 },
})(ChannelsList);
