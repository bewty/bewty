import React, { Component } from 'react';
import { VictoryScatter,VictoryPie, VictoryZoomContainer, VictoryBar, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import exampleToneData from '../../../../../static/exampleToneData.js'


export default class Daily extends Component {
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
   window.exampleToneData.document_tone.tone_categories.map((obj) => {obj.tones.map((tone)=> {
      data.push({
          y: tone.score *100,
          x: index++,
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
      theme={VictoryTheme.material}
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
