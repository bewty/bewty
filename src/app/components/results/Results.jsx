
import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryScatter, VictoryZoomContainer, VictoryChart } from 'victory';

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    data: window.exampleData
  }

  getScatterData() {
    return range(100).map((index) => {
      return {
        x: random(1, 100),
        y: random(10, 90),
        size: random(8) + 3
      };
    });
  }

  render() {
    return (
      <VictoryChart
        domain={{y: [0, 100]}}
        containerComponent={<VictoryZoomContainer responsive={false} zoomDomain={{x: [5, 35], y: [0, 100]}}/>}
      >
        <VictoryScatter
          data={this.state.data}
          style={{
            data: {
              opacity: (d) =>  d.y % 5 === 0 ? 1 : 0.7,
              fill: (d) => d.y % 5 === 0 ? "tomato" : "black"
            }
          }}
        />
      </VictoryChart>
    );
  }
}

const mountNode = document.getElementById('app')

ReactDOM.render(<App/>, mountNode)
