import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { IFriendInfo } from '@main/modules/mqtt/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import { message } from 'antd';
import styles from './index.scss';

interface IFriendItem {
  friendInfo:IFriendInfo
  isFriend:boolean,
  isRightMenu:boolean
}
const FriendItem = function (props:IFriendItem) {
  const { friendInfo, isFriend, isRightMenu } = props;

  function sendMsg() {
    console.log('发送消息');
  }

  function showBusinessCard(isCursorPoint = true) {
    mainBridge.wins.businessCard.show({
      isCursorPoint,
      friendInfo: {
        ...friendInfo,
        isFriend,
      },
    });
  }

  function delFriend() {
    mainBridge.server.friendSrv.remove(friendInfo.id)
      .then(() => {
        message.success('好友删除成功');
      })
      .catch((err) => {
        message.error(`${err}`);
      });
  }

  function rightClick() {
    mainBridge.menu.rightMenu.show([
      {
        label: '发送消息',
        id: 'sendMsg',
      },
      {
        label: '查看名片',
        id: 'viewBusinessCard',
      },
      {
        type: 'separator',
      },
      {
        label: '删除好友',
        id: 'delFriend',
      },
    ])
      .then((res) => {
        if (!res || !res.id) {
          return;
        }
        switch (res.id) {
          case 'sendMsg':
            sendMsg();
            break;
          case 'viewBusinessCard':
            showBusinessCard(false);
            break;
          case 'delFriend':
            delFriend();
            break;
          default:
            break;
        }
      });
  }

  return (
    <div
      className={styles['friend-item']}
      onClick={() => showBusinessCard()}
      onContextMenu={() => isRightMenu && rightClick()}
      aria-hidden="true"
    >
      <div className={styles['friend-item__avatar']}>
        <Avatar url={friendInfo.avatar} />
      </div>

      <div className={styles['friend-item__info']}>
        <div className={styles['friend-item__info-real-name']}>
          {friendInfo.realName}
        </div>
        <div className={styles['friend-item__info-nick-name']}>
          {friendInfo.userName}
        </div>
      </div>
    </div>
  );
};

export default FriendItem;
