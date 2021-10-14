import React from 'react';
import { HashRouter as Router, Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from '../router/index';

function App() {
  return (
    <Router>
      <Link to="/">首页</Link>
      <Link to="/addressBook">addressBook</Link>
      {renderRoutes(routes)}
    </Router>
  );
}

export default App;
