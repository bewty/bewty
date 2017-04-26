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
    axios.post('/elasticSearch', data)
    .then((response) => {
      this.setState({search_data: response, search: ''});
    })
    .then(res => console.log('search done, results retrieved'))
    .catch(err => console.log('text upload error...', err));
  }
  render() {
    return (
      <div className="container">
      <h1>Search</h1>
        <form onSubmit={this.handleSubmit}>
        <label>
          <input 
          type="text" 
          value={this.state.search} 
          onChange={this.handleChange} 
          placeholder="Search for anything..."
          size="100"
          />
        </label>
        <input type="submit" value="Search" />
      </form>
      <SearchEntryList search_data={this.state.search_data} />
      </div>
    );
  }
}
