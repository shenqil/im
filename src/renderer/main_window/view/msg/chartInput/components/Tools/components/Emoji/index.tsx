import React, { FC, useState } from 'react';
import { Popover } from 'antd';
import emojiData from '@renderer/public/data/emoji.json';
import styles from './index.scss';

const EmojiContent:FC = function () {
  return (
    <div className={`${styles['emoji-content']} scroll`}>
      <div className={`${styles['emoji-content__inner']}`}>
        {
          emojiData
            .map((emojiItem:any, index) => (
              <img
                key={emojiItem.key || index}
                className={styles['emoji-content__item']}
                src={emojiItem.data || ''}
                alt={emojiItem.key || ''}
              />
            ))
        }
      </div>
    </div>
  );
};

const Emoji:FC = function () {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.emoji}>
      <Popover
        content={<EmojiContent />}
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
