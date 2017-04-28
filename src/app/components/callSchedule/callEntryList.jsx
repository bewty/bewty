import React from 'react';
import CallEntry from '../../containers/call-schedule/CallEntry.jsx';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class CallEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call_data: ''
    };
  }

  render() {
    if (this.props.call_data.length > 0) {
      return (
        <div className="entry-list-container">
          <MuiThemeProvider>
            <List>
              <h3 className="title">Call Entry List</h3>
              {this.props.call_data.map((call) => {
                return <CallEntry call={call} />;
              })}
            </List>
          </MuiThemeProvider>
        </div>
      );
    } else {
      return (
        <div className="entry-list-container">
          <MuiThemeProvider>
            <List>
              <h3 className="title">Call Entry List</h3>
              <div className="entry-container call-entry">
                <ListItem
                  innerDivStyle={{padding: '0'}}
                  nestedListStyle={{padding: '0'}}
                  style={{fontFamily: 'Lato, sans-serif'}}
                  >
                  <div className="header-box">
                    <h3 className="question">No entries yet</h3>
                    <div className="entry-meta">
                      <span className="date"></span>
                    </div>
                    <div className="time-container">
                      <span className="time"></span>
                    </div>
                  </div>
                </ListItem>
              </div>
            </List>
          </MuiThemeProvider>
        </div>
      );
    }
  }
}
