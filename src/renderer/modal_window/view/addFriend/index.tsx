import React, { ChangeEvent } from 'react';
import { Input, Button } from 'antd';
import { mainBridge, mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import styles from './index.modules.scss';

const AddFriend = function () {
  let value:string = '';
  async function handleOk() {
    if (!value) {
      return;
    }

    try {
      const res = await mainBridge.server.friendSrv.search(value);
      if (res) {
        await mainBridge.wins.modal.hidden();
        await mainBridge.wins.modal.showBusinessCard({
          isCursorPoint: false,
          cardId: res.id,
        });
      }
    } catch (error) {
      mainEvent.emit(EMainEventKey.UnifiedPrompt, { type: 'error', msg: `${error}` });
    }
  }

  function handCancel() {
    mainBridge.wins.modal.hidden();
  }

  function onChange(e:ChangeEvent<HTMLInputElement>) {
    value = e.target.value;
  }

  return (
    <div className={styles['add-friend']}>
      <div className={styles['add-friend__header']}>
        添加好友

        <i className={`iconfont icon-guanbi ${styles['add-friend__header-icon']}`} onClick={() => handCancel()} aria-hidden="true" />
      </div>

      <div className={styles['add-friend__content']}>
        <Input placeholder="请输入手机号/用户名" size="large" onChange={(e) => onChange(e)} />
      </div>

      <div className={styles['add-friend__footer']}>
        <Button type="primary" onClick={() => handleOk()}>确认</Button>
        <Button className={styles['add-friend__footer-cancel']} onClick={() => handCancel()}>取消</Button>
      </div>
    </div>
  );
};

export default AddFriend;
