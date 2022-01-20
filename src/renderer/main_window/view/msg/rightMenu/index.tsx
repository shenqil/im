/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import type { IGroupInfo, IFriendInfo, IUserInfo } from '@main/modules/mqtt/interface';
import type { IConversationInfo, IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { CloseOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Avatar from '@renderer/main_window/components/Avatar';
import {
  Switch, message, Input, Button, Modal, Tag,
} from 'antd';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

enum EConversationType {
  single = 'SINGLE',
  group = 'GROUP',
}

interface IMemberItemProps{
  conversationInfo:IConversationInfo,
  memberInfo:IUserBaseInfo,
  isOwner:boolean,
  isSelf:boolean
}
const MemberItem:FC<IMemberItemProps> = function (props) {
  const {
    memberInfo, isOwner, conversationInfo, isSelf,
  } = props;

  const { confirm } = Modal;

  // 删除成员
  function handleDel() {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确认从群组 "${conversationInfo.name}" 中删除成员: "${memberInfo.realName}" !`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        mainBridge.server.groupSrv
          .delMembers(conversationInfo.id, [{
            name: memberInfo.realName,
            id: memberInfo.id,
          }])
          .then(() => {
            message.success(`群成员: "${memberInfo.realName}" 已删除!`);
          })
          .catch((err) => {
            console.error(err);
            message.success(`群成员: "${memberInfo.realName}" 删除失败!`);
          });
      },
    });
  }

  // 点击头像显示名片
  function handleAvatar() {
    if (isSelf) {
      return;
    }
    mainBridge.wins.modal.showBusinessCard({
      isCursorPoint: true,
      cardId: memberInfo.id,
    });
  }

  return (
    <div className={styles['member-item']}>
      <div
        className={styles['member-item__avatar']}
        onClick={() => handleAvatar()}
        aria-hidden="true"
      >
        <Avatar url={memberInfo.avatar} />
      </div>

      <div className={styles['member-item__name']}>
        {memberInfo.realName}
      </div>

      {/* 群主才能删除人员 */}
      {
        isOwner && !isSelf && (
        <div
          className={styles['member-item__close']}
          onClick={() => handleDel()}
          aria-hidden="true"
        >
          <CloseCircleOutlined />
        </div>
        )
      }

    </div>
  );
};

interface IRightMenuProps {
  userInfo:IUserInfo | undefined,
  conversationInfo:IConversationInfo,
  groupInfo:IGroupInfo | undefined,
  friendInfo:IFriendInfo | undefined,
  handleRightMenu:Function
}
const RightMenu:FC<IRightMenuProps> = function (props) {
  const {
    conversationInfo, groupInfo, friendInfo, handleRightMenu, userInfo,
  } = props;
  const [memberList, setMemberList] = useState<IUserBaseInfo[]>([]);
  const [groupNameEdit, setGroupNameEdit] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const { confirm } = Modal;

  // 置顶
  function handlePlacedTop() {
    const newConversationInfo = { ...conversationInfo };
    newConversationInfo.placedTop = !conversationInfo.placedTop;
    mainBridge.server.conversationSrv.updateConversationInfo(newConversationInfo);
  }

  // 消息免打扰
  function handleNoDisturd() {
    const newConversationInfo = { ...conversationInfo };
    newConversationInfo.noDisturd = !conversationInfo.noDisturd;
    mainBridge.server.conversationSrv.updateConversationInfo(newConversationInfo);
  }

  // 填充群成员信息
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

  // 判断是否是群拥有者
  useEffect(() => {
    if (groupInfo && userInfo?.id === groupInfo?.owner) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [userInfo, groupInfo]);

  // 编辑群名称
  async function handleEditName() {
    if (!isOwner) {
      // 非群拥有者直接退出
      return;
    }

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

  // 取消编辑群名称
  function hideEdit() {
    setGroupNameEdit(false);
  }

  // 添加群成员
  async function handleAddMember() {
    mainBridge.wins.modal.showAddMember(groupInfo);
  }

  // 删除群组
  function removeGroup() {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认解散群组!',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        mainBridge.server.groupSrv.remove(conversationInfo.id)
          .then(() => {
            message.success('群组已解散!');
          })
          .catch((err) => {
            console.error(err);
            message.success('解散群组时，出现异常错误!');
          });
      },
    });
  }

  // 退出群组
  function exitGroup() {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认退出群组!',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        mainBridge.server.groupSrv.exit(conversationInfo.id)
          .then(() => {
            message.success('群组已解散!');
          })
          .catch((err) => {
            console.error(err);
            message.success('退出群组时，出现异常错误!');
          });
      },
    });
  }

  function domClick(ev:MouseEvent) {
    if (window.innerWidth - ev.clientX > 480) {
      handleRightMenu();
    }

    if (!/right-menu__edit-name--no-hide/.test((ev.target as any)?.className)) {
      hideEdit();
    }
  }

  useEffect(() => {
    window.addEventListener('click', domClick);
    return () => {
      window.removeEventListener('click', domClick);
    };
  }, []);

  return (
    <div
      className={styles['right-menu']}
      aria-hidden="true"
    >
      {/* 标题 */}
      <div className={styles['right-menu__title']}>
        <div className={styles['right-menu__title-text']}>
          {conversationInfo.type === EConversationType.group ? '群设置' : '聊天设置'}
        </div>
        <div
          className={styles['right-menu__title-icon']}
          onClick={() => handleRightMenu()}
          aria-hidden="true"
        >
          <CloseOutlined />
        </div>
      </div>

      {/* 内容区 */}
      <div className={`${styles['right-menu__scroll']} scroll`}>
        {/* 头像 */}
        <div className={styles['right-menu__header']}>
          <div className={styles['right-menu__header-avatar']}>
            <Avatar url={conversationInfo.avatar} />
          </div>
          <div className={styles['right-menu__header-name']}>
            {/* 显示名称 */}
            {
             isOwner && groupNameEdit
               ? (
                 <Input
                   className={`${styles['right-menu__header-name-input']} right-menu__edit-name--no-hide`}
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
                   { friendInfo?.realName || groupInfo?.groupName || ''}
                 </div>
               )
            }

            {/* 编辑群名称图标 */}
            {
              isOwner
              && (
                <div className={styles['right-menu__header-name-icon']}>
                  <i
                    className={`iconfont ${groupNameEdit ? 'icon-ok' : 'icon-bianji'} right-menu__edit-name--no-hide`}
                    onClick={() => handleEditName()}
                    aria-hidden="true"
                  />
                </div>
              )
            }

          </div>

          <div className={styles['right-menu__header-tips']}>
            {
              conversationInfo.type === EConversationType.group && !groupInfo
              && <Tag>您已不再当前群组，或者当前群组已解散</Tag>
            }

            {
              conversationInfo.type === EConversationType.single && !friendInfo
              && <Tag>对方已不在您的好友列表中</Tag>
            }
          </div>
        </div>

        {/* 群成员 */}
        {
          groupInfo
          && (
            <div className={styles['right-menu__member']}>
              <div className={styles['right-menu__member-title']}>
                <div className={styles['right-menu__member-title-text']}>
                  群成员
                  {groupInfo.memberIDs.length}
                </div>

                <i
                  className={`iconfont icon-tianjiaqunzu-52 ${styles['right-menu__member-title-add']}`}
                  onClick={() => handleAddMember()}
                  aria-hidden="true"
                />
              </div>

              <div className={styles['right-menu__member-container']}>
                {
                  memberList.map((item) => (
                    <MemberItem
                      key={item.id}
                      isOwner={isOwner}
                      isSelf={item.id === userInfo?.id}
                      conversationInfo={conversationInfo}
                      memberInfo={item}
                    />
                  ))
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

        {/* 删除区域 */}
        <div className={styles['right-menu__bottom']}>
          {
            groupInfo
            && (
              <Button
                className={styles['right-menu__bottom-btn']}
                size="large"
                onClick={() => (isOwner ? removeGroup() : exitGroup())}
              >
                {isOwner ? '解散群组' : '退出群组'}
              </Button>
            )
          }
        </div>
      </div>

    </div>
  );
};

export default RightMenu;
