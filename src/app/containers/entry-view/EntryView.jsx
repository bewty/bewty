import React, { Component } from 'react';
import { connect } from 'react-redux';
import Daily from '../../components/results/daily-chart/Daily.jsx';
import BarChart from '../../components/results/video-bar-chart/BarChart';
import MediaPlayer from '../../components/mediaplayer/MediaPlayer.jsx';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay.jsx';

class EntryView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {match, entrySelected, fetchMedia} = this.props;

    return (
      <div>
        {entrySelected === null ? null :
          <div>
            <div className="chart-entry">
            {entrySelected.entry_type === 'video' ? <BarChart avg_data={entrySelected.video.avg_data}/> : <Daily data={entrySelected.watson_results}/> }
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
