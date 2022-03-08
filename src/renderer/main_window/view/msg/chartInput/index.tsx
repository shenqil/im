import React, {
  FC, useRef, useMemo, useCallback, useEffect,
} from 'react';
import {
  EMsgType, IFilePayload, IMessage, ECharType,
} from '@main/interface/msg';
import type { IGroupInfo, IFriendInfo, IUserInfo } from '@main/modules/mqtt/interface';
import type { IConversationInfo, IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectFileServer } from '@renderer/main_window/store/config';
import { EConversationType } from '@main/modules/sqlite3/enum';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { v4 as uuidv4 } from 'uuid';
import ImInput, { IIMRef } from '@shen9401/react-im-input';
import defaultImg from '@renderer/public/img/logo.png';
import { editContentBackupMap } from '@renderer/main_window/store/conversation';
import Tools from './components/Tools';
import styles from './index.modules.scss';

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

  const imInputRef = useRef<IIMRef>(null);
  const fileServer = useAppSelector(selectFileServer);

  const members = useMemo(() => {
    if (!memberList || conversationInfo.type === EConversationType.single) {
      return [];
    }
    return [
      {
        id: 'all',
        name: '所有成员',
        avatar: defaultImg,
      },
      ...memberList
        .filter((item) => item.id !== userInfo?.id)
        .map((item) => ({
          id: item.id,
          name: item.realName,
          avatar: `${fileServer}${item.avatar}`,
        })),
    ];
  }, [memberList, userInfo, fileServer, conversationInfo]);

  /**
   * 插入Emoji
   * */
  function insertEmoji(item:{ key:string, data:string }) {
    imInputRef.current?.insertEmoji(item);
  }

  /**
   * 构建一个基础消息结构
   * */
  const generateMsg = useCallback(
    (msgItem:EMsgItem):IMessage => {
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
    },
    [
      conversationInfo.id,
      conversationInfo.name,
      conversationInfo.type,
      friendInfo, groupInfo,
      userInfo,
    ],
  );

  /**
   * 发送消息
   * */
  function sendMsg(list:EMsgItem[]) {
    list.forEach((msgItem) => mainBridge.server.msgSrv.sendMsg(generateMsg(msgItem)));
  }

  /**
   * 备份,还原输入框内容
   * */
  useEffect(() => {
    // eslint-disable-next-line prefer-destructuring
    const id = conversationInfo.id;
    const { setInnerHTML, getInnerHTML } = imInputRef.current;

    if (id && setInnerHTML) {
      const text = editContentBackupMap.get(id);
      setInnerHTML(text || '');
    }

    return () => {
      if (id && getInnerHTML) {
        editContentBackupMap.set(id, getInnerHTML());
      }
    };
  }, [conversationInfo.id]);

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
        <ImInput
          onRef={imInputRef}
          memberList={members}
          handleSend={(list:any) => sendMsg(list)}
        />
      </div>

      {/* 底部发送 */}
      <div className={styles['chart-input__bottom']}>
        <div
          className={styles['chart-input__bottom-btn']}
          onClick={() => imInputRef.current?.sendMsg()}
          aria-hidden="true"
        >
          发送
        </div>
      </div>
    </div>
  );
};

export default ChartInput;
