import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
//     console.log('Rendering within CallChart:', this.props);
    let watData = JSON.parse(this.props.avg_data.watson_results).document_tone.tone_categories[0].tones;
    let chartData = watData.map((tone) => {
      return tone.score * 100;
    });
//     console.log('Watson data is:', watData, 'Chart data is:', chartData);
    let avgChartData = [];

    const barAvgData = {
      labels: ['anger', 'disgust', 'fear', 'joy', 'sadness'],
      datasets: [
        {
          label: 'Emotion Tone Analysis',
          backgroundColor: 'rgba(235, 84, 36, 0.60)',
          borderColor: 'rgba(235, 84, 36, 0.80)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(235, 84, 36, 1)',
          hoverBorderColor: 'rgba(235, 84, 36, 1)',
          data: chartData
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            max: 100,
            min: 0,
            stepSize: 10
          }
        }]
      }
    };

    return (
      <div className='barchart-container'>
      <Bar
        data={barAvgData}
        width={100}
        height={200}
        options={options}
      />
      </div>
    );
  }
}
