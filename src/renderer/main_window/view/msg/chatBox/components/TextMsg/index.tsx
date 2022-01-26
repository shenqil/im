import React, { FC } from 'react';
import './index.scss';

export interface ITextMsg {
  text:string
}

const TextMsg:FC<ITextMsg> = function ({ text }) {
  return (
    <div className="text-msg">
      {text}
    </div>
  );
};

export default TextMsg;
