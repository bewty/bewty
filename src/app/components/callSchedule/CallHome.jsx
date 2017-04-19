import React from 'react';
import CallSchedule from './CallSchedule.jsx';
import axios from 'axios';

export default class CallHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call_entries: ''
    };
  }

  fetchEntries(query) {
    query = query || 'all';
    axios.get(`/callentry/${localStorage.user_id}/${query}`)
    .then((call_entries) => {
      this.setState({
        call_entries: call_entries
      });
    });
  }
  
  render() {
    return (
      <div>
        <h1>Call Scheduler</h1>
        <CallSchedule />
        <h1>Call Entry List</h1>
        {this.state.call_entries}
      </div>
    );
  }
}

