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
    this.onFetchMedia = this.onFetchMedia.bind(this);
  }
  componentWillMount() {
    const data = {
      user_id: localStorage.user_id
    };

    axios.post('/db/retrieveEntry', data)
    .then( result => {
      console.log('result in retrieve entry', result)
      this.props.fetchEntry(result.data);
    })
    .catch( err => console.error('Fetching Entry Error'));
  }

  onFetchMedia(entryId, entryType) {
    if (entryType !== 'text') {
      axios.get(`/entry/${entryId}/${entryType}/${localStorage.user_id}`)
      .then( result => {
        console.log('result from Acios call', result)
        this.props.fetchMedia(result.data);
      })
      .catch( err => console.error('Fetching Media Error'));
    }
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
    console.log('this is the state', this);
    const pieData = JSON.parse(this.props.entries[0].watson_results).document_tone.tone_categories.filter((obj) => {return obj.category_id === 'emotion_tone'});
    const scatterData = JSON.parse(this.props.entries[0].watson_results).document_tone.tone_categories.filter((obj) => {return obj.category_id === 'social_tone'});
    const barData =  JSON.parse(this.props.entries[0].watson_results).document_tone.tone_categories
    return (
      <div>
      <h2 className="title">Results</h2>
      <h3 className="title"> Your overall report</h3>
      <Trend scatterData={scatterData} pieData ={pieData}/>
      <h3 className="title"> Your daily report</h3>
      <Daily barData={barData}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('YO THIS IS THE STATE BEFORE MAPPED', state)
  return {
    entries: state.entries
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    FetchMedia: fetchMedia,
    fetchEntry: fetchEntry,
  }, dispatch) ;
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
