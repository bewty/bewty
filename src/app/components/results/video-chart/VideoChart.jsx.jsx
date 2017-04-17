import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

export default class videoChart extends Component {
  render() {
    const {data} = this.props;
    const chartDataRaw = JSON.parse(data);
    let chartData = [];

    for (var emotion in chartDataRaw) {
      console.log('emotion', emotion);
      console.log('chartDataRaw[emotion]', emotion, chartDataRaw[emotion]);
      if ( chartDataRaw[emotion] !== 'emoji') {
        chartData.push( chartDataRaw[emotion] * 100);
        console.log('chartDataRaw[emotion] * 100', chartDataRaw[emotion] * 100);
      }
    }
    console.log('chartData', chartData);

    const chatjsdata = {
      labels: ['anger', 'contempt', 'fear', 'joy', 'sadness', 'surprise'],
      datasets: [
        {
          label: 'Video Emotion',
          backgroundColor: 'rgba(46,200,102,0.2)',
          borderColor: 'rgba(31,160,78,0.2)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(46,200,102,1)',
          hoverBorderColor: 'rgba(31,160,78,1)',
          data: chartData
        }
      ]
    };
    const myData = [
    {x: 'Happiness', y: 10},
    {x: 'Joy', y: 5},
    {x: 'Sadness', y: 15}
    ];
    return (
      <div>
      <Bar
        data={chatjsdata}
        width={100}
        height={400}
        options={{
          maintainAspectRatio: false
        }}
      />
      </div>
    );
  }
}

