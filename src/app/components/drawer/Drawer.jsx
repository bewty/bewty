import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

injectTapEventPlugin();

class Login extends React.Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login" />
    );
  }
}
const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = 'IconMenu';
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
        />
        <Drawer
          open={this.state.open}
        >
        <AppBar
          title="MindFit"
          onLeftIconButtonTouchTap={this.handleToggle}
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