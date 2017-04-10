
import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryScatter,VictoryPie, VictoryZoomContainer, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import exampleData from '../../../../static/exampleData.js'

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
         x: obj.name +"\n "+ Math.floor(obj.percentile *100),
         y: obj.percentile * 100,
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
          data={this.takeOnePieceOfPieData()}
          standalone={false}
          innerRadius ={45}
          height={200}
          width={200}
          style={{labels: {fontSize: 10}}}
          colorScale={["#f77", "#55e", "#8af","#7c4dff", "#c6ff00", "#a1887f", "#90a4ae"]}
        />
      </g>
    );
  }
}


export default class Chart extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    data: this.getScatterData(),
    children: window.exampleData.personality.children
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

  render() {
    const pieData =  this.getPieData();
    return (
      <VictoryChart
      domainPadding={120}
        width = {1000}
        height ={1000}
        theme={VictoryTheme.material}
        // domain={{y: [0, 5]}}
        domain={{x: [0, 100]}}
        containerComponent={<VictoryZoomContainer zoomDomain={{x: [0,1000], y: [0, 10]}} responsive={false} />}
      >
        <VictoryScatter
          data={this.state.data}
          labelComponent={
            <VictoryLabel dx={22} dy={2} verticalAnchor="middle" textAnchor="end"/>
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
    );
  }
}

const mountNode = document.getElementById('app')

ReactDOM.render(<Chart/>, mountNode)
