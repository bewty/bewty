import React from 'react';
import CallSchedule from './CallSchedule.jsx';

export default class CallHome extends React.Component {
  render() {
    return (
      <div>
        <h1>Call Scheduler</h1>
        <CallSchedule />
        <h1>Call Entry List</h1>
      </div>
    );
  }
}

