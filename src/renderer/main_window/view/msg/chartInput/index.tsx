/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useRef, useEffect } from 'react';
import { EMsgType } from '@main/interface/msg';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectActivaConversation } from '@renderer/main_window/store/conversation';
import styles from './index.scss';
import BaseInput from './components/BaseInput';
import Tools from './components/Tools';

export interface EMsgItem {
  type:EMsgType,
  data:string | File
}

// 所有文件映射表
const fileMap :Map<string, Map<string, File> | undefined> = new Map();
const innerMap:Map<string, string> = new Map();

const ChartInput:FC = function () {
  const conversationInfo = useAppSelector(selectActivaConversation);
  const curId = useRef('');
  const editPanelRef = useRef<HTMLDivElement>(null); // 定义编辑框的引用
  const lastEditRangeRef = useRef<Range | undefined>(undefined); // 定义最后的光标的引用
  const fileMapRef = useRef<Map<string, File>>(new Map()); // 定义输入框所有文件内容的映射

  /**
   * 获取光标
   * */
  function focus() {
    // 获取焦点
    editPanelRef.current?.focus();

    // 如果存在上一次的光标,则还原上一次
    if (lastEditRangeRef.current) {
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(lastEditRangeRef.current);
    }
  }

  /**
   * 备份光标
   * */
  function backupLastEditRange() {
    // 获取选定对象
    const selection = getSelection();
    // 设置最后光标对象
    lastEditRangeRef.current = selection?.getRangeAt(0);
  }
  /**
 * 插入表情
 * */
  function insertEmoji(emoji:{ key:string, data:string }) {
    focus();

    const img = `<img src='${emoji.data}' alt=${emoji.key} title=${emoji.key} style="vertical-align:-6px; display: inline-block; width: 25px; height: 25px;">`;
    document.execCommand('insertHTML', false, img);

    backupLastEditRange();
  }

  /**
   * 获取输入框的值
   * */
  function getInputValue() {
    const result:Array<EMsgItem> = [];

    function mergeText(text:string) {
      const lastItem = result.slice(-1)[0];
      if (lastItem?.type === EMsgType.text) {
        // 是文本合并
        lastItem.data += text;
      } else {
        result.push({
          type: EMsgType.text,
          data: text,
        });
      }
    }

    function getChildValue(el:Node) {
      Array.from(el.childNodes).forEach((child) => {
        if (child.nodeName === '#text' || child.nodeName === 'SPAN') {
          // 1.处理文本类型
          const text = child.nodeName === '#text'
            ? `${child.nodeValue}`
            : (child as HTMLSpanElement).innerHTML;

          mergeText(text);
        } else if (child.nodeName === 'IMG') {
          const imgNode = (child as HTMLImageElement);
          // 2.处理图片类型
          const hash = imgNode.getAttribute('hash') || '';
          const data = fileMapRef.current.get(hash);
          switch (imgNode.title) {
            case 'img':
              // 2.1图片
              if (data) {
                result.push({
                  type: EMsgType.img,
                  data,
                });
              }
              break;
            case 'file':
              // 2.2文件
              if (data) {
                result.push({
                  type: EMsgType.file,
                  data,
                });
              }
              break;
            default:
              // 2.3 emoji
              mergeText(`${imgNode.alt}`);
              break;
          }
        } else if (child.nodeName === 'DIV') {
          const lastItem = result.slice(-1)[0];
          if (lastItem?.type === EMsgType.text) {
            // 最后一个元素是文本,后面补换行
            lastItem.data += '\n';
          }

          // 递归
          getChildValue(child);
        }
      });
    }

    if (editPanelRef.current) {
      getChildValue(editPanelRef.current);
    }

    return result;
  }

  /**
   * 发送消息
   * */
  function sendMsg() {
    const res = getInputValue();
    console.log(res, 'sendMsg');
  }

  /**
   * 监听会话发生变化
   * */
  useEffect(() => {
    const editPanel = editPanelRef.current;
    if (!conversationInfo || !editPanel) {
      return;
    }

    if (curId.current !== conversationInfo.id) {
      // 存在之前的id,备份
      if (curId.current) {
        fileMap.set(curId.current, fileMapRef.current);
        innerMap.set(curId.current, editPanel.innerHTML);
      }

      // 清空并获取焦点
      editPanel.innerHTML = '';
      editPanelRef.current?.focus();

      // 拿到最新值
      curId.current = conversationInfo.id;
      fileMapRef.current = fileMap.get(curId.current) || new Map();
      const innerHTML = innerMap.get(curId.current) || '';
      if (innerHTML) {
        document.execCommand('insertHTML', false, innerHTML);
      }

      lastEditRangeRef.current = getSelection()?.getRangeAt(0);
    }
  }, [conversationInfo]);

  /**
   * 初始化
   * */
  useEffect(() => {
    // 订阅事件
    const editPanel = editPanelRef.current;
    if (editPanel) {
      editPanel.addEventListener('click', backupLastEditRange);
      editPanel.addEventListener('blur', backupLastEditRange);
    } else {
      console.error('editPanel 不存在');
    }

    return () => {
      if (editPanel) {
        editPanel.removeEventListener('click', backupLastEditRange);
        editPanel.removeEventListener('blur', backupLastEditRange);

        fileMap.set(curId.current, fileMapRef.current);
        innerMap.set(curId.current, editPanel.innerHTML);
      }
    };
  }, []);

  return (
    <div className={styles['chart-input']}>
      {/* 顶部工具栏 */}
      <div className={styles['chart-input__tools']}>
        <Tools
          insertEmoji={(item:any) => insertEmoji(item)}
        />
      </div>

      {/* 输入框内容区 */}
      <div className={styles['chart-input__base']}>
        <BaseInput ref={editPanelRef} />
      </div>

      {/* 底部发送 */}
      <div className={styles['chart-input__bottom']}>
        <div
          className={styles['chart-input__bottom-btn']}
          onClick={() => sendMsg()}
          aria-hidden="true"
        >
          发送
        </div>
      </div>
    </div>
  );
};

export default ChartInput;
