import React from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

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
      user_id: '',
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
      //stop: localStorage.stopCalls,
      stopCalls: localStorage.stopCalls
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
    console.log(date);
    let time = (('00' + date.getHours()).slice(-2)) + ':' + (('00' + date.getMinutes()).slice(-2));
    console.log(time);
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
      console.log('Successfully sent data');
    });

    // should set state on success
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
      // scheduled: false,
      hasQuestion: false
    });
  }

  handleQuestionSubmit() {
    this.setState({hasQuestion: !this.state.hasQuestion});
  }

  render() {
    console.log(this.state);
    // if (this.state.stopCalls === true) {
    //   // return (
    //   //   <div>
    //   //     <h1>All scheduled calls have been stopped.</h1>
    //   //     <h3>Create new scheduled call:</h3>
    //   //     <input onClick={this.revise} type="submit" value="Schedule" />
    //   //   </div>
    //   // );
    //   return (
    //     <MuiThemeProvider>
    //       <Dialog
    //          Weird bug where stopCalls is sometimes string instead of boolean
    //         open={typeof this.state.stopCalls === 'boolean' ? this.state.stopCalls : this.state.stopCalls === 'true'}

    //         open={true}
    //         actions={
    //           [
    //             <MuiThemeProvider>
    //             <FlatButton
    //               label="Ok"
    //               onTouchTap={this.revise}
    //             />
    //             </MuiThemeProvider>
    //           ]
    //         }
    //       >
    //       All scheduled calls have been stopped
    //       </Dialog>
    //     </MuiThemeProvider>

    //   );
    // }
    if (this.state.scheduled === false) {
      // return (
      //   <div className="container">
      //     <h1>What question would you like to be asked?</h1>
      //     <form onSubmit={this.handleSubmit}>
      //       <label>
      //         <input type="text" value={this.state.scheduled_message} onChange={this.handleQuestion} />
      //       </label>
      //       <h2>When would you like your call?</h2>
      //       <input type="time" step="900" value={this.state.scheduled_time} onChange={this.handleTime} />
      //       <p></p>
      //       <input type="submit" value="Submit" />
      //     </form>
      //   </div>
      // );
      console.log('testing');
      return (
        <div className="new-entry-container">
        {!this.state.hasQuestion ? <h3>What question would you like to be asked?</h3> : <h3>When would you like your call?</h3>}
        {!this.state.hasQuestion ?
          <MuiThemeProvider>
            <TextField
              value={this.state.scheduled_message}
              onChange={this.handleQuestion}
              fullWidth={true}
              underlineFocusStyle={{borderColor: '#EB5424'}}
              style={{fontFamily: 'Lato, san-serif'}}
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
            onTouchTap={!this.state.hasQuestion ? this.handleQuestionSubmit : this.handleSubmit}
          />
        </MuiThemeProvider>
        </div>
      );
    } else {
      console.log('else');
      return (
        <div className="new-entry-container">
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

              defaultTime={this.state.time}
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
              open={this.state.stopCalls === true}
              actions={
                [
                  <MuiThemeProvider>
                  <FlatButton
                    label="Ok"
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
      // return (
      //   <div>
      //     <h2>You currently have a call scheduled for {this.state.scheduled_time}</h2>
      //     <h2>With the question:</h2>
      //     <h1>{this.state.scheduled_message}</h1>
      //     <h4>Would you like to revise your message or time?</h4>
      //     <input onClick={this.revise} type="submit" value="Revise" />
      //     <h4>Or stop current call schedule?</h4>
      //     <input onClick={this.endCall} type="submit" value="End Schedule" />
      //   </div>
      // );
    }
// =======
//     return (
//       <div className="new-entry-container">
//         {!this.state.hasQuestion ? <h3>What question would you like to be asked?</h3> : <h3>When would you like your call?</h3>}
//       {!this.state.hasQuestion ?
//         <MuiThemeProvider>
//           <TextField
//             value={this.state.question}
//             onChange={this.handleQuestion}
//             fullWidth={true}
//             underlineFocusStyle={{borderColor: '#EB5424'}}
//             style={{fontFamily: 'Lato, san-serif'}}
//           />
//         </MuiThemeProvider>
//         :
//         <MuiThemeProvider muiTheme={muiTheme}>
//           <TimePicker
//             onChange={this.handleTime}
//             defaultTime={this.defaultTime}
//             textFieldStyle={{fontFamily: 'Lato, san-serif'}}
//           />
//         </MuiThemeProvider>
//       }
//       <MuiThemeProvider>
//         <RaisedButton
//           fullWidth={true}
//           label="Submit"
//           labelStyle={{fontFamily: 'Lato, san-serif'}}
//           onTouchTap={!this.state.hasQuestion ? this.handleQuestionSubmit : this.handleSubmit}
//         />
//       </MuiThemeProvider>
//       </div>
//     );
// >>>>>>> [Style] change class name to not mess with original containers
  }
}
