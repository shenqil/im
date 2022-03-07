import { app } from 'electron';
import path from 'path';
import SQ3 from '../modules/sqlite3';
import { ESQ3CommonKey } from '../modules/sqlite3/interface';

export interface Iconfig {
  filePath:string
}

export interface IConfigSrv {
  get():Promise<Readonly<Iconfig>>,
  update(config:Iconfig):Promise<unknown>
}

class ConfigSrv implements IConfigSrv {
  private config:Iconfig;

  private isCache:Boolean;

  constructor() {
    this.config = {
      filePath: path.join(app.getPath('userData'), 'db'),
    };
    this.isCache = false;
  }

  async get():Promise<Readonly<Iconfig>> {
    if (!this.isCache) {
      const res = await SQ3.common.getData(ESQ3CommonKey.config);
      if (res) {
        this.config = JSON.parse(res) as Iconfig;
        this.isCache = true;
      }
    }

    return Object.freeze(this.config);
  }

  // eslint-disable-next-line class-methods-use-this
  async update(config:Iconfig):Promise<unknown> {
    return SQ3.common.saveData(ESQ3CommonKey.config, JSON.stringify(config));
  }
}

export default new ConfigSrv();
