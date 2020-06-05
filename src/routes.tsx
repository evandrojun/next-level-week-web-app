import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import RegisterPoint from './pages/register/Point';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact component={Home} path="/" />
        <Route exact component={RegisterPoint} path="/cadastro/ponto-de-coleta" />
      </BrowserRouter>
    );
  }
}

export default Routes;
