import React, { FC } from 'react';
import styles from './index.scss';

const Conversation:FC = function () {
  return (
    <div className={`scroll ${styles.conversation}`}>
      Conversation
    </div>
  );
};

export default Conversation;
