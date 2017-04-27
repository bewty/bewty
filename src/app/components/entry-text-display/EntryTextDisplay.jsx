import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import moment from 'moment';

const EntryText = ({entry, index, type}) => {
  let text;
  entry.text.length > 220 && type === 'snippet' ? text = `${entry.text.slice(0, 220)}...` : text = entry.text;

  // console.log(moment(entry.created_at).format());
  return (
    <div className="entry-container">
     {entry.length === 0 ? null :
      <Link to={`/entry/${entry._id}`}>
        <div>
          <div className="entry-meta">
            <span className="date">{moment(entry.created_at).format('MM-DD-YYYY')}</span>
            <span className={`${entry.entry_type}-entry`}></span>
          </div>
          <div className="time-container">
            <span className="time">{moment(entry.created_at).format('h:mm a')}</span>
          </div>
          <p>{text}</p>
        </div>
      </Link>
    }
    </div>
  );
};

export default EntryText;
