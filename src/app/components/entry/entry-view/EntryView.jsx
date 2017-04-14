import React, { Component } from 'react';

const EntryView = ({match, entry}) => {
  console.log('match.params.id', match.params.id);
  console.log('match.params', match.params);
  return (
    <div>
      <h1>Entry View</h1>
    </div>
  );
};

export default EntryView;
