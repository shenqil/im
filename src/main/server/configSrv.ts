import { app } from 'electron';
import path from 'path';
import SQ3 from '../modules/sqlite3';
import { ESQ3CommonKey } from '../modules/sqlite3/interface';

export interface Iconfig {
  filePath:string
}

export interface IConfigSrv {
  get():Iconfig,
  update(config:Iconfig):Promise<unknown>
}

class ConfigSrv implements IConfigSrv {
  private config:Iconfig;

  constructor() {
    this.config = {
      filePath: path.join(app.getPath('userData'), 'db'),
    };

    SQ3.common.getData(ESQ3CommonKey.config)
      .then((res) => {
        if (res) {
          this.config = JSON.parse(res) as Iconfig;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  get():Iconfig {
    return Object.freeze(this.config);
  }

  // eslint-disable-next-line class-methods-use-this
  async update(config:Iconfig):Promise<unknown> {
    return SQ3.common.saveData(ESQ3CommonKey.config, JSON.stringify(config));
  }
}

export default new ConfigSrv();
