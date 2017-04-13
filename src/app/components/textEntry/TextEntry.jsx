import React from 'react';
import axios from 'axios';

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
    const data = {
      text: this.state.value,
      entryType: 'text'
    };

    axios.post('/entry', data)
    .then( res => console.log('text upload to server done', res))
    .catch(err => console.log('text upload error...', err));

    this.setState({
      value: ''
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
