
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

  render() {
    const {datum, x, y} = this.props;
    const pieWidth = 150;

    return (
      <g transform={
        `translate(${x - pieWidth / 2}, ${y - pieWidth / 2})`
        }
      >
        <VictoryPie
          standalone={false}
          height={pieWidth}
          width={pieWidth}
          data={datum.pie}
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
    data: this.getScatterData()
  }

  getScatterData() {
    return window.exampleData.personality.map((index) => {
      return {
        y: index.name,
        x: index.percentile*100,
        size:40,
        label: Math.floor(index.percentile*100)
      };
    });
  }

  render() {
    console.log('this is the state', this.state.data)
    return (
      <VictoryChart
      domainPadding={60}
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
            <CustomPie />
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
