import React, { FC } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectConversationSortList, selectActivaId } from '@renderer/main_window/store/conversation';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import { mainBridge } from '@renderer/public/ipcRenderer';
import NoDisturb from './img/no-disturb.png';
import styles from './index.scss';

interface IConversationItemProps {
  conversationInfo:IConversationInfo
}
const ConversationItem:FC<IConversationItemProps> = function (props:IConversationItemProps) {
  const { conversationInfo } = props;
  const activaId = useAppSelector(selectActivaId);

  const formatTime = (time:number) => {
    // 补0
    function zeroize(num:number) {
      return num < 10 ? `0${num}` : num;
    }

    // 拿到当前的时间戳（毫秒) -- 转换为秒
    const currentTime = new Date();
    const currentTimestamp = Math.floor(currentTime.getTime() / 1000);

    // 传进来的时间戳（毫秒)
    const t = new Date(time);
    const oldTimestamp = Math.floor(time / 1000);

    // 年
    const oldY = t.getFullYear();
    // 月
    const oldM = t.getMonth() + 1;
    // 日
    const oldD = t.getDate();
    // 时
    const oldH = t.getHours();
    // 分
    const oldi = t.getMinutes();

    // 相隔多少秒
    const timestampDiff = currentTimestamp - oldTimestamp;

    if (timestampDiff < 60) {
      // 一分钟以内
      return '刚刚';
    }

    if (timestampDiff < 60 * 60) {
      // 一小时以内
      return `${Math.floor(timestampDiff / 60)}分钟前`;
    }

    // 今天的时间
    if (
      oldY === currentTime.getFullYear()
      && oldM === currentTime.getMonth() + 1
      && oldD === currentTime.getDate()
    ) {
      // 10:22
      return `${zeroize(oldH)}:${zeroize(oldi)}`;
    }

    // 剩下的，就是昨天及以前的数据
    return `${oldY}-${zeroize(oldM)}-${zeroize(oldD)}`;
  };

  function handleActiva() {
    mainBridge.server.conversationSrv.setActivaId(conversationInfo.id);
  }

  return (
    <div
      className={`${styles['conversation-item']} ${activaId === conversationInfo.id && styles['conversation-item--activa']}`}
      onClick={() => handleActiva()}
      aria-hidden="true"
    >
      <div className={styles['conversation-item__avatar']}>
        <Avatar url={conversationInfo.avatar} />
      </div>

      <div className={styles['conversation-item__info']}>
        <div className={styles['conversation-item__top']}>
          <div className={styles['conversation-item__name']}>
            <div className={styles['conversation-item__name-text']}>
              {conversationInfo.name}
            </div>
          </div>
          <div className={styles['conversation-item__time']}>
            { formatTime(conversationInfo.lastTime) }
          </div>
        </div>

        <div className={styles['conversation-item__bottom']}>
          <div className={styles['conversation-item__msg']}>
            <div className={styles['conversation-item__msg-text']}>
              msg
            </div>
          </div>
          <div className={styles['conversation-item__icon']}>
            {
              !conversationInfo.noDisturd
              && (
              <img
                className={styles['conversation-item__icon-no']}
                src={NoDisturb}
                alt=""
              />
              )
            }
          </div>
        </div>
      </div>

      {
        conversationInfo.placedTop
        && <div className={styles['conversation-item__place-top']} />
      }
    </div>
  );
};

const Conversation:FC = function () {
  const conversationList = useAppSelector(selectConversationSortList);
  return (
    <div className={`scroll ${styles.conversation}`}>
      {conversationList.map((item) => (
        <div key={item.id} className={styles.conversation__item}>
          <ConversationItem conversationInfo={item} />
        </div>
      ))}
    </div>
  );
};

export default Conversation;
