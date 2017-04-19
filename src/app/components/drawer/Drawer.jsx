import React from 'react';
import { Link } from 'react-router-dom';
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
          style={{'backgroundColor': '#EB5424'}}
        />
        <Drawer
          open={this.state.open}
        >
        <AppBar
          title="MindFit"
          onLeftIconButtonTouchTap={this.handleToggle}
          style={{'backgroundColor': '#EB5424'}}
        />
          <MenuItem>New Entry</MenuItem>
          <MenuItem>
            <Link to="/text-entry">Text</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/audio-entry">Audio</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/video-entry">Video</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/entries">Saved Entries</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/results">Results</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/call-schedule">Call Schedule</Link>
          </MenuItem>
          <Divider />
          <MenuItem>Logout</MenuItem>
        </Drawer>
      </div>
    );
  }
}
