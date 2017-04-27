import React from 'react';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';

export default class SearchEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log('Within searchentry search data:', this.props.search_data);
    if (this.props.search_data !== '') {
      return (
        <div>
          <h3>Search Results</h3>
          {this.props.search_data.data.map((response) => {
            console.log('Received within searchEntry:', response);
            if (response !== null) {
              return <EntryTextDisplay entry={response} type={'snippet'} />;
            }
          })}
        </div>
    );
    } else {
      return (
        <div>
          <h3>Nothing searched yet</h3>
        </div>
      );
    }
  }
}
