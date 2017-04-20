import React from 'react';
import axios from 'axios';
import CallSchedule from './CallSchedule.jsx';
import CallEntryList from './CallEntryList.jsx';

export default class CallHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchEntries = this.fetchEntries.bind(this);
  }
  componentDidMount() {
    this.fetchEntries();
  }
  fetchEntries(query) {
    query = query || 'all';
    axios.get(`/callentry/${localStorage.user_id}/${query}`)
    .then((call_entries) => {
      localStorage.setItem('call_data', JSON.stringify(call_entries.data));
    });
  }
  
  render() {
    return (
      <div>
        <h1>Call Scheduler</h1>
        <CallSchedule />
        <CallEntryList />        
      </div>
    );
  }
}

