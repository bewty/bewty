import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';
import Loader from '../loader/Loader.jsx';
import { Link } from 'react-router-dom';
import UploadButton from 'material-ui/svg-icons/file/cloud-upload';

export default class TextEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      uploading: false,
      uploadError: false,
      uploadSuccess: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      uploadError: false,
      uploadSuccess: false
    });
  }

  handleSubmit() {
    this.setState({
      uploading: true,
      uploadError: false,
      uploadSuccess: false
    });
    const data = {
      text: this.state.value,
      entryType: 'text',
      user_id: localStorage.user_id
    };

    axios.post('/entry', data)
    .then(res => {
      this.setState({
        uploading: false,
        uploadSuccess: true,
        uploadError: false });
      console.log('text upload to server done');
    })
    .catch(err => {
      this.setState({
        uploading: false,
        uploadSuccess: false,
        uploadError: true
      });
      console.log('text upload error...', err);
    });

    this.setState({value: ''});
  }

  render() {
    return (
      <div className="text-entry-container">
        <div className="text-field">
          <MuiThemeProvider>
            <TextField
              placeholder="What's on your mind today?"
              value={this.state.value}
              onChange={this.handleChange}
              multiLine={true}
              rows={10}
              fullWidth={true}
              underlineFocusStyle={{borderColor: '#EB5424'}}
              style={{fontFamily: 'Lato, san-serif', fontSize: '18px'}}
              errorText={!this.state.value.length > 0 && 'This field is required'}
            />
          </MuiThemeProvider>
        </div>
        <MuiThemeProvider>
          <RaisedButton
            className="submitButton"
            fullWidth={true}
             icon={<UploadButton
                      color="#fff"
                      style={{paddingLeft: '0'}}
                    />}
            onTouchTap={() => {
              this.state.value.length > 0 && this.handleSubmit();
            }}
            buttonStyle={{backgroundColor: '#EB5424', height: 50}}
            labelStyle={{fontFamily: 'Lato, san-serif', fontSize: '18px', color: '#fff'}}
          />
        </MuiThemeProvider>
        {this.state.uploading ? <Loader /> : null }
        <br/>
        <div>
          {this.state.uploadError ? <p className="error">There seems to have been an error.<br/>Please try again later!</p> : null }
          {this.state.uploadSuccess ? <p><Link className="success" to="/entries">Success! You can view your submissions here!</Link></p> : null}
        </div>
      </div>
    );
  }
}
