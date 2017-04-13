import React, { Component } from 'react';

export default class EntrySnippet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      created_at: 'default created_at',
      entry_type: '',
      text: 'default text'
    };
  }

  // componentWillReceiveProps({entry}) {
  //   this.setState({
  //     created_at: entry.created_at,
  //     text: entry.text,
  //   });
  // }

  render() {
    const {entry} = this.props;
    console.log('=====props', entry);

    return (
      <div>
       {entry.length === 0 ? null :
        <div>
          <h1>Entry</h1>
          <p>Date: {entry.created_at.slice(0, 10)}</p>
          <p>Type: {entry.entry_type}</p>
          <p>Entry: {entry.text}</p>
        </div>
      }
      </div>
    );
  }
}
