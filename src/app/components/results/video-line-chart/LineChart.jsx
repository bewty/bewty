import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

export default class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emotionStorage: {},
      timeStampLabel: []
    };
    this.processRawData = this.processRawData.bind(this);
  }

  componentWillMount() {
    this.processRawData(JSON.parse(this.props.raw_data));
  }

  processRawData(praseRawData) {
    let timeStampLabel = [];
    praseRawData.forEach( data => {
      for (let emotion in data[0]) {
        if (emotion === 'timestamp') {
          let newTimeStamp = this.state.timeStampLabel;
          newTimeStamp.push(data[0][emotion].toFixed(2));
          this.setState({ timeStampLabel: newTimeStamp });
        } else {
          this.state.emotionStorage[emotion] === undefined ? this.state.emotionStorage[emotion] = [] : this.state.emotionStorage[emotion].push(Math.floor(data[0][emotion]));
        }
      }
    });
  }

  render() {


    const lineRawData = {
      labels: this.state.timeStampLabel,
      datasets: [
        {
          label: 'anger',
          type: 'line',
          data: this.state.emotionStorage['anger'],
          fill: false,
          borderColor: '#FF3D67',
          backgroundColor: '#FF3D67',
          backgroundColor: '#FF3D67',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#FF3D67',
          pointBackgroundColor: '#FF3D67',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#FF3D67',
          pointHoverBorderColor: '#FF3D67',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'contempt',
          type: 'line',
          data: this.state.emotionStorage['contempt'],
          fill: false,
          borderColor: '#4BC0C0',
          backgroundColor: '#4BC0C0',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#4BC0C0',
          pointBackgroundColor: '#4BC0C0',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#4BC0C0',
          pointHoverBorderColor: '#4BC0C0',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'fear',
          type: 'line',
          data: this.state.emotionStorage['fear'],
          fill: false,
          borderColor: '#606060',
          backgroundColor: '#606060',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#606060',
          pointBackgroundColor: '#606060',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#606060',
          pointHoverBorderColor: '#606060',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'joy',
          type: 'line',
          data: this.state.emotionStorage['joy'],
          fill: false,
          borderColor: '#FFCE56',
          backgroundColor: '#FFCE56',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#FFCE56',
          pointBackgroundColor: '#FFCE56',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#FFCE56',
          pointHoverBorderColor: '#FFCE56',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'sadness',
          type: 'line',
          data: this.state.emotionStorage['sadness'],
          fill: false,
          borderColor: '#B7E6E6',
          backgroundColor: '#B7E6E6',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#B7E6E6',
          pointBackgroundColor: '#B7E6E6',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#B7E6E6',
          pointHoverBorderColor: '#B7E6E6',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
        },
        {
          label: 'surprise',
          type: 'line',
          data: this.state.emotionStorage['surprise'],
          fill: false,
          borderColor: '#43A8EC',
          backgroundColor: '#43A8EC',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#43A8EC',
          pointBackgroundColor: '#43A8EC',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#43A8EC',
          pointHoverBorderColor: '#43A8EC',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
        },
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
      <Line
        data={lineRawData}
        width={100}
        height={200}
        options={options}
      />
      </div>
    );
  }
}

