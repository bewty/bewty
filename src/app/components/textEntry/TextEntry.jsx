import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

export default class TextEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    const data = {
      text: this.state.value,
      entryType: 'text',
      user_id: localStorage.user_id
    };

    axios.post('/entry', data)
    .then(res => console.log('text upload to server done'))
    .catch(err => console.log('text upload error...', err));

    this.setState({value: ''});
  }

  render() {
    return (
      <div className="container">
        <MuiThemeProvider>
          <TextField
            value={this.state.value}
            onChange={this.handleChange}
            multiLine={true}
            rows={10}
            fullWidth={true}
            underlineFocusStyle={{borderColor: '#EB5424'}}
            style={{fontFamily: 'Lato, san-serif'}}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <RaisedButton
            fullWidth={true}
            label="Submit"
            onTouchTap={this.handleSubmit}
            labelStyle={{fontFamily: 'Lato, san-serif'}}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
