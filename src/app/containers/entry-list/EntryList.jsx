import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntry, selectEntry } from '../../actions/index';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';
import axios from 'axios';

class EntryList extends Component {
  constructor(props) {
    super(props);
    this.props.fetchEntry = this.props.fetchEntry.bind(this);
  }

  componentWillMount() {
    axios.post('/db/retrieveEntry')
    .then( result => {
      this.props.fetchEntry(result.data);
    })
    .catch( err => console.error('Fetching Entry Error'));
  }

  renderList() {
    return this.props.entries.map( (entry, index) => {
      return (
        <div key={index} onClick={ () => this.props.selectEntry(entry)}>
          <EntryTextDisplay
            entry={entry}
            index={index}
            type='snippet'
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderList()}
      </div>
    );
  }
}

//anything returned from this function will end up as props on the EntryList container
function mapStateToProps(state) {
  return {
    entries: state.entries
  };
}

//anything returned from this function will end up as props on the EntryList container
function mapDispatchToProps(dispatch) {
  //whenever actions are called, the result should be passed to all reducers
  return bindActionCreators({
    selectEntry: selectEntry,
    fetchEntry: fetchEntry,
  }, dispatch);
}

//promote EntryList from component to container. It needs to know about
//this new dispatch method, selectEntry, fetchEntry. Make it available
//as a prop
export default connect(mapStateToProps, mapDispatchToProps)(EntryList);
