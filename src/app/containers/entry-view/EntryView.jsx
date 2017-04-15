import React, { Component } from 'react';
import { connect } from 'react-redux';
import Daily from '../../components/results/daily-chart/Daily.jsx';
import MediaPlayer from '../../components/mediaplayer/MediaPlayer.jsx';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay.jsx';

class EntryView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {match, entrySelected} = this.props;

    return (
      <div>
        {entrySelected === null ? null :
          <div>
            <div className="chart-entry">
              <Daily />
            </div>
            <EntryTextDisplay entry={entrySelected}/>
            <MediaPlayer />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    entrySelected: state.entrySelected
  };
}

export default connect(mapStateToProps, null)(EntryView);
