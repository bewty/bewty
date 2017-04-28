import React from 'react';
import axios from 'axios';
import CallSchedule from './CallSchedule.jsx';
import CallEntryList from './callEntryList.jsx';

export default class CallHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call_data: ''
    };
    this.fetchEntries = this.fetchEntries.bind(this);
  }

  componentDidMount() {
    this.fetchEntries();
  }

  fetchEntries(query) {
    query = query || 'all';
    axios.get(`/callentry/${localStorage.user_id}/${query}`)
    .then((call_data) => {
      this.setState({
        call_data: call_data.data
      });
    })
    .catch(err => {
      // TODO: HANDLE ERROR
    });
  }

  render() {
    return (
      <div>
        <CallSchedule />
        <CallEntryList call_data={this.state.call_data} />
      </div>
    );
  }
}
