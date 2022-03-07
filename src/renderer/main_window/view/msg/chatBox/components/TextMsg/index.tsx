import React, { FC } from 'react';
import emojiData from '@renderer/public/data/emoji.json';
import './index.scss';

export interface ITextMsg {
  text:string
}

// 给http 加上下划线
function httpFilter(str:string) {
  let result = str;
  const httpAry = result.match(/https?:\/\/(?:[-\w.]|(?:%[\da-fA-F]{2})|\/|\?|=|&)+/g);
  if (!Array.isArray(httpAry)) {
    return result;
  }
  const indexAry:Array<number> = [];
  httpAry.forEach((element) => {
    const index = result.indexOf(element);
    indexAry.push(index);
    result = result.replace(`${element}`, '[http]');
  });

  function replacepos(text:string, start:number, stop:number, replacetext:string) {
    const mystr = text.substring(0, start) + replacetext + text.substring(stop);
    return mystr;
  }

  let l = 0;
  indexAry.forEach((index, i) => {
    const replacetext = `<a herf="${httpAry[i]}" style="text-decoration:underline;cursor: pointer;color: #3883ec;padding: 1px 0px">${httpAry[i]}</a>`;
    result = replacepos(result, index + l, index + l + 6, replacetext);
    l += replacetext.length - 6;
  });

  return result;
}

// emoji
function emojiFilter(str:string) {
  let result = str;
  result = result.replace(/ /gi, '&nbsp').replace(/</g, '&lt;');
  // eslint-disable-next-line no-useless-escape
  const reg = /\[[^\[\]]*\]/g;
  let arr = result.match(reg);
  if (arr) {
    arr = Array.from(new Set(arr));
    arr.forEach((element) => {
      emojiData.forEach((val) => {
        if (val.key === element) {
          result = result.replace(new RegExp(`\\${element}`, 'g'), `<img src='${val.data}' alt='${val.key}' style="width:25px;">`);
        }
      });
    });
  }

  return result;
}

const TextMsg:FC<ITextMsg> = function ({ text }) {
  function filter() {
    return httpFilter(emojiFilter(text));
  }
  return (
    // eslint-disable-next-line react/no-danger
    <div className="text-msg" dangerouslySetInnerHTML={{ __html: filter() }} />
  );
};

export default TextMsg;
