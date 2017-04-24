import React from 'react';
import CallEntry from './CallEntry.jsx';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Subheader from 'material-ui/Subheader';

export default class CallEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call_data: ''
    };
  }

  render() {
    if (this.props.call_data.length > 0) {
    //   return (
    //     <div>
    //       <h1>Call Entry List</h1>
    //       {this.props.call_data.map((call) => {
    //         return <CallEntry call={call} />;
    //       })}
    //     </div>
    // );
    return (
      <div>
        <MuiThemeProvider>
          <List>
            <Subheader>Call Entry List</Subheader>

            {this.props.call_data.map((call) => {
              return <CallEntry call={call} />;
            })}
          </List>
        </MuiThemeProvider>
      </div>
    );
    } else {
      // return (
      //   <div>
      //     <h1>Call Entry List</h1>
      //     No entries yet
      //   </div>
      // );
      return (
        <div>
          <MuiThemeProvider>
            <List>
              <Subheader>Call Entry List</Subheader>
              <ListItem
                primaryText="No entries yet"
              />
            </List>
          </MuiThemeProvider>
        </div>
      );
    }
  }
}
