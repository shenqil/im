import React from 'react';
import { render } from 'react-dom';
import { Input, Button } from 'antd';
import 'antd/dist/antd.css';
import '../public/css/index.scss';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

const App = function () {
  function handleOk() {
    mainBridge.wins.addFriend.closeWin();
  }

  function handCancel() {
    mainBridge.wins.addFriend.closeWin();
  }

  return (
    <div className={styles['add-friend']}>
      <div className={styles['add-friend__header']}>
        添加好友

        <i className={`iconfont icon-guanbi ${styles['add-friend__header-icon']}`} onClick={() => handCancel()} aria-hidden="true" />
      </div>

      <div className={styles['add-friend__content']}>
        <Input placeholder="请输入手机号/用户名" size="large" />
      </div>

      <div className={styles['add-friend__footer']}>
        <Button type="primary" onClick={() => handleOk()}>确认</Button>
        <Button className={styles['add-friend__footer-cancel']} onClick={() => handCancel()}>取消</Button>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
