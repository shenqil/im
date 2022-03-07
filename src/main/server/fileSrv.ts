/* eslint-disable class-methods-use-this */
import http from '@main/modules/http';
import { Base64Readable } from '@main/modules/http/file';

export interface IFileSrc {
  upload(b64:string):Promise<string>
}

class FileSrv implements IFileSrc {
  async upload(b64:string):Promise<string> {
    const b64Ary = b64.split(',') || [];
    const ary = b64Ary[0].match(/:(.*?);/);
    let mime = '';
    if (ary !== null && ary?.length > 1) {
      // eslint-disable-next-line prefer-destructuring
      mime = ary[1];
    }

    const base64Readable = new Base64Readable({ b64: b64Ary[1] });

    const file = {
      name: Date.now().toString(),
      type: mime,
      size: base64Readable.b64BufSize,
      stream: base64Readable,
    };
    return http.file.upload(file);
  }
}

export default new FileSrv();
