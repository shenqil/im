import React from 'react';
import { render } from 'react-dom';
import NormalLogin from './components/NormalLogin';
import 'antd/dist/antd.css';
import style from './index.scss';
import '../public/css/index.scss';

const App = function () {
  return (
    <div className={style.login}>
      <div className={style.title}>
        IM - 即时沟通
      </div>
      <div className={style.container}>
        <NormalLogin />
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
