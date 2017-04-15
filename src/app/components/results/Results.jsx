
import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryScatter,VictoryPie, VictoryZoomContainer, VictoryBar, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import exampleData from '../../../../static/exampleData.js'
import exampleToneData from '../../../../static/exampleToneData.js'

class CustomPie extends React.Component {
  static propTypes = {
    datum: React.PropTypes.object,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  };
  constructor(props) {
    super(props);
  }

  takeOnePieceOfPieData() {
   return this.props.datum.children.map((obj)=>
       {
       return {
         x:" ",
         y: obj.percentile * 100,
         name:  obj.name +"\n "+ Math.floor(obj.percentile *100) + "%"
       }
      })}
  render() {
    // console.log(this.getPieData().forEach(el => el.map(x => console.log(x))), 'pie mofo')
    const {x, y} = this.props;
    const pieWidth = 150;
    return (
      <g transform={
        `translate(${x - pieWidth / 2}, ${y - pieWidth / 2})`
        }
      >
        <VictoryPie
          name='pieceOfThePie'
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [{
                    target: "labels",
                    mutation: (props) => {
                      return props.text === props.datum.name ?
                        null : { text: props.datum.name }
                    }
                  }];
                },
                 onMouseOut: () => {
                   return [{
                    target: "labels",
                    mutation: (props) => {
                      return props.text === props.datum.name ?
                        null : { text: props.datum.name }
                     }
                   }]
                 }
              }
            }
          ]}
          data={this.takeOnePieceOfPieData()}
          standalone={false}
          innerRadius ={35}
          height={200}
          width={200}
          style={{labels: {fontSize: 20}}}
          colorScale={["#f77", "#55e", "#8af","#7c4dff", "#c6ff00", "#a1887f", "#90a4ae"]}
        />
      </g>
    );
  }
}


export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getScatterData(),
      children: window.exampleData.personality.children,
      barData: this.getBarData()
    }
  }
  componentWillMount() {
    this.getBarData();
  }

  getScatterData() {
    return window.exampleData.personality.map((index) => {
      return {
        y: index.name,
        x: index.percentile*100,
        label: Math.floor(index.percentile*100),
        children: index.children
      };
    });
  }

  getPieData() {
    window.exampleData.personality.map((bigTrait) =>{
    bigTrait.children.map((trait) => {
      return {
        x: trait.name,
        y: trait.percentile * 100
      }
    })
  })
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
    const pieData =  this.getPieData();
    // console.log( 'THIS IS THE STATE YO ', this.state)
    return (
      <div
        ref="container"
        style={{
          width: '800px',
          height: '800px',
        }}
      >
      <VictoryChart
        domainPadding={120}
        width = {1000}
        height ={1000}
        theme={VictoryTheme.material}
        // domain={{y: [0, 5]}}
        domain={{x: [0, 100]}}
        containerComponent={<VictoryZoomContainer zoomDomain={{x: [0,100], y: [0, 6]}} responsive={false} />}
      >
        <VictoryScatter
          data={this.state.data}
          labelComponent={
            <VictoryLabel dx={25} dy={2} verticalAnchor="middle" textAnchor="end"/>
          }
          dataComponent= {
            <CustomPie pieData={pieData}/>
          }
          style={{
            data: {fill: (d) => d.x > 80 ? "tomato" : "grey", stroke: "black", strokeWidth:5},
                  labels: {fontSize:17},
          }}
        />
      </VictoryChart>
      <VictoryChart
        domainPadding={20}
        style={{
          labels: {fontSize:20},
        }}
      >
        <VictoryBar
        name ='bar'
        data={this.state.barData}
        eventKey={(datum) => datum.name}
        events={[
          {
            childName: ['bar'],
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [{
                  target: "labels",
                  mutation: (props) => {
                    return props.text === props.datum.name ?
                      null : { text: props.datum.name }
                  }
                }];
              },
               onMouseOut: () => {
                 return [{
                  target: "labels",
                  mutation: (props) => {
                    return props.text === props.datum.name ?
                      null : { text: props.datum.name }
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

const mountNode = document.getElementById('app')

ReactDOM.render(<Chart/>, mountNode)
