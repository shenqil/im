import React, { ChangeEvent, useState, useEffect } from 'react';
import { Input, Radio, Button } from 'antd';
import { mainBridge, mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import defaultImg from '@renderer/public/img/avatar.png';
import { IFriendInfo } from '@main/modules/mqtt/interface';
import {
  CloseCircleOutlined,
} from '@ant-design/icons';
import PinyinMatch from 'pinyin-match';
import styles from './index.scss';

interface IMemberItemProps {
  info:IFriendInfo,
  checked:boolean,
  isLeft:boolean,
  onCloseClick():void
}
const MemberItem = function ({
  info, checked, isLeft, onCloseClick,
}:IMemberItemProps) {
  return (
    <div className={styles['member-item']}>

      <div className={styles['member-item__left']}>
        <img src={defaultImg} alt="" className={styles['member-item__img']} />

        <div className={styles['member-item__name']}>
          {info.realName}
        </div>
      </div>

      <div className={styles['member-item__right']}>
        {isLeft && <Radio checked={checked} />}
        {!isLeft && (
        <CloseCircleOutlined
          className={styles['member-item__right-icon']}
          onClick={onCloseClick}
        />
        )}
      </div>

    </div>
  );
};

const AddMember = function () {
  const [friendList, setFriendList] = useState<IFriendInfo[]>([]);
  const [selectList, setSelectList] = useState<IFriendInfo[]>([]);
  const [allList, setAllList] = useState<IFriendInfo[]>([]);

  useEffect(() => {
    mainBridge.server.friendSrv.getMyFriendList()
      .then((res) => {
        setAllList(res);
        setFriendList(res);
      })
      .catch((err) => {
        mainEvent.emit(EMainEventKey.UnifiedPrompt, `${err}`);
      });
  }, []);

  function handCancel() {
    mainBridge.wins.modal.hidden();
  }

  function onChange(e:ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const list:IFriendInfo[] = [];
    if (value) {
      for (const member of allList) {
        if (PinyinMatch.match(member.realName, value)) {
          list.push(member);
        }
      }
    } else {
      list.push(...allList);
    }

    setFriendList(list);
  }

  function handleClick(member:IFriendInfo) {
    const index = selectList.findIndex((item) => item.id === member.id);
    if (index !== -1) {
      selectList.splice(index, 1);
    } else {
      selectList.push(member);
    }
    setSelectList([...selectList]);
  }

  function isChecked(member:IFriendInfo) {
    const index = selectList.findIndex((item) => item.id === member.id);
    if (index !== -1) {
      return true;
    }

    return false;
  }

  return (
    <div className={styles['add-member']}>
      <div className={styles['add-member__header']}>
        <i className={`iconfont icon-guanbi ${styles['add-member__header-icon']}`} onClick={() => handCancel()} aria-hidden="true" />
      </div>

      <div className={styles['add-member__container']}>
        <div className={styles['add-member__left']}>
          <div className={styles['add-member__left-search']}>
            <Input placeholder="请输入用户名/账号" size="middle" onChange={(e) => onChange(e)} />
          </div>
          <div className={`scroll ${styles['add-member__left-container']}`}>
            {
              friendList.map(
                (item) => (
                  <div key={item.id} onClick={() => handleClick(item)} aria-hidden="true">
                    <MemberItem
                      info={item}
                      checked={isChecked(item)}
                      isLeft
                      onCloseClick={() => handleClick(item)}
                    />
                  </div>
                ),
              )
            }
          </div>
        </div>

        <div className={styles['add-member__right']}>
          <div className={styles['add-member__right-label']}>
            {`已选择了${selectList.length}个联系人`}
          </div>
          <div className={`scroll ${styles['add-member__right-container']}`}>
            {
              selectList.map(
                (item) => (
                  <MemberItem
                    key={item.id}
                    info={item}
                    isLeft={false}
                    checked
                    onCloseClick={() => handleClick(item)}
                  />
                ),
              )
            }
          </div>

          <div className={styles['add-member__right-footer']}>
            <Button
              className={styles['add-member__right-footer-btn']}
              type="primary"
              size="small"
            >
              确认
            </Button>
            <Button
              className={styles['add-member__right-footer-btn']}
              size="small"
              onClick={() => handCancel()}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
