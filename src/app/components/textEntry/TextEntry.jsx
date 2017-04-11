import React from 'react';


export default class TextEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let currentScope = this;
    fetch('http://localhost:3000/transcribe', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        TranscriptionText: currentScope.state.value,
        textID: 'test123'
      })
    });
  }

  handleClick() {
    console.log('state:', this.state);
  }

  render() {
    return (
      <div className="container">
        <h1 onClick={this.handleClick}>Text Entry</h1>
        <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}
