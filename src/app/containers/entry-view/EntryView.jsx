import React, { Component } from 'react';
import { connect } from 'react-redux';
import Daily from '../../components/results/daily-chart/Daily.jsx';
import BarChart from '../../components/results/video-bar-chart/BarChart';
import LineChart from '../../components/results/video-line-chart/LineChart';
import MediaPlayer from '../../components/mediaplayer/MediaPlayer.jsx';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay.jsx';

class EntryView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {match, entrySelected, fetchMedia} = this.props;
    console.log('LETS GO', this.props.entrySelected);
    const barData = JSON.parse(this.props.entrySelected.watson_results).document_tone.tone_categories;
    return (
      <div>
        {entrySelected === null ? null :
          <div>
            <div className="chart-entry">
            {entrySelected.entry_type === 'video' ?
            <div>
              <BarChart avg_data={entrySelected.video.avg_data}/>
              <LineChart raw_data={entrySelected.video.raw_data}/>
              <Daily barData={barData}/>
            </div>
            : <Daily barData={barData}/> }
            </div>
            <EntryTextDisplay entry={entrySelected}/>
            {entrySelected.entry_type === 'text' ? null : <MediaPlayer mediaSrc={fetchMedia} mediaType={entrySelected.entry_type}/>}
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    entrySelected: state.entrySelected,
    fetchMedia: state.fetchMedia
  };
}

export default connect(mapStateToProps, null)(EntryView);
