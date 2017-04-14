import React, {Component} from 'react';
import EntrySnippet from '../entry-snippet/EntrySnippet';
import axios from 'axios';

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
    axios.post('/db/retrieveEntry')
    .then( result => {
      this.setState({
        entries: result.data
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.entries.map( (entry, index) => {
          return <EntrySnippet key={index} entry={entry}/>;
        })}
      </div>
    );
  }
}
