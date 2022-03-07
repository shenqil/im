import { Upload } from 'tus-js-client';

import { Readable } from 'stream';
import config from '@main/config';

export class Base64Readable extends Readable {
  private b64Offset:number;

  private b64Buf:Buffer;

  constructor({ options, b64 }:any) {
    super(options);

    this.b64Offset = 0;

    this.b64Buf = Buffer.from(b64, 'base64');
  }

  // eslint-disable-next-line no-underscore-dangle
  _read(size:number) {
    const end = this.b64Offset + size;
    const buf = this.b64Buf.subarray(this.b64Offset, end);

    if (buf.length !== 0) {
      this.push(buf);
    } else {
      this.push(null);
    }

    this.b64Offset = end;
  }

  get b64BufSize() {
    return this.b64Buf.length;
  }
}

export interface IUploadFileInfo{
  name:string
  type:string
  size:number
  stream: Pick<ReadableStreamDefaultReader, 'read'>
}

export interface IFile {
  upload(file:IUploadFileInfo):Promise<string>
}

/**
 * 上传文件
 * */
export async function uploadFile(file:IUploadFileInfo) {
  return new Promise((resolve, reject) => {
    const { fileServer } = config.sysConfig.domain;
    const upload = new Upload(file.stream, {
      endpoint: fileServer,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      chunkSize: 16384,
      uploadSize: file.size,
      onError(error) {
        reject(error);
      },
      onSuccess() {
        resolve(upload.url?.split('files/')?.pop() || '');
      },
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });
}

export default {
  upload: uploadFile,
};
