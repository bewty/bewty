import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from '../loader/Loader.jsx';

export default class TextEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      uploading: false,
      uploadError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value,
                    uploadError: false});
  }

  handleSubmit() {
    this.setState({
      uploading: true,
      uploadError: false,
    });
    const data = {
      text: this.state.value,
      entryType: 'text',
      user_id: localStorage.user_id
    };

    axios.post('/entry', data)
    .then(res => {
      this.setState({ uploading: false });
      console.log('text upload to server done');
    })
    .catch(err => {
      this.setState({
        uploadError: true,
        uploading: false
      });
      console.log('text upload error...', err);
    });

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
            errorText={!this.state.value.length > 0 && 'This field is required'}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <RaisedButton
            fullWidth={true}
            label="Submit"
            onTouchTap={() => {
              this.state.value.length > 0 && this.handleSubmit();
            }}
            labelStyle={{fontFamily: 'Lato, san-serif'}}
          />
        </MuiThemeProvider>
        {this.state.uploading ? <Loader /> : null }
        {this.state.uploadError ? <p className="error">There seems to have been an error.<br/>Please try again later!</p> : null }
      </div>
    );
  }
}
