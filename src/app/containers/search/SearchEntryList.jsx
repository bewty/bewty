import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntryTextDisplay from '../../components/entry-text-display/EntryTextDisplay';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';
import { selectEntry } from '../../actions/index';

class SearchEntryList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    if (this.props.search_data !== '') {
      return (
        <div className="entry-container call-entry">
          <MuiThemeProvider>
              <ListItem
                innerDivStyle={{padding: '0'}}
                nestedListStyle={{padding: '0'}}
                style={{fontFamily: 'Lato, sans-serif'}}
                primaryTogglesNestedList={true}
                nestedItems={this.props.search_data.data.map((response, index) => {
                  return (
                    <div
                      key={index}
                      onClick={ () => {
                        this.props.selectEntry(response);
                      }}
                    >
                      <EntryTextDisplay entry={response} type={'snippet'} index={index}/>
                    </div>
                  );
                }
              )}
              >
              </ListItem>
          </MuiThemeProvider>
        </div>
      );
    } else {
      return (
        <div>
          <h1>No entries yet...</h1>  
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    entries: state.entries
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectEntry: selectEntry
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchEntryList);
