import React from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import moment from 'moment';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#EB5424',
    pickerHeaderColor: '#EB5424',
    disabledColor: '#333',
  },
});

export default class CallSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduled_message: '',
      scheduled_time: '',
      user_id: localStorage.user_id,
      stopCalls: localStorage.stopCalls,
      scheduled: localStorage.scheduled,
      question: '',
      time: '',
      phonenumber: '',
      hasQuestion: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuestion = this.handleQuestion.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.revise = this.revise.bind(this);
    this.endCall = this.endCall.bind(this);
    this.retrieveUserState = this.retrieveUserState.bind(this);
    this.defaultTime = new Date();
    this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
  }
  componentWillMount() {
    this.retrieveUserState();
  }
  componentDidMount() {
    if (localStorage.scheduled_time === '') {
      this.setState({
        scheduled: false
      });
    }
    this.setState({
      scheduled_time: localStorage.scheduled_time,
      scheduled_message: localStorage.scheduled_message,
      stopCalls: localStorage.stopCalls,
      time: moment(localStorage.scheduled_time, 'HHmm')._d
    });
  }

  retrieveUserState() {
    let data = {
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    };
    axios.post('/db/userentry', data)
    .then((user_id) => {
      localStorage.setItem('scheduled_message', user_id.data.scheduled_message);
      localStorage.setItem('scheduled_time', user_id.data.scheduled_time);
    })
    .catch((err) => {
      console.log('Received error in retrieving state:', err);
    });
  }

  handleQuestion(event) {
    this.setState({scheduled_message: event.target.value});
    this.handleTime(null, this.defaultTime);
  }

  handleTime(event, date) {
    let time = (('00' + date.getHours()).slice(-2)) + ':' + (('00' + date.getMinutes()).slice(-2));
    this.setState({
      scheduled_time: time,
      time: date
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = {
      time: this.state.scheduled_time,
      question: this.state.scheduled_message,
      user_id: this.state.user_id
    };
    axios.post('/scheduleCall', data)
    .then(() => {
      this.retrieveUserState();
    });

    this.setState({
      scheduled_time: this.state.scheduled_time,
      scheduled_message: this.state.scheduled_message,
      scheduled: true
    });
    localStorage.setItem('scheduled', true);
    localStorage.setItem('scheduled_time', this.state.scheduled_time);
    localStorage.setItem('stopCalls', false);
  }

  revise(event) {
    localStorage.setItem('stopCalls', false);
    localStorage.setItem('scheduled', false);
    this.setState({
      scheduled: false,
      stopCalls: false,
      scheduled_message: '',
      scheduled_time: '',
      hasQuestion: false
    });
  }

  endCall(event) {
    let data = {
      time: '',
      question: '',
      user_id: localStorage.user_id
    };
    axios.post('/scheduleCall', data)
    .then(() => {
      this.retrieveUserState();
    })
    .catch((err) => {
      console.log('Received err', err);
    });
    localStorage.setItem('scheduled', false);
    localStorage.setItem('stopCalls', true);
    this.setState({
      stopCalls: true,
      hasQuestion: false
    });
  }

  handleQuestionSubmit() {
    this.setState({hasQuestion: !this.state.hasQuestion});
  }

  render() {
    if (this.state.scheduled === false) {
      return (
        <div className="call-entry-container call-home">
        {!this.state.hasQuestion ? <h3>What question would you like to be asked?</h3> : <h3>When would you like your call?</h3>}
        {!this.state.hasQuestion ?
          <MuiThemeProvider>
            <TextField
              value={this.state.scheduled_message}
              onChange={this.handleQuestion}
              fullWidth={true}
              underlineFocusStyle={{borderColor: '#EB5424'}}
              style={{fontFamily: 'Lato, san-serif'}}
              errorText={!this.state.scheduled_message.length > 0 && 'This field is required'}
            />
          </MuiThemeProvider>
          :
          <MuiThemeProvider muiTheme={muiTheme}>
            <TimePicker
              onChange={this.handleTime}
              defaultTime={this.defaultTime}
              textFieldStyle={{fontFamily: 'Lato, san-serif'}}
            />
          </MuiThemeProvider>
        }
        <MuiThemeProvider>
          <RaisedButton
            fullWidth={true}
            label="Submit"
            labelStyle={{fontFamily: 'Lato, san-serif'}}
            onTouchTap={(event) => {
              if (!this.state.hasQuestion) {
                this.state.scheduled_message.length > 0 && this.handleQuestionSubmit();
              } else {
                this.handleSubmit(event);
              }
            }}

          />
        </MuiThemeProvider>
        </div>
      );
    } else {
      return (
        <div className="call-entry-container call-home">
          <h3>You currently have a call scheduled!</h3>
          <MuiThemeProvider muiTheme={muiTheme}>
            <TextField

              value={this.state.scheduled_message}
              fullWidth={true}
              underlineDisabledStyle={{borderColor: '#EB5424'}}
              style={{fontFamily: 'Lato, san-serif'}}
              disabled={true}
            />
          </MuiThemeProvider>

          <MuiThemeProvider muiTheme={muiTheme}>
            <TimePicker

              defaultTime={this.state.time ? this.state.time : moment(localStorage.scheduled_time, 'HHmm')._d}
              textFieldStyle={{fontFamily: 'Lato, san-serif'}}
              underlineDisabledStyle={{borderColor: '#EB5424'}}
              disabled={true}
            />
          </MuiThemeProvider>
          <br/>
          <MuiThemeProvider>
          <RaisedButton
            label="Revise"
            style={{marginRight: '12px'}}
            onTouchTap={this.revise}
          />
          </MuiThemeProvider>
          <MuiThemeProvider>
          <RaisedButton
            label="Stop"
            onTouchTap={this.endCall}
          />
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Dialog
              /* Weird bug where stopCalls is sometimes string instead of boolean
              open={typeof this.state.stopCalls === 'boolean' ? this.state.stopCalls : this.state.stopCalls === 'true'}
              */
              bodyStyle={{fontFamily: 'Lato, san-serif'}}
              contentStyle={{
                width: '40%'

              }}
              open={this.state.stopCalls === true}
              actions={
                [
                  <MuiThemeProvider>
                  <RaisedButton
                    label="Ok"
                    labelStyle={{fontFamily: 'Lato, san-serif'}}
                    onTouchTap={this.revise}


                  />
                  </MuiThemeProvider>
                ]
              }
            >
            All scheduled calls have been stopped
            </Dialog>
          </MuiThemeProvider>
        </div>
      );
    }
  }
}
