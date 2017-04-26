import React from 'react';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';

export default class SearchEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if (this.props.search_data !== '') {
      return (
        <div>
          <h1>Search Results</h1>
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
          <h2>Nothing searched yet...</h2>
        </div>
      );
    }
  }
}
