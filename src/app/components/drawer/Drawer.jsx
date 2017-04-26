import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FontIcon from 'material-ui/FontIcon';
import Equalizer from 'material-ui/svg-icons/av/equalizer';
import Book from 'material-ui/svg-icons/action/book';
import AddBox from 'material-ui/svg-icons/content/add';
import Call from 'material-ui/svg-icons/communication/call';
import Power from 'material-ui/svg-icons/action/power-settings-new';

injectTapEventPlugin();

export default class AppDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
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
          docked={false}
          open={this.state.open}
          style={{position: 'fixed', zIndex: 1300}}
          onRequestChange={(open) => this.setState({open})}
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
              onTouchTap={this.handleClose}
              leftIcon={<AddBox />}
              primaryText="New Entry"
            />
            <MenuItem
              containerElement={<Link to="/entries" />}
              onTouchTap={this.handleClose}
              leftIcon={<Book />}
              primaryText="Saved Entries"
            />
            <MenuItem
              containerElement={<Link to="/results" />}
              onTouchTap={this.handleClose}
              leftIcon={<Equalizer />}
              primaryText="Results"
            />
            <MenuItem
              containerElement={<Link to="/call-home" />}
              onTouchTap={this.handleClose}
              leftIcon={<Call />}
              primaryText="Call Schedule"
            />
            <MenuItem
              containerElement={<Link to="/search" />}
              primaryText="Search"
            />
            <Divider />
            <MenuItem
              leftIcon={<Power />}
            >Logout</MenuItem>
          </Menu>
        </Drawer>
      </div>
    );
  }
}
