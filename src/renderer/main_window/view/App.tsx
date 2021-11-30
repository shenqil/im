import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import SideLayout from '../layout/SideLayout';

const App = function () {
  return (
    <Provider store={store}>
      <Router>
        <Route component={SideLayout} />
      </Router>
    </Provider>
  );
};

export default App;
