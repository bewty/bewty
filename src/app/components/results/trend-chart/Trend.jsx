import React from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryScatter, VictoryPie, VictoryZoomContainer, VictoryBar, VictoryLabel, VictoryTheme, VictoryChart, VictoryAxis } from 'victory';

class CustomPie extends React.Component {
  // static propTypes = {
  //   datum: React.PropTypes.object,
  //   x: React.PropTypes.number,
  //   y: React.PropTypes.number
  // };

  constructor(props) {
    super(props);
  }

  takeOnePieceOfPieData() {
    return this.props.datum.children.map((obj) => {
      return {
        x: ' ',
        y: obj.percentile * 100,
        name: obj.name + '\n ' + Math.floor(obj.percentile * 100) + '%'
      };
    });
  }

  render() {
    const {x, y} = this.props;
    const pieWidth = 150;
    return (
      <g transform={
        `translate(${x - pieWidth / 2},
        ${y - pieWidth / 2})`}
      >
        <VictoryPie
          name='pieceOfThePie'
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: () => {
                  return [{
                    target: 'labels',
                    mutation: (props) => {
                      return props.text === props.datum.name ?
                        null : { text: props.datum.name };
                    }
                  }];
                },
                onMouseOut: () => {
                  return [{
                    target: 'labels',
                    mutation: (props) => {
                      return props.text === props.datum.name ?
                        null : { text: props.datum.name };
                    }
                  }];
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
          colorScale={['#f77', '#55e', '#8af', '#7c4dff', '#c6ff00', '#a1887f', '#90a4ae']}
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
    };
    this.getScatterData = this.getScatterData.bind(this);
  }

  getScatterData() {
    return this.props.watson.personality.map((index) => {
      return {
        y: index.name,
        x: index.percentile * 100,
        label: Math.floor(index.percentile * 100),
        children: index.children
      };
    });
  }

  getPieData() {
    this.props.watson.personality.map((bigTrait) =>{
      bigTrait.children.map((trait) => {
        return {
          x: trait.name,
          y: trait.percentile * 100
        };
      });
    });
  }

  render() {
    const pieData = this.getPieData();
    return (
      <div
        ref="container"
      >
        <VictoryChart
          style={{parent: {padding: '0 20%', maxWidth: '60%'}}}
          domainPadding={120}
          width = {750}
          height ={750}
          theme={VictoryTheme.material}
          domain={{x: [-20, 120]}}
        >
          <VictoryAxis
            crossAxis={false}
          />
          <VictoryAxis
            offsetX={50}
            dependentAxis />
          <VictoryScatter
            data={this.state.data}
            labelComponent={
              <VictoryLabel dx={25} dy={2} verticalAnchor="middle" textAnchor="end"/>
            }
            dataComponent= {
              <CustomPie pieData={pieData}/>
            }
            style={{
              data: {
                fill: (d) => d.x > 80 ? 'tomato' : 'grey',
                stroke: 'black', strokeWidth: 5
              },
              labels: {fontSize: 17},
            }}
          />
        </VictoryChart>
      </div>
    );
  }
}
