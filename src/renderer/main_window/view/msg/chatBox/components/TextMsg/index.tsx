import React, { FC } from 'react';
import styles from './index.scss';

export interface ITextMsg {
  text:string
}

const TextMsg:FC<ITextMsg> = function ({ text }) {
  return (
    <div className={styles['text-msg']}>
      {text}
    </div>
  );
};

export default TextMsg;
