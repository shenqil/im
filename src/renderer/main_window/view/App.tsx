import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import routes from '../router/index';
import store from '../store/index';

function App() {
  return (
    <Router>
      <Provider store={store}>
        {renderRoutes(routes)}
      </Provider>
    </Router>
  );
}

export default App;
