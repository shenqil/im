/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useRef, useEffect } from 'react';
import {
  EMsgType, IFilePayload, IMessage, ECharType,
} from '@main/interface/msg';
import type { IGroupInfo, IFriendInfo, IUserInfo } from '@main/modules/mqtt/interface';
import { EConversationType, IConversationInfo } from '@main/modules/sqlite3/interface';
import { editContentBackupMap } from '@renderer/main_window/store/conversation';
import { v4 as uuidv4 } from 'uuid';
import { mainBridge } from '@src/renderer/public/ipcRenderer';
import BaseInput from './components/BaseInput';
import Tools from './components/Tools';
import styles from './index.scss';

export interface EMsgItem {
  type:EMsgType,
  data:string | IFilePayload
}
export interface IChartInputProps{
  userInfo:IUserInfo | undefined,
  conversationInfo:IConversationInfo,
  groupInfo:IGroupInfo | undefined,
  friendInfo:IFriendInfo | undefined,
}
const ChartInput:FC<IChartInputProps> = function (props) {
  const {
    conversationInfo, groupInfo, friendInfo, userInfo,
  } = props;
  const curId = useRef('');
  const editPanelRef = useRef<HTMLDivElement>(null); // 定义编辑框的引用
  const lastEditRangeRef = useRef<Range | undefined>(undefined); // 定义最后的光标的引用

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
   * 构建一个基础消息结构
   * */
  function generateMsg(msgItem:EMsgItem):IMessage {
    const charType = conversationInfo.type === EConversationType.single
      ? ECharType.single : ECharType.group;
    return {
      charType,
      msgType: msgItem.type,
      msgTime: Date.now(),
      msgId: uuidv4(undefined),
      formId: userInfo?.id || '',
      formName: userInfo?.realName || '',
      toId: conversationInfo.id,
      toName: conversationInfo.name,
      payload: msgItem.data,
    };
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
          const payload = imgNode.getAttribute('payload') || '';

          switch (imgNode.title) {
            case 'img':
              // 2.1图片
              if (payload) {
                try {
                  result.push({
                    type: EMsgType.img,
                    data: JSON.parse(payload),
                  });
                } catch (error) {
                  console.error(error);
                }
              }
              break;
            case 'file':
              // 2.2文件
              if (payload) {
                try {
                  result.push({
                    type: EMsgType.file,
                    data: JSON.parse(payload),
                  });
                } catch (error) {
                  console.error(error);
                }
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
    // 1.校验信息合法
    if (!userInfo) {
      throw new Error('用户信息不存在');
    }
    if (conversationInfo.type === EConversationType.single) {
      if (!friendInfo) {
        throw new Error('对方非好友');
      }
    }
    if (conversationInfo.type === EConversationType.group) {
      if (!groupInfo) {
        throw new Error('你不在群组，或群组已解散');
      }
    }

    // 2.拿到数据框的内容
    const res = getInputValue();

    // 3.发送
    res.forEach((item) => mainBridge.server.msgSrv.sendMsg(generateMsg(item)));
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
        editContentBackupMap.set(curId.current, editPanel.innerHTML);
      }

      // 清空并获取焦点
      editPanel.innerHTML = '';
      editPanelRef.current?.focus();

      // 更新
      curId.current = conversationInfo.id;
      const innerHTML = editContentBackupMap.get(curId.current) || '';
      if (innerHTML) {
        document.execCommand('insertHTML', false, innerHTML);
      }

      backupLastEditRange();
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
