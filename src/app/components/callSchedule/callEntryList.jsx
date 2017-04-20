import React from 'react';
import CallEntry from './CallEntry.jsx';

export default class CallEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call_entries: ''
    };
  }

  componentDidMount() {
    console.log('Current state:', localStorage.call_entries);
    this.setState({
      call_data: localStorage.call_entries
    });
  }


  render() {
    return (
      <div>
      <h1>Call Entry List</h1>
      {JSON.parse(localStorage.call_entries).map((call) => {
        return <CallEntry call={call}/>
      })}
      </div>
    );
  }
}
