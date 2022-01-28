import { EEventName } from '@main/modules/mqtt/enum';
import { IMessage } from '@main/interface/msg';
import connect from './connect';

export interface IMsg {
  send(msg:IMessage):void
  onReciveNewMsg(callback:Function):void
}

function send(msg:IMessage) {
  return new Promise((resolve, reject) => {
    connect.sendMsg({
      topic: `${connect.clientPrefix}/${msg.toId}/${msg.charType}/new/${msg.msgId}`,
      opts: {
        qos: 1,
        retain: false,
      },
      message: JSON.stringify({
        ...msg,
        sendMsgStatus: undefined,
      }),
      callback(err) {
        if (err) {
          reject(err);
        } else {
          resolve(new Error(`${msg.msgType}-发送失败:${err}`));
        }
      },
    });
  });
}

function onReciveNewMsg(callback:Function) {
  connect.listen(EEventName.singleMsgNew, callback);
}

export default {
  send,
  onReciveNewMsg,
};
