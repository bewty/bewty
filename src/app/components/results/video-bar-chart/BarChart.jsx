import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avgEmoji: ''
    };
    this.mostFreqEmoji = this.mostFreqEmoji.bind(this);
  }

  mostFreqEmoji(emojis) {
    emojis = emojis.replace('undefined', '');
    let emojiStorage = {};
    let freqEmojiCounter = 0;

    for (let i = 0; i < emojis.length; i += 2) {
      let emoji = emojis.substr(i, 2);
      isNaN(emojiStorage[emoji]) ? emojiStorage[emoji] = 0 : emojiStorage[emoji]++;
      if ( emojiStorage[emoji] > freqEmojiCounter) {
        freqEmojiCounter = emojiStorage[emoji];
        this.state.avgEmoji = emoji;
      }
    }
  }

  render() {
    const {avg_data, raw_data} = this.props;
    const praseAvgData = JSON.parse(avg_data);
    let avgChartData = [];

    for (var emotion in praseAvgData) {
      if ( emotion !== 'emoji') {
        avgChartData.push( Math.floor(praseAvgData[emotion] * 100));
      } else {
        let emojis = praseAvgData[emotion];
        this.mostFreqEmoji(emojis);
      }
    }

    const barAvgData = {
      labels: ['anger', 'contempt', 'fear', 'joy', 'sadness', 'surprise'],
      datasets: [
        {
          label: 'Video Emotion Analysis',
          backgroundColor: 'rgba(235, 84, 36, 0.60)',
          borderColor: 'rgba(235, 84, 36, 0.80)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(235, 84, 36, 1)',
          hoverBorderColor: 'rgba(235, 84, 36, 1)',
          data: avgChartData
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

