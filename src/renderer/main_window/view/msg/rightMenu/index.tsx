import React, { FC } from 'react';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import { CloseOutlined } from '@ant-design/icons';
import Avatar from '@renderer/main_window/components/Avatar';
import { Switch } from 'antd';
import styles from './index.scss';

interface IRightMenuProps {
  groupInfo:IGroupInfo | undefined,
  friendInfo:IFriendInfo | undefined,
  handleRightMenu:Function
}
const RightMenu:FC<IRightMenuProps> = function (props) {
  const { groupInfo, friendInfo, handleRightMenu } = props;
  console.log(groupInfo, friendInfo, 'props');
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

              111
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
