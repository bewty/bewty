
import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryScatter, VictoryZoomContainer, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import exampleData from '../../../../static/exampleData.js'

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
