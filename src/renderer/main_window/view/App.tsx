import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import routes from '../router';
import { store } from '../store';

const App = function () {
  return (
    <Provider store={store}>
      <Router>
        {renderRoutes(routes)}
      </Router>
    </Provider>
  );
};

export default App;
