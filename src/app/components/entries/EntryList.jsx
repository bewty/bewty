import React, {Component} from 'react';
import EntrySnippet from './EntrySnippet';
import axios from 'axios';

export default class EntryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [{
        created_at: '',
        tags: [],
        video: {
        },
        text: '',
      }]
    };
    axios.post('/db/retrieveEntry')
    .then( result => {
      this.setState({
        entries: result.data
      });
    });
  }

  componentWillMount() {
  }

  render() {
    return (
      <div>
        <h1>EntryList</h1>
        {this.state.entries.map( (entry, index) => {
          return <EntrySnippet key={index} entry={entry}/>;
        })}
      </div>
    );
  }
}
