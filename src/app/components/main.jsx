/** In this file, we create a React component which incorporates components provided by material-ui */

import React from 'react';
import List from './list';
import Viewer from './view';
import { createHistory, useBasename } from 'history'
import { Router, Route, Link } from 'react-router';

const history = useBasename(createHistory)({
  basename: '/pinterest'
})

const Main = React.createClass({

  getInitialState() {
    return {
    };
  },

  componentWillMount() {
  },

  _handleRequestClose() {
  },

  _handleTouchTap() {
  },
  
  render() {
    return (
      <Router history={history}>
        <Route path="/"         component={List}   />
        <Route path="/path/:id" component={Viewer} />
      </Router>
    );
  },
});

export default Main;
