import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

const Routes = ({isAuthenticated, checkAuth}) => {

  return (
    <Router>
      <div>
        <Route exact path="/" render={() => (
            isAuthenticated ? (
              <Redirect to="/entries"/>
            ) : (
              <Landing />
            )
          )}/>
          <Route path="/login" render={() => (
            isAuthenticated ? (
              <Redirect to="/entries"/>
            ) : (
              <App checkAuth={checkAuth}/>
            )
          )}/>
        <Route path="/new-entry" component={NewEntry} />
        <Route path="/entries" component={EntryList} />
        <Route path="/entry/:id" component={EntryView} />
        <Route path="/results" component={Results} />
        <Route path="/call-home" component={CallHome} />
        <Route path="/search" component={Search} />
      </div>
    </Router>
  );
};

export default Routes;
