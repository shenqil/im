import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { mainBridge } from '@renderer/public/ipcRenderer';
import NormalLogin from './components/NormalLogin';
import 'antd/dist/antd.css';
import '@renderer/public/css/index.scss';
import style from './index.modules.scss';

const App = function () {
  useEffect(() => {
    mainBridge.server.connectSrv.loginMenuReady();
  }, []);
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
