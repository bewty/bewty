import React from 'react';
import SearchEntry from './SearchEntry.jsx';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';

export default class SearchEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log('Within searchEntryList props is:', this.props.search_data);
    if (this.props.search_data !== '') {
      return (
        <div>
          <h1>Search Entry List</h1>
          {this.props.search_data.data.map((response) => {
            if (response.text) {
              return <EntryTextDisplay entry={response} type={'snippet'} />;
            }
          })}
        </div>
    );
    } else {
      return (
        <div>
          <h1>Call Entry List</h1>
          No entries...
        </div>
      );
    }
  }
}
