import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import App from './components/App';
import Home from './components/home/Home';
import Header from './components/header/Header';
import TextEntry from './components/textEntry/TextEntry';
import AudioEntry from './components/audioEntry/AudioEntry';
import VideoEntry from './components/videoEntry2/VideoEntry2';
import Results from './components/results/Results';

import reducers from './reducers';

import './components/bundle.scss';

const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={App} />
        <Route path="/text-entry" component={TextEntry} />
        <Route path="/audio-entry" component={AudioEntry} />
        <Route path="/video-entry" component={VideoEntry} />
        <Route path="/results" component={Results} />
      </div>
    </Router>
  </Provider>
  , document.getElementById('app'));
