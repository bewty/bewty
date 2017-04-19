import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default class AppDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleToggle}
          style={{'background-color': '#EB5424'}}
        />
        <Drawer
          open={this.state.open}
        >
        <AppBar
          title="MindFit"
          onLeftIconButtonTouchTap={this.handleToggle}
          style={{'background-color': '#EB5424'}}
        />
          <MenuItem>New Entry</MenuItem>
          <MenuItem>Saved Entries</MenuItem>
          <MenuItem>Results</MenuItem>
          <MenuItem>Call Schedule</MenuItem>
          <Divider />
          <MenuItem>Logout</MenuItem>
        </Drawer>
      </div>
    );
  }
}
