import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
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
      <div style={{paddingTop: '56px'}}>
        <AppBar
          onLeftIconButtonTouchTap={this.handleToggle}
          style={{backgroundColor: '#EB5424',
                  position: 'fixed',
                  top: 0}}
        />
        <Drawer
          open={this.state.open}
          style={{position: 'fixed'}}
        >
          <AppBar
            title="MindFit"
            onLeftIconButtonTouchTap={this.handleToggle}
            style={{'backgroundColor': '#EB5424',
                    fontFamily: 'Lato, san-serif'}}
          />
          <Menu
            menuItemStyle={{fontFamily: 'Lato, san-serif'}}

            >
            <MenuItem
              containerElement={<Link to="/new-entry" />}
              primaryText="New Entry"
            />
            <MenuItem
              containerElement={<Link to="/entries" />}
              primaryText="Saved Entries"
            />
            <MenuItem
              containerElement={<Link to="/results" />}
              primaryText="Results"
            />
            <MenuItem
              containerElement={<Link to="/call-home" />}
              primaryText="Call Schedule"
            />
            <Divider />
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Drawer>
      </div>
    );
  }
}
