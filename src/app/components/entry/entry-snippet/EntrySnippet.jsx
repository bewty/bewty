import React, { Component } from 'react';

const EntrySnippet = ({entry}) => {
  entry.text.length > 220 ? entry.text = `${entry.text.slice(0, 220)}...` : null;
  return (
    <div>
     {entry.length === 0 ? null :
      <div className="entry-container">
        <div className="entry-meta">
          <span className="date">{entry.created_at.slice(0, 10)}</span>
          <span className={`${entry.entry_type}-entry`}></span>
        </div>
        <p>{entry.text}</p>
      </div>
    }
    </div>
  );
};

export default EntrySnippet;
