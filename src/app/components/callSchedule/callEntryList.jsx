import React from 'react';
import CallEntry from './CallEntry.jsx';

export default class CallEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call_data: ''
    };
  }

  render() {
    if (this.props.call_data.length > 0) {
      return (
        <div>
          <h1>Call Entry List</h1>
          {this.props.call_data.map((call) => {
            return <CallEntry call={call} />;
          })}
        </div>
    );
    } else {
      return (
        <div>
          <h1>Call Entry List</h1>
          No entries yet
        </div>
      );
    }
  }
}
