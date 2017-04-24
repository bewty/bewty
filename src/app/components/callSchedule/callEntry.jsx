import React from 'react';
import EntryTextDisplay from '../entry-text-display/EntryTextDisplay';
import {List, ListItem} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';

export default class CallEntry extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // return (
    //   <div>
    //     <h2>{this.props.call.question[this.props.call.question.length - 1] === '?' ? this.props.call.question : this.props.call.question + '?'}</h2>
    //     <h3>Started on: {this.props.call.date_set.slice(0, 10)}</h3> <h4> Calltime: {this.props.call.call_time.slice(0, 2) + ':' + this.props.call.call_time.slice(2)}</h4>
    //     {this.props.call.responses.map((response) => {
    //       if (response.text) {
    //         return <EntryTextDisplay entry={response} type={'snippet'}/>;
    //       }
    //     })}
    //   </div>
    // );
    console.log(this.props);
    return (
      <div>
        <MuiThemeProvider>

            <ListItem
              primaryTogglesNestedList={true}
              nestedItems={this.props.call.responses.map((response) => {
                if (response.text) {
                  return <EntryTextDisplay entry={response} type={'snippet'}/>;
                }
              })}
            >
              <div>
                <h3 className="question">{this.props.call.question[this.props.call.question.length - 1] === '?' ? this.props.call.question : this.props.call.question + '?'}</h3>
                <div className="entry-meta">
                  <span className="date">{moment(this.props.call.date_set).format('MM-DD-YYYY')}</span>
                </div>
                <div className="time-container">
                  <span className="time">{moment(this.props.call.date_set).format('h:mm a')}</span>
                </div>
              </div>

            </ListItem>

        </MuiThemeProvider>
      </div>

    );
  }
}


              /*
              <h2>{this.props.call.question[this.props.call.question.length - 1] === '?' ? this.props.call.question : this.props.call.question + '?'}</h2>
              <h3>Started on: {this.props.call.date_set.slice(0, 10)}</h3> <h4> Calltime: {this.props.call.call_time.slice(0, 2) + ':' + this.props.call.call_time.slice(2)}</h4>
              */

