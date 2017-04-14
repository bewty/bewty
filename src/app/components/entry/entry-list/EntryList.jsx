import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntry } from '../../../actions/index';
import EntrySnippet from '../entry-snippet/EntrySnippet';
import axios from 'axios';
import fakedata from '../fake_entries.js';

class EntryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //   entries: []
    // };
    // axios.post('/db/retrieveEntry')
    // .then( result => {
    //   this.setState({
    //     entries: result.data
    //   });
    // });
      entries: window.fakedata
    };

    this.props.fetchEntry();
  }

  render() {
    return (
      <div>
        {this.state.entries.map( (entry, index) => {
          return <EntrySnippet key={index} entry={entry} index={index}/>;
        })}
      </div>
    );
  }
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators({fetchEntry}, dispatch);
}

export default connect(null, mapDispatchtoProps)(EntryList);
