import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const EntrySnippet = ({entry, index}) => {
  entry.text.length > 220 ? entry.text = `${entry.text.slice(0, 220)}...` : null;
  // console.log('entry', entry);
  return (
    <div>
     {entry.length === 0 ? null :
      <Link to={`/entry/${entry._id}`}>
        <div className="entry-container">
          <div className="entry-meta">
            <span className="date">{entry.created_at.slice(0, 10)}</span>
            <span className={`${entry.entry_type}-entry`}></span>
          </div>
          <p>{entry.text}</p>
        </div>
      </Link>
    }
    </div>
  );
};

export default EntrySnippet;
