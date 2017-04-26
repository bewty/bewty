import React from 'react';
import axios from 'axios';
import SearchEntryList from './SearchEntryList.jsx';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      search_data: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({search: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = {
      search: this.state.search,
      phonenumber: JSON.parse(localStorage.smsCred).phoneNumber.number
    };
    console.log('Constructed data:', data);
    axios.post('/elasticSearch', data)
    .then((response) => {
      console.log('Received response:', response);
      this.setState({search_data: response, search: ''});
    })
    .then(res => console.log('search done, state updated:', this.state))
    .catch(err => console.log('text upload error...', err));
  }
  render() {
    return (
      <div className="container">
      <h1>Search</h1>
        <form onSubmit={this.handleSubmit}>
        <label>
          <textarea
            type="text"
            value={this.state.search}
            onChange={this.handleChange}
            rows="10"
            cols="50"
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <h2>Search Results</h2>
      <SearchEntryList search_data={this.state.search_data} />
      </div>
    );
  }
}
