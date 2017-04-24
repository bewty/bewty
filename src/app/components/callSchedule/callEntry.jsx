import React from 'react';
import EntryTextDisplay from '../entry-text-display/EntryTextDisplay';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class CallEntry extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h2>{this.props.call.question[this.props.call.question.length - 1] === '?' ? this.props.call.question : this.props.call.question + '?'}</h2>
        <h3>Started on: {this.props.call.date_set.slice(0, 10)}</h3> <h4> Calltime: {this.props.call.call_time.slice(0, 2) + ':' + this.props.call.call_time.slice(2)}</h4>
        {this.props.call.responses.map((response) => {
          if (response.text) {
            return <EntryTextDisplay entry={response} type={'snippet'}/>;
          }
        })}
      </div>
    );
    // return (
    //   <div>
    //     <MuiThemeProvider>
    //       <DropDownMenu>
    //         <MenuItem>
    //           <h2>{this.props.call.question[this.props.call.question.length - 1] === '?' ? this.props.call.question : this.props.call.question + '?'}</h2>
    //           <h3>Started on: {this.props.call.date_set.slice(0, 10)}</h3> <h4> Calltime: {this.props.call.call_time.slice(0, 2) + ':' + this.props.call.call_time.slice(2)}</h4>
    //         </MenuItem>
    //       </DropDownMenu>
    //     </MuiThemeProvider>
    //   </div>

    // );
  }
}
