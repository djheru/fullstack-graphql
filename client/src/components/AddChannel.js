import React from 'react';

const AddChannel = () => {
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      e.target.value = '';
    }
  };
  return (
    <input type="text" placeholder="new channel" onKeyUp={handleKeyUp} />
  );
};

export default AddChannel;
