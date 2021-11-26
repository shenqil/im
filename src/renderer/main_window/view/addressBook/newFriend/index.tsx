import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';

const NewFriend = function () {
  mainBridge.server.friendSrv.getQuasiFriendList()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
  return (
    <div>
      <h2>NewFriend</h2>
    </div>
  );
};

export default NewFriend;
