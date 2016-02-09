import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import List from './components/list';
import Viewer from './components/view';
import { createHistory, useBasename } from 'history'
import { Router, Route, Link } from 'react-router';
injectTapEventPlugin();
ReactDOM.render((
  <Router>
    <Route path="/" component={List} />
    <Route path="/viewer/:from/:vid/:page" component={Viewer} />
  </Router>
), document.getElementById('app'));
