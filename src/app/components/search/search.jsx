import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from '../loader/Loader.jsx';
import SearchEntryList from '../../containers/search/SearchEntryList.jsx';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      search_data: '',
      uploading: false,
      uploadError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      search: event.target.value,
      uploadError: false
    });
    const data = {
      search: event.target.value,
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    };
    axios.post('/elasticSearch', data)
    .then((response) => {
      this.setState({
        search_data: response,
        uploading: false,
        uploadError: false
      });
    })
    .catch(err => {
      console.log('text upload error...', err);
      this.setState({
        uploading: false,
        uploadError: true
      });
    });
  }

  handleSubmit(event) {
    this.setState({
      uploading: true,
      uploadError: false
    });
    const data = {
      search: this.state.search,
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    };
    axios.post('/elasticSearch', data)
    .then((response) => {
      this.setState({
        search_data: response,
        search: '',
        uploading: false,
        uploadError: false
      });
    })
    .catch(err => {
      console.log('text upload error...', err);
      this.setState({
        uploading: false,
        uploadError: true
      });
    });
  }
  render() {
    return (
      <div className="call-entry-container call-home">
        <h3>Search</h3>
        <MuiThemeProvider>
          <TextField
            value={this.state.search}
            onChange={this.handleChange}
            fullWidth={true}
            underlineFocusStyle={{borderColor: '#EB5424'}}
            style={{fontFamily: 'Lato, san-serif'}}
            errorText={!this.state.search.length > 0 && 'This field is required'}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <RaisedButton
            fullWidth={true}
            label="Search"
            onTouchTap={() => {
              this.state.search.length > 0 && this.handleSubmit();
            }}
            labelStyle={{fontFamily: 'Lato, san-serif'}}
          />
        </MuiThemeProvider>
        {this.state.uploading ? <Loader /> : null }
        <br/>
        <div>
          {this.state.uploadError ? <p className="error">There seems to have been an error.<br/>Please try again later!</p> : null }
          {this.state.uploadSuccess ? <p><Link className="success" to="/entries">Success! You can view your submissions here!</Link></p> : null}
        </div>
        <SearchEntryList search_data={this.state.search_data} />
      </div>
    );
  }
}
