import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';
import { selectEntry } from '../../actions/index';

class CallEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div className="entry-container call-entry">
        <MuiThemeProvider>
            <ListItem
              innerDivStyle={{padding: '0'}}
              nestedListStyle={{padding: '0'}}
              style={{fontFamily: 'Lato, sans-serif'}}
              primaryTogglesNestedList={true}
              nestedItems={this.props.call.responses.map((response, index) => {
                if (response.text) {
                  return (
                    <div
                      key={index}
                      onClick={ () => {
                        this.props.selectEntry(response);
                      }}
                    >
                      <EntryTextDisplay entry={response} type={'snippet'} index={index}/>
                    </div>
                  );
                }
              })}
            >
              <div className="header-box">
                <h3 className="question">{this.props.call.question[this.props.call.question.length - 1] === '?' ? this.props.call.question : this.props.call.question + '?'}</h3>
                <div className="entry-meta">
                  <span className="date">{moment(this.props.call.date_set).format('MM-DD-YYYY')}</span>
                </div>
                <div className="time-container">
                  <span className="time">{moment(this.props.call.date_set).format('h:mm a')}</span>
                </div>
              </div>
            </ListItem>
        </MuiThemeProvider>
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
    selectEntry: selectEntry
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CallEntry);
