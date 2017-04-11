import React from 'react';
import $ from 'jquery';

export default class TextEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      result: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    // fetch('http://localhost:3000/test', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    //   body: JSON.stringify({
    //     test: this.state.value
    //   })
    // });
    var self = this;
    console.log(this.state.value);
    $.ajax({
      url: '/api/watson',
      type: 'POST',
      data: {
        text: this.state.value
      },
      success: function(result) {
        console.log('Success!');
        self.setState({result: result});
      },
      error: function() {
        console.log('error result');
      }
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Text Entry</h1>
        <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <p>{this.state.result}</p>
      </form>
      </div>
    );
  }
}
