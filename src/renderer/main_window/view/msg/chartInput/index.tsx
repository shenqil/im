import React, {
  FC, useRef, useEffect, useState, useCallback, useLayoutEffect,
} from 'react';
import {
  EMsgType, IFilePayload, IMessage, ECharType,
} from '@main/interface/msg';
import type { IGroupInfo, IFriendInfo, IUserInfo } from '@main/modules/mqtt/interface';
import { EConversationType } from '@main/modules/sqlite3/enum';
import type { IConversationInfo, IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { editContentBackupMap } from '@renderer/main_window/store/conversation';
import { v4 as uuidv4 } from 'uuid';
import { mainBridge } from '@renderer/public/ipcRenderer';
import pinyinMatch from 'pinyin-match';
import BaseInput from './components/BaseInput';
import Tools from './components/Tools';
import PopupMenu from './components/PopupMenu';
import styles from './index.modules.scss';

let lastEditRangeRef:Range | undefined; // 定义最后的光标的引用
export interface EMsgItem {
  type:EMsgType,
  data:string | IFilePayload
}
export interface IChartInputProps{
  userInfo:IUserInfo | undefined,
  conversationInfo:IConversationInfo,
  groupInfo:IGroupInfo | undefined,
  friendInfo:IFriendInfo | undefined,
  memberList:IUserBaseInfo[] | undefined,
}
const ChartInput:FC<IChartInputProps> = function (props) {
  const {
    conversationInfo, groupInfo, friendInfo, userInfo, memberList,
  } = props;
  const curId = useRef('');
  const editPanelRef = useRef<HTMLDivElement>(null); // 定义编辑框的引用
  const popupMenuRef = useRef<HTMLDivElement>(null);
  const [memberActionIndex, setMemberActionIndex] = useState(0);
  const [filterMemberValue, setFilterMemberValue] = useState('');
  const [filterMemberList, setFilterMemberList] = useState<IUserBaseInfo[]>([]);
  const isShowGroupMenu = useRef(false);
  const isComposition = useRef(false);
  const preventEntrySendMsg = useRef(false);

  const coordinate = useRef({
    offsetLeft: 0,
    offsetTop: 0,
    isDelete: false,
  });

  /**
   * 获取光标
   * */
  function focus() {
    // 获取焦点
    editPanelRef.current?.focus();

    // 如果存在上一次的光标,则还原上一次
    if (lastEditRangeRef) {
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(lastEditRangeRef);
    }
  }

  /**
   * 备份光标
   * */
  function backupLastEditRange() {
    // 获取选定对象
    const selection = getSelection();
    // 设置最后光标对象
    lastEditRangeRef = selection?.getRangeAt(0);
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
  const generateMsg = useCallback((msgItem:EMsgItem):IMessage => {
    const charType = conversationInfo.type === EConversationType.single
      ? ECharType.single : ECharType.group;
    return {
      conversationId: conversationInfo.id,
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
  }, [conversationInfo.id, conversationInfo.name,
    conversationInfo.type, userInfo?.id, userInfo?.realName]);

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
  const sendMsg = useCallback(() => {
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

    // 4.清空输入框
    if (editPanelRef.current) {
      editPanelRef.current.innerHTML = '';
      editPanelRef.current.focus();
      backupLastEditRange();
    }
  }, [conversationInfo.type, friendInfo, generateMsg, groupInfo, userInfo]);

  // ------------------------------ 群组 @ 相关逻辑 --------------------------------
  /**
   * 将选中元素移到可视区
   * */
  function moveElementsToVisible() {
    const memberDom = document.querySelector('.input-popup-menu__item--active');
    if (memberDom) {
      memberDom.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  /**
   * 群组@展示悬浮框
   * */
  const showGroupMenu = useCallback((offsetLeft:number, offsetTop:number) => {
    let left = offsetLeft;
    setMemberActionIndex(0); // 将选中元素置为第一个

    if (!editPanelRef.current || !popupMenuRef.current) {
      return;
    }

    if (offsetLeft + 138 > editPanelRef.current.clientWidth) {
      left -= 166;
    }

    popupMenuRef.current.style.display = 'block';
    popupMenuRef.current.style.left = `${left}px`;
    popupMenuRef.current.style.top = `${
      offsetTop - popupMenuRef.current.clientHeight - editPanelRef.current.scrollTop + 20
    }px`;

    moveElementsToVisible();
  }, []);

  /**
   * 关闭群@悬浮框展示
   * */
  function closeGroupMenu() {
    isShowGroupMenu.current = false;
    if (!popupMenuRef.current) {
      return;
    }
    if (popupMenuRef.current.style.display !== 'none') {
      // 1.将悬浮窗隐藏
      popupMenuRef.current.style.display = 'none';
    }
  }

  /**
   * 根据输入框的值，实时改变群组过滤值
   * */
  const changeFilterMemberValue = useCallback((data:string, inputType:string) => {
    // 群@弹窗是否开启
    if (isShowGroupMenu.current) {
      if (data) {
        // 存在值，将值加给过滤值
        setFilterMemberValue(filterMemberValue + data);
      } else if (inputType === 'deleteContentBackward') {
        // 如果是删除按钮
        if (!coordinate.current.isDelete) {
          // 过滤第一次删除图片
          coordinate.current.isDelete = true;
          return;
        }

        // 将对应过滤值也减掉
        if (filterMemberValue.length > 0) {
          setFilterMemberValue(filterMemberValue.substring(
            0,
            filterMemberValue.length - 1,
          ));
        } else {
          // 过滤值被清空，关闭群@弹窗
          closeGroupMenu();
        }
      }
    }
  }, [filterMemberValue]);
  /**
   * 群@点击群成员事件
   * */
  const onClickGroupMember = useCallback((name:string) => {
    // 1.将悬浮窗隐藏
    closeGroupMenu();

    // 2.获取焦点
    focus();

    // 3.删除输入框已经输入的值
    const text = filterMemberValue;
    for (let index = 0; index <= text.length; index++) {
      document.execCommand('Delete');
    }

    // 4.插入全新@的人名
    const div = `@${name}`;
    document.execCommand('insertHTML', false, div);

    // 5.备份光标
    backupLastEditRange();
  }, [filterMemberValue]);
  /**
   * 监听输入框的值
   * */
  const onInput = useCallback((e:Event) => {
    const { data, inputType } = e as InputEvent;
    // 有输入值，组织发送消息
    preventEntrySendMsg.current = true;
    // 开启或重新开启@弹窗
    if (memberList && memberList.length !== 0) {
      if (data === '@') {
        isShowGroupMenu.current = true; // 弹窗开启标志位
        setFilterMemberValue('');// 清空过滤器

        // 创建一个img用来描述光所在位置
        const aiteID = `aite${Date.now()}`;
        const div = `<img id="${aiteID}" style="display: inline-block; width: 0px; height: 0px;">`;
        document.execCommand('insertHTML', false, div);

        // 拿到用于定位的imgdom
        const aiteDom = document.querySelector(`#${aiteID}`);
        coordinate.current.offsetLeft = (aiteDom as HTMLElement).offsetLeft;
        coordinate.current.offsetTop = (aiteDom as HTMLElement).offsetTop;
        coordinate.current.isDelete = false;

        // 定位完成后删除
        document.execCommand('Delete');

        // 备份光标
        backupLastEditRange();

        showGroupMenu(coordinate.current.offsetLeft, coordinate.current.offsetTop);
      } else if (!isComposition.current) {
        // 非中文输入法，实时更新过滤值
        changeFilterMemberValue(data || '', inputType);
      }
    }
  }, [changeFilterMemberValue, memberList, showGroupMenu]);
  /**
   * 中文输入发开始
   * */
  function onCompositionStart() {
    isComposition.current = true;
  }
  /**
   * 中文输入法结束
   * */
  const onCompositionEnd = useCallback((e:Event) => {
    const { data, inputType } = e as InputEvent;
    isComposition.current = false;
    // 将中文更新到过滤值
    changeFilterMemberValue(data || '', inputType);
  }, [changeFilterMemberValue]);

  /**
   * 监听按键按下
   * */
  const onKeyDown = useCallback((e:KeyboardEvent) => {
    // 每次按键按下恢复发送消息
    preventEntrySendMsg.current = false;

    // 按下确认键
    if (e.code === 'Enter') {
      // 没有按下shift,或者当前显示群成员弹窗，都阻止输入
      if (!e.shiftKey || isShowGroupMenu.current) {
        e.preventDefault();
      }
    }

    // 按下 esc
    if (e.code === 'Escape') {
      closeGroupMenu();
    }

    if (isShowGroupMenu.current) {
      if (e.code === 'ArrowUp') {
        if (filterMemberList.length) {
          setMemberActionIndex(
            memberActionIndex === 0
              ? filterMemberList.length - 1
              : memberActionIndex - 1,
          );
        }

        moveElementsToVisible();
        e.preventDefault();
      }

      if (e.code === 'ArrowDown') {
        if (filterMemberList.length) {
          setMemberActionIndex(
            memberActionIndex === filterMemberList.length - 1
              ? 0
              : memberActionIndex + 1,
          );
        }

        moveElementsToVisible();
        e.preventDefault();
      }
    }
  }, [filterMemberList.length, memberActionIndex]);

  /**
   * 监听按键抬起
   * */
  const onKeyUp = useCallback((e:KeyboardEvent) => {
    backupLastEditRange();
    // 抬起确认键
    if (e.code === 'Enter') {
      if (isShowGroupMenu.current && filterMemberList) {
        // 悬浮框打开时，将确认键功能指定为悬浮框的选中

        if (filterMemberList[memberActionIndex]) {
          const { realName } = filterMemberList[memberActionIndex];
          onClickGroupMember(realName);
        } else {
          closeGroupMenu();
        }
      } else if (!preventEntrySendMsg.current) {
        // 不阻止确认键发送消息
        sendMsg();
      }
    }
  }, [memberActionIndex, filterMemberList, onClickGroupMember, sendMsg]);

  /**
   * 根据过滤值过滤出群成员列表
   * */
  useEffect(() => {
    const list = [
      {
        id: 'all',
        avatar: '',
        userName: '',
        realName: '所有成员',
        phone: '',
        email: '',
      },
      ...memberList ?? [],
    ];

    if (!filterMemberValue) {
      setFilterMemberList(list);
      return;
    }

    setFilterMemberList(list.filter(
      (member) => pinyinMatch.match(member.realName, filterMemberValue),
    ));
  }, [memberList, filterMemberValue]);

  useLayoutEffect(() => {
    if (isShowGroupMenu.current) {
      showGroupMenu(coordinate.current.offsetLeft, coordinate.current.offsetTop);
    }
  }, [filterMemberList, showGroupMenu]);

  // ============================== 群组 @ 相关逻辑 ================================
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
      editPanel.addEventListener('input', onInput);
      editPanel.addEventListener('compositionstart', onCompositionStart);
      editPanel.addEventListener('compositionend', onCompositionEnd);
      editPanel.addEventListener('click', backupLastEditRange);
      editPanel.addEventListener('blur', backupLastEditRange);
      editPanel.addEventListener('keyup', onKeyUp);
      editPanel.addEventListener('keydown', onKeyDown);
      window.addEventListener('click', closeGroupMenu);
    } else {
      console.error('editPanel 不存在');
    }

    return () => {
      if (editPanel) {
        editPanel.removeEventListener('input', onInput);
        editPanel.removeEventListener('compositionstart', onCompositionStart);
        editPanel.removeEventListener('compositionend', onCompositionEnd);
        editPanel.removeEventListener('click', backupLastEditRange);
        editPanel.removeEventListener('blur', backupLastEditRange);
        editPanel.removeEventListener('keyup', onKeyUp);
        editPanel.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('click', closeGroupMenu);
      }
    };
  }, [onCompositionEnd, onInput, onKeyDown, onKeyUp]);

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
        <BaseInput
          ref={editPanelRef}
        />
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

      {/* 群组@弹窗 */}
      {memberList && (
      <PopupMenu
        ref={popupMenuRef}
        memberActionIndex={memberActionIndex}
        setMemberActionIndex={setMemberActionIndex}
        filterMemberList={filterMemberList}
        onClickGroupMember={onClickGroupMember}
      />
      )}

    </div>
  );
};

export default ChartInput;
