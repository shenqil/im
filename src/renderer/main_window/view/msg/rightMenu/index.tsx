import React, { FC, useEffect, useState } from 'react';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import type { IConversationInfo, IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { CloseOutlined } from '@ant-design/icons';
import Avatar from '@renderer/main_window/components/Avatar';
import { Switch, message, Input } from 'antd';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

enum EConversationType {
  single = 'SINGLE',
  group = 'GROUP',
}

interface IMemberItemProps{
  memberInfo:IUserBaseInfo
}
const MemberItem:FC<IMemberItemProps> = function (props) {
  const { memberInfo } = props;
  return (
    <div className={styles['member-item']}>
      <div className={styles['member-item__avatar']}>
        <Avatar url={memberInfo.avatar} />
      </div>

      <div className={styles['member-item__name']}>
        {memberInfo.realName}
      </div>
    </div>
  );
};

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
  const [groupNameEdit, setGroupNameEdit] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (conversationInfo.type === EConversationType.group) {
      const ids = groupInfo?.memberIDs;
      if (ids && ids.length) {
        mainBridge.server.userSrv.getCacheUserInfo(ids)
          .then((list) => {
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

  function handlePlacedTop() {
    const newConversationInfo = { ...conversationInfo };
    newConversationInfo.placedTop = !conversationInfo.placedTop;
    mainBridge.server.conversationSrv.updateConversationInfo(newConversationInfo);
  }

  function handleNoDisturd() {
    const newConversationInfo = { ...conversationInfo };
    newConversationInfo.noDisturd = !conversationInfo.noDisturd;
    mainBridge.server.conversationSrv.updateConversationInfo(newConversationInfo);
  }

  async function handleEditName() {
    if (groupNameEdit) {
      if (groupInfo) {
        const newGroupInfo = { ...groupInfo };
        newGroupInfo.groupName = groupName;
        await mainBridge.server.groupSrv.update(newGroupInfo);
      }

      setGroupNameEdit(false);
    } else {
      setGroupName(groupInfo?.groupName || '');
      setGroupNameEdit(true);
    }
  }

  function hideEdit() {
    setGroupNameEdit(false);
  }

  useEffect(() => {
    window.addEventListener('click', hideEdit);
    return () => {
      window.removeEventListener('click', hideEdit);
    };
  }, []);

  return (
    <div
      className={styles['right-menu']}
      onClick={(e) => {
        e.stopPropagation();
        hideEdit();
      }}
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
            {
              groupNameEdit
                ? (
                  <Input
                    className={styles['right-menu__header-name-input']}
                    value={groupName}
                    maxLength={20}
                    onChange={(e) => setGroupName(e.target.value.trim())}
                    onKeyDown={(e) => {
                      if (e.code === 'Enter') {
                        handleEditName();
                      }
                    }}
                    size="small"
                  />
                )
                : (
                  <div className={styles['right-menu__header-name-text']}>
                    {groupInfo?.groupName || friendInfo?.realName || ''}
                  </div>
                )
            }

            <div className={styles['right-menu__header-name-icon']}>
              <i
                className={`iconfont ${groupNameEdit ? 'icon-ok' : 'icon-bianji'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditName();
                }}
                aria-hidden="true"
              />
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
              {
                memberList.map((item) => <MemberItem key={item.id} memberInfo={item} />)
              }
            </div>
          </div>
        )
      }

        {/* 操作区域 */}
        <div className={styles['right-menu__seting']}>
          {/* 置顶 */}
          <div className={styles['right-menu__seting-item']}>
            <div className={styles['right-menu__seting-item-label']}>
              {conversationInfo.placedTop ? '置顶' : '取消置顶'}
            </div>
            <div className={styles['right-menu__seting-item-switch']}>
              <Switch
                checked={conversationInfo.placedTop}
                onChange={() => handlePlacedTop()}
              />
            </div>
          </div>

          {/* 免打扰 */}
          <div className={styles['right-menu__seting-item']}>
            <div className={styles['right-menu__seting-item-label']}>
              {conversationInfo.noDisturd ? '消息免打扰' : '开启新消息提醒'}
            </div>
            <div className={styles['right-menu__seting-item-switch']}>
              <Switch
                checked={!conversationInfo.noDisturd}
                onChange={() => handleNoDisturd()}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightMenu;
