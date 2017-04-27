import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntry, selectEntry, fetchMedia } from '../../actions/index';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';
import axios from 'axios';

class EntryList extends Component {
  constructor(props) {
    super(props);
    this.props.fetchEntry = this.props.fetchEntry.bind(this);
    this.onFetchMedia = this.onFetchMedia.bind(this);
    this.props.fetchMedia = this.props.fetchMedia.bind(this);
  }

  componentWillMount() {
    const data = {
      user_id: localStorage.user_id
    };

    axios.post('/db/retrieveEntry', data)
    .then((result) => {
      this.props.fetchEntry(result.data);
    })
    .catch((err) => {
      console.error('Fetching Entry Error', err.message);
    }

  onFetchMedia(entryId, entryType) {
    if (entryType !== 'text') {
      axios.get(`/entry/${entryId}/${entryType}/${localStorage.user_id}`)
      .then( result => {
        this.props.fetchMedia(result.data);
      })
      .catch( err => console.error('Fetching Media Error'));
    }
  }

  renderList() {
    return this.props.entries.map( (entry, index) => {
      return (
        <div
          key={index}
          onClick={ () => {
            this.props.selectEntry(entry);
            this.onFetchMedia(entry._id, entry.entry_type);
          }}>
          <EntryTextDisplay
            entry={entry}
            index={index}
            type='snippet'
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div className="entry-list-container">
        {this.renderList()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    entries: state.entries
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    selectEntry: selectEntry,
    fetchEntry: fetchEntry,
    fetchMedia: fetchMedia,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryList);
