import React, { ChangeEvent, useState, useEffect } from 'react';
import { Input, Radio, Button } from 'antd';
import { mainBridge, mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import defaultImg from '@renderer/public/img/avatar.png';
import type { IFriendInfo, IGroupInfo, IUserInfo } from '@main/modules/mqtt/interface';
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
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();
  const [disable, setDisable] = useState<boolean>(false);
  const [groupInfo, setGroupInfo] = useState<IGroupInfo | undefined>(undefined);

  useEffect(() => {
    mainBridge.wins.modal.getGroupInfo()
      .then((res) => {
        setGroupInfo(res);
        if (res) {
          mainBridge.server.userSrv.getCacheUserInfo(res.memberIDs)
            .then((list) => {
              setSelectList(list);
            });
        }
      });

    mainBridge.server.friendSrv.getMyFriendList()
      .then((res) => {
        setAllList(res);
        setFriendList(res);
      })
      .catch((err) => {
        mainEvent.emit(EMainEventKey.UnifiedPrompt, `${err}`);
      });

    mainBridge.server.userSrv.getUserInfo()
      .then((res) => {
        setUserInfo(res);
      })
      .catch((err) => {
        mainEvent.emit(EMainEventKey.UnifiedPrompt, `${err}`);
      });
  }, []);

  useEffect(() => {
    if (selectList.length === 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [selectList]);

  function getGroupName() {
    const nameAry = selectList.map((item) => item.realName).splice(0, 3);
    nameAry.unshift(userInfo?.realName || '');
    return nameAry.join(',');
  }

  function createImage(id:string):Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      try {
        img.src = `${window.domainConfig.fileServer}${id}`;
        img.onload = function () {
          resolve(img);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  function syntImages(ids:string[]):Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      Promise.all(ids.map((id) => createImage(id))).then((res) => {
        if (res.length === 2) {
          ctx?.drawImage(res[0], 0, 0, 60, 120);
          ctx?.drawImage(res[1], 60, 0, 60, 120);
        } else if (res.length === 3) {
          ctx?.drawImage(res[0], 0, 0, 60, 120);
          ctx?.drawImage(res[1], 60, 0, 60, 60);
          ctx?.drawImage(res[2], 60, 60, 60, 60);
        } else {
          ctx?.drawImage(res[0], 0, 0, 60, 60);
          ctx?.drawImage(res[1], 60, 0, 60, 60);
          ctx?.drawImage(res[2], 0, 60, 60, 60);
          ctx?.drawImage(res[3], 60, 60, 60, 60);
        }

        resolve(canvas.toDataURL('image/jpeg', 0.6));
      }).catch((error) => {
        reject(error);
      });
    });
  }

  async function uploadImg():Promise<string> {
    const ids = selectList.map((item) => item.avatar);
    ids.unshift(userInfo?.avatar || '');
    const b64 = await syntImages(ids);

    return mainBridge.server.fileSrv.upload(b64);
  }

  function getMemberIDs() {
    const idAry = selectList.map((item) => item.id);
    idAry.unshift(userInfo?.id || '');
    return idAry;
  }

  async function handOk() {
    try {
      if (!groupInfo) {
        // 创建
        const avatar = await uploadImg();
        const param:IGroupInfo = {
          id: Date.now().toString(),
          groupName: getGroupName(),
          brief: '',
          avatar,
          owner: userInfo?.id || '',
          creator: userInfo?.id || '',
          memberIDs: getMemberIDs(),
        };
        mainBridge.server.groupSrv.create(param);
      } else {
        // 更新
        groupInfo.memberIDs = getMemberIDs();
        mainBridge.server.groupSrv.update(groupInfo);
      }
    } catch (error) {
      console.error(error);
      mainEvent.emit(EMainEventKey.UnifiedPrompt, { type: 'error', msg: '创建失败' });
    }

    mainEvent.emit(EMainEventKey.UnifiedPrompt, { type: 'success', msg: '群组创建成功' });

    mainBridge.wins.modal.hidden();
  }

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
              onClick={() => handOk()}
              disabled={disable}
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
