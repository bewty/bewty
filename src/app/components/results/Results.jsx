
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

  render() {
    console.log(this.props.data, 'pieData')
    const {datum, x, y} = this.props;
    const pieWidth = 150;
    return (
      <g transform={
        `translate(${x - pieWidth / 2}, ${y - pieWidth / 2})`
        }
      >
        <VictoryPie
          standalone={false}
          height={200}
          width={200}
          data={this.props.data}
          labelComponent={
            <VictoryLabel dy={3.5} verticalAnchor="middle" textAnchor="end"/>
          }
          style={{labels: {fontSize: 0}}}
          colorScale={["#f77", "#55e", "#8af"]}
        />
      </g>
    );
  }
}


export default class App extends React.Component {

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

  render() {
    const pieData = this.state.data.map((index) => {
      return index.children.map((each) => {
        return {
          y: each.name,
          x: each.percentile*100,
          label: Math.floor(each.percentile*100)
        }
      })
    })
    return (
      <VictoryChart
      domainPadding={90}
        width = {1000}
        height ={1000}
        theme={VictoryTheme.material}
        // domain={{y: [0, 5]}}
        domain={{x: [0, 100]}}
        containerComponent={<VictoryZoomContainer responsive={false} />}
      >
        <VictoryScatter
          data={this.state.data}
          labelComponent={
            <VictoryLabel dy={3.5} verticalAnchor="middle" textAnchor="end"/>
          }
          dataComponent= {
            <CustomPie childrenData={this.pieData}/>
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

ReactDOM.render(<App/>, mountNode)
