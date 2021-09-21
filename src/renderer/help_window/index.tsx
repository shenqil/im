import React, { useState } from 'react';
import { render } from 'react-dom';

import '../public/css/reset.css';
import '../public/font/iconfont.css';

function App() {
  const [state, setState] = useState('CLICK ME');

  return (
    <div>
      <div className="box">
        <div className="content">
          ，永不退缩
          <i className="iconfont icon-xiazai" />
        </div>
      </div>
      <button type="button" onClick={() => setState(state + 1)}>{state}</button>
    </div>
  );
}

render(<App />, document.getElementById('root'));
