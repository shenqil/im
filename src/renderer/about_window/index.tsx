import React, { useState } from 'react';
import { render } from 'react-dom';

import '../public/css/reset.css';
import './index.scss';

const App = function () {
  const [state, setState] = useState('CLICK ME');

  return (
    <div>
      <div className="box">
        <div className="content">
          ，永不退缩
        </div>
      </div>
      <button type="button" onClick={() => setState(state + 2)}>{state}</button>
    </div>
  );
};

render(<App />, document.getElementById('root'));
