import React, { Component } from 'react';
import { VictoryScatter, VictoryPie, VictoryZoomContainer, VictoryBar, VictoryLabel, VictoryTheme, VictoryChart } from 'victory';
import {connect} from 'react-redux';

class Daily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barData: this.getBarData()
    };
  }

  componentWillMount() {
    this.getBarData();
  }

  getBarData() {
    var data = [];
    var index = 1;
    this.props.barData.map((obj) => {
      obj.tones.map((tone)=> {
        data.push({
          y: tone.score * 100,
          x: tone.tone_name.split('')[0] + tone.tone_name.split('')[1],
          name: tone.tone_name
        });
      });
    });
    return data;
  }

  render() {
    return (
      <div
          className="entry-list-container"
          ref="container"
          style={{
            textAlign: 'center',
            width: '40%'
          }}
      >
        <VictoryChart
          domainPadding={20}
          style={{
            labels: {
              fontSize: 20
            },
          }}
            width = {500}
            height ={500}
        >
          <VictoryBar
          name ='bar'
          data={this.state.barData}
          eventKey={(datum) => datum.name}
          labelComponent={
            <VictoryLabel textAnchor="middle"/>
          }
          events={[
            {
              childName: ['bar'],
              target: 'data',
              eventHandlers: {
                onMouseOver: () => {
                  return [{
                    target: 'labels',
                    mutation: (props) => {
                      return props.text === props.datum.name ?
                      null : {
                        text: props.datum.name + '\n' + Math.floor(props.datum.y) + ' %',
                      };
                    }
                  }];
                },
                onMouseOut: () => {
                  return [{
                    target: 'labels',
                    mutation: (props) => {
                      return props.text === props.datum.name ?
                      null : {
                        text: null,
                      };
                    }
                  }];
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


function mapStateToProps(state) {
  return {
    entrySelected: state.entrySelected
  };
}

export default connect(mapStateToProps, null)(Daily);
