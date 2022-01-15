import { EEventName } from '@main/modules/mqtt/enum';
import { IMessage, ECharType } from '@main/interface/msg';
import connect from './connect';

export interface ISingleMsg {
  send(msg:IMessage):void
  onReciveNewMsg(callback:Function):void
}

function send(msg:IMessage) {
  return new Promise((resolve, reject) => {
    if (msg.charType !== ECharType.single) {
      reject(Error(`消息类型错误: ${msg.charType}!==${ECharType.single}`));
      return;
    }
    connect.sendMsg({
      topic: `${connect.clientPrefix}/${msg.toId}/singleMsg/new/${msg.msgId}`,
      opts: {
        qos: 1,
        retain: true,
      },
      message: JSON.stringify(msg),
      callback(err) {
        if (err) {
          reject(err);
        } else {
          resolve('');
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
