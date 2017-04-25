import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryScatter,VictoryPie, VictoryZoomContainer, VictoryBar, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import exampleData from '../../../../../static/exampleData.js'

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
   //  console.log('bizniz outside datum', this.props)
   //  console.log('bizniz in piedata', this.props.datum)
   return this.props.pieData.map((obj)=>
       {
         // console.log('obj inside bizniz', obj)
       return {
         x:null,
         y: obj.x,
         name:  obj.x +"\n "+ Math.floor(obj.y) + "%"
       }
      })
  }
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
    }
    this.getScatterData = this.getScatterData.bind(this);
  }

  getScatterData() {
    return this.props.scatterData[0].tones.map((index) => {
      return {
        y: index.tone_name,
        x: index.score*100,
        label: Math.floor(index.score*100),
      };
    });
  }

  getPieData() {
    console.log('bizniz passed down', this.props.pieData[0])
    return this.props.pieData[0].tones.map((index) => {
      console.log(index)
      return {
        x: index.tone_name,
        y: index.score*100
      };
    });
  }


  render() {
    const pieData =  this.getPieData();
    console.log( 'scatter data get', this.getScatterData())
    return (
      <div
        ref="container"
      >
      <VictoryChart
        style={{parent: {paddingLeft: '20%'}}}
        domainPadding={120}
        width = {750}
        height ={750}
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
      </div>
    );
  }
}
