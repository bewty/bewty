import React, { Component } from 'react';
import axios from 'axios';
import Trend from './trend-chart/Trend.jsx';
import Daily from './daily-chart/Daily.jsx';
import { fetchEntry, selectEntry, fetchMedia } from '../../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watson: null,
      textLength: 0
    };
    this.onFetchMedia = this.onFetchMedia.bind(this);
  }
  componentWillMount() {
    const data = {
      user_id: localStorage.user_id
    };

    axios.post('/db/retrieveEntry', data)
    .then( result => {
      this.props.fetchEntry(result.data);
    })
    .catch( err => {
      // console.error('Fetching Entry Error');
      // TODO: HANDLE ERROR
    });
  }

  componentDidMount() {
    let data = {
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    };
    axios.post('/db/userentry', data)
    .then((user_id) => {
      if (user_id.data.aggregated_entries.length > 800) {
        let params = {text: JSON.stringify(user_id.data.aggregated_entries)};
        axios.get('/api/watson', {params})
        .then(results => {
          this.setState({
            watson: results.data,
            textLength: user_id.data.aggregated_entries.length
          });
        })
        .catch(err => {
          // console.log('error', err);
          // TODO: HANDLE ERROR
        });
      }
    })
    .catch((err) => {
      // console.log('Received error in retrieving state:', err);
      // TODO: HANDLE ERROR
    });
  }

  onFetchMedia(entryId, entryType) {
    if (entryType !== 'text') {
      axios.get(`/entry/${entryId}/${entryType}/${localStorage.user_id}`)
      .then( result => {
        this.props.fetchMedia(result.data);
      })
      .catch( err => {
        // console.error('Fetching Media Error');
        // TODO: HANDLE ERROR
      });
    }
  }

  onFetchMedia(entryId, entryType) {
    if (entryType !== 'text') {
      axios.get(`/entry/${entryId}/${entryType}/${localStorage.user_id}`)
      .then( result => {
        this.props.fetchMedia(result.data);
      })
      .catch( err => {
        // console.error('Fetching Media Error');
        // TODO: HANDLE ERROR
      });
    }
  }

  renderList() {
    return this.props.entries.map((entry, index) => {
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
    const barData = JSON.parse(this.props.entries[0].watson_results).document_tone.tone_categories;
    return (
      <div>
      <h2 className="title">Results</h2>
      <h3 className="title"> Your overall report</h3>
      {this.state.textLength > 800 && <Trend watson={this.state.watson} />}
      <h3 className="title"> Your daily report</h3>
      <Daily barData={barData}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    entries: state.entries
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    FetchMedia: fetchMedia,
    fetchEntry: fetchEntry,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
