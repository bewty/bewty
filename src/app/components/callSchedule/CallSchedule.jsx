import React from 'react';

export default class CallSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduled_message: '',
      scheduled_time: '',
      phonenumber: '',
      user_id: '',
      stop: false,
      scheduled: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuestion = this.handleQuestion.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.revise = this.revise.bind(this);
    this.endCall = this.endCall.bind(this);
  }
  componentWillMount() {
    this.setState({
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number,
      user_id: localStorage.user_id,
      scheduled_time: localStorage.scheduled_time,
      scheduled_message: localStorage.scheduled_message
    }); 
  }
  componentDidMount() {
    if (this.state.scheduled_time !== '') {
      this.setState({
        scheduled: true
      });
    }
    console.log('State of callSchedule:', this.state);
  }

  handleQuestion(event) {
    this.setState({scheduled_message: event.target.value});
  }

  handleTime(event) {
    this.setState({scheduled_time: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let currentScope = this;
    fetch('/scheduleCall', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        time: this.state.scheduled_time,
        question: this.state.scheduled_message,
        user_id: this.state.user_id
      })
    });
    this.setState({
      scheduled: true,
      scheduled_time: this.state.scheduled_time.replace(':', '')
    });
  }

  revise(event) {
    this.setState({
      scheduled: false,
      stop: false,
      scheduled_message: '',
      scheduled_time: ''
    });
    console.log('This was clicked');
  }

  endCall(event) {
    console.log('Ending call');
    let currentScope = this;
    fetch('/scheduleCall', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        time: '',
        question: '',
        user_id: this.state.user_id
      })
    });
    this.setState({
      stop: true
    });
  }

  render() {
    if (this.state.stop === true) {
      return (
        <div>
          <h1>All scheduled calls have been stopped.</h1>
          <h3>Create new scheduled call:</h3>
          <input onClick={this.revise} type="submit" value="Revise" />
        </div>
      );
    }
    if (this.state.scheduled === false) {
      return (
        <div className="container">
          <h1>What question would you like to be asked?</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.scheduled_message} onChange={this.handleQuestion} />
            </label>
            <h2>When would you like your call?</h2>
            <input type="time" step="900" value={this.state.scheduled_time} onChange={this.handleTime} />
            <p></p>
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <h2>You currently have a call scheduled for {this.state.scheduled_time.slice(0, 2) + ':' + this.state.scheduled_time.slice(2)}</h2> 
          <h2>With the question:</h2>
          <h1>{this.state.scheduled_message}</h1>
          <h4>Would you like to revise your message or time?</h4>
          <input onClick={this.revise} type="submit" value="Revise" /> 
          <h4>Or stop current call schedule?</h4>
          <input onClick={this.endCall} type="submit" value="End Schedule" /> 
        </div>
      );
    }
  }
}
