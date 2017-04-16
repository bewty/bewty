import React from 'react';


export default class TextEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      time: '',
      profile: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuestion = this.handleQuestion.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      profile: JSON.parse(localStorage.smsCred).phoneNumber.number
    });
  }

  handleQuestion(event) {
    this.setState({question: event.target.value});
  }

  handleTime(event) {
    this.setState({time: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let currentScope = this;
    fetch('http://localhost:3000/scheduleCall', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        time: this.state.time,
        question: this.state.question,
        user_id: this.state.profile
      })
    });
  }


  render() {
    return (
      <div className="container">
        <h1>What question would you like to be asked?</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" value={this.state.question} onChange={this.handleQuestion} />
          </label>
          <h2>When would you like your call?</h2>
          <input type="time" step="900" value={this.state.time} onChange={this.handleTime} />
          <p></p>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
