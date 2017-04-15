import React, { Component } from 'react';
import Trend from './trend-chart/Trend.jsx'
import Daily from './daily-chart/Daily.jsx'

export default class Results extends Component {
  render() {
    return (
      <div>
      <h1> Results View </h1>
      <h2> Your overall report</h2>
      <Trend />
      <h2> Your daily report</h2>
      <Daily />
      </div>
    );
  }
}
