import React, { FC } from 'react';
import styles from './index.modules.scss';
import Emoji from './components/Emoji';

export interface IToolsProps {
  insertEmoji:Function
}
const Tools:FC<IToolsProps> = function (props) {
  const { insertEmoji } = props;
  return (
    <div className={styles.tools}>
      <Emoji handleEmojiClick={insertEmoji} />
    </div>
  );
};

export default Tools;
