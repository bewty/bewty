import React, { Component } from 'react';
import { VictoryScatter,VictoryPie, VictoryZoomContainer, VictoryBar, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import exampleToneData from '../../../../../static/exampleToneData.js'
import {connect} from 'react-redux';

class Daily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barData: this.getBarData()
    }
  }

  componentWillMount() {
    this.getBarData();
  }

  getBarData() {
   var data = [];
   var index = 1
   this.props.barData.map((obj) => {obj.tones.map((tone)=> {
      data.push({
          y: tone.score *100,
          x: tone.tone_name.split(' ')[0].split('')[0] ,
          name: tone.tone_name
         })
     // console.log('count', index)
       })
    });
   // console.log('data', data)
   return data;
  }

  render() {
    return (
    <div
        ref="container"
        style={{
          width: '800px',
          height: '800px',
        }}
    >
    <VictoryChart
      domainPadding={20}
      style={{
        labels: {fontSize:20},
      }}
        width = {500}
        height ={500}
    >
      <VictoryBar
      name ='bar'
      data={this.state.barData}
      eventKey={(datum) => datum.name}
      labelComponent={
        <VictoryLabel angle={300} textAnchor="start"/>
      }
      events={[
        {
          childName: ['bar'],
          target: "data",
          eventHandlers: {
            onMouseOver: () => {
              return [{
                target: "labels",
                mutation: (props) => {
                  // console.log('props', props)
                  return props.text === props.datum.name ?
                    null : {
                            text: props.datum.name + '\n' + Math.floor(props.datum.y) + " %",
                            }
                }
              }];
            },
             onMouseOut: () => {
               return [{
                target: "labels",
                mutation: (props) => {
                  return props.text === props.datum.name ?
                    null : {
                    text: null,
                    }
                 }
               }]
             }
          }
        }
      ]}
      />
    </VictoryChart>
    </div>
    );
  }
}


function mapStateToProps(state){
  console.log('entrySelected', state.entrySelected)
  return {
    entrySelected: state.entrySelected
  };
}

export default connect(mapStateToProps, null)(Daily);
