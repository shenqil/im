import React, { FC, useState } from 'react';
import { Popover } from 'antd';
import emojiData from '@renderer/public/data/emoji.json';
import styles from './index.modules.scss';

export interface IEmojiItem {
  key:string,
  data:string
}
export interface IEmojiContentProps {
  handleEmojiClick:Function
  hideEmoji:Function
}
const EmojiContent:FC<IEmojiContentProps> = function (props) {
  const { handleEmojiClick, hideEmoji } = props;

  function handleClick(item:IEmojiItem) {
    handleEmojiClick(item);
    hideEmoji();
  }
  return (
    <div className={`${styles['emoji-content']} scroll`}>
      <div className={`${styles['emoji-content__inner']}`}>
        {
          emojiData
            .map((emojiItem:IEmojiItem, index) => (
              <div
                key={emojiItem.key}
                tabIndex={index}
                role="button"
                className={styles['emoji-content__item']}
                onClick={() => handleClick(emojiItem)}
                onKeyUp={() => hideEmoji()}
              >
                <img
                  className={styles['emoji-content__item-img']}
                  src={emojiItem.data || ''}
                  alt={emojiItem.key || ''}
                />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export interface IEmojiProps {
  handleEmojiClick:Function
}
const Emoji:FC<IEmojiProps> = function ({ handleEmojiClick }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.emoji}>
      <Popover
        content={(
          <EmojiContent
            handleEmojiClick={handleEmojiClick}
            hideEmoji={() => setVisible(false)}
          />
      )}
        trigger="click"
        visible={visible}
        onVisibleChange={(v) => setVisible(v)}
      >
        <i className={`icon-emoji iconfont ${styles.emoji_i}`} />
      </Popover>
    </div>
  );
};

export default Emoji;
