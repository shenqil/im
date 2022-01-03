import React, { FC, useEffect, useState } from 'react';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import type { IConversationInfo, IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { CloseOutlined } from '@ant-design/icons';
import Avatar from '@renderer/main_window/components/Avatar';
import { Switch, message } from 'antd';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

enum EConversationType {
  single = 'SINGLE',
  group = 'GROUP',
}

interface IRightMenuProps {
  conversationInfo:IConversationInfo,
  groupInfo:IGroupInfo | undefined,
  friendInfo:IFriendInfo | undefined,
  handleRightMenu:Function
}
const RightMenu:FC<IRightMenuProps> = function (props) {
  const {
    conversationInfo, groupInfo, friendInfo, handleRightMenu,
  } = props;
  const [memberList, setMemberList] = useState<IUserBaseInfo[]>([]);

  useEffect(() => {
    if (conversationInfo.type === EConversationType.group) {
      const ids = groupInfo?.memberIDs;
      if (ids && ids.length) {
        mainBridge.server.userSrv.getCacheUserInfo(ids)
          .then((list) => {
            console.log(list, 'list');
            setMemberList(list);
          })
          .catch((err) => {
            console.error(err);
            message.error('群成员信息获取失败!');
          });
      }
    } else {
      setMemberList([]);
    }
  }, [conversationInfo, groupInfo]);
  console.log(groupInfo, friendInfo, conversationInfo, 'props');
  return (
    <div
      className={styles['right-menu']}
      onClick={(e) => e.stopPropagation()}
      aria-hidden="true"
    >
      {/* 标题 */}
      <div className={styles['right-menu__title']}>
        <div className={styles['right-menu__title-text']}>
          {groupInfo ? '群设置' : '聊天设置'}
        </div>
        <div
          className={styles['right-menu__title-icon']}
          onClick={() => handleRightMenu()}
          aria-hidden="true"
        >
          <CloseOutlined />
        </div>
      </div>

      <div className={`${styles['right-menu__scroll']} scroll`}>
        {/* 头像 */}
        <div className={styles['right-menu__header']}>
          <div className={styles['right-menu__header-avatar']}>
            <Avatar url={groupInfo?.avatar || friendInfo?.avatar || ''} />
          </div>
          <div className={styles['right-menu__header-name']}>
            <div className={styles['right-menu__header-name-text']}>
              {groupInfo?.groupName || friendInfo?.realName || ''}
            </div>
          </div>
        </div>

        {/* 群成员 */}
        {
        groupInfo && (
          <div className={styles['right-menu__member']}>
            <div className={styles['right-menu__member-title']}>
              <div className={styles['right-menu__member-title-text']}>
                群成员
                {groupInfo.memberIDs.length}
              </div>

              <i
                className={`iconfont icon-tianjiaqunzu-52 ${styles['right-menu__member-title-add']}`}
                aria-hidden="true"
              />
            </div>

            <div className={styles['right-menu__member-container']}>
              {JSON.stringify(memberList)}
            </div>
          </div>
        )
      }

        {/* 操作区域 */}

        <div className={styles['right-menu__seting']}>

          <div className={styles['right-menu__seting-item']}>
            <div className={styles['right-menu__seting-item-label']}>
              label
            </div>
            <div className={styles['right-menu__seting-item-switch']}>
              <Switch defaultChecked onChange={() => console.log(111)} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightMenu;
