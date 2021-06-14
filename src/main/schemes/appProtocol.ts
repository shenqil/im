import { protocol } from 'electron';
import path from 'path';

const APP_SCHEME_CFG = {
  scheme: 'app',
  privileges:
  {
    secure: true,
    standard: true,
  },
};

function register():void {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6).replace(/.ts$/i, '.built.js');
    console.log(path.normalize(`${__dirname}/${url}`));
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });
}

export default {
  config: APP_SCHEME_CFG,
  register,
};
