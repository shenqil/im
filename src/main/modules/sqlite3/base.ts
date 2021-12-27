import { app } from 'electron';
import path from 'path';
import sqlite3, { Database } from 'sqlite3';
import { dirExists } from '../../utils/fileUtil';

// -------------------------------- sqlite3 初始化逻辑 -------------------------
/**
 * 初始化sqlite3
 * */
let sqlite3DB:Database;
let sqlite3Status:any = 'pendding';
const depMap:Array<any> = [];
async function initSqlite3() {
  const dbDir = path.join(app.getPath('userData'), 'db');
  await dirExists(dbDir);
  const dbPath = path.join(dbDir, 'db.db');

  await new Promise((resolve, reject) => {
    sqlite3DB = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(sqlite3Status);
      }
    });
  });
}

initSqlite3()
  .then(() => {
    sqlite3Status = 'success';
    depMap.forEach(([resolve]) => resolve(sqlite3DB));
  })
  .catch((err) => {
    sqlite3Status = err;
    depMap.forEach(([,rejetc]) => rejetc(err));
    console.error(err);
  });

function awaitSqlite3Init():Promise<Database> {
  return new Promise((resolve, rejetc) => {
    switch (sqlite3Status) {
      case 'pendding':
        depMap.push([resolve, rejetc]);
        break;

      case 'success':
        resolve(sqlite3DB);
        break;

      default:
        rejetc(sqlite3Status);
        break;
    }
  });
}

// -------------------------------- sqlite3 初始化逻辑 -------------------------

// -------------------------------- sqlite3 基础公共类 -------------------------
export interface ISQ3Base {

}

export enum ESQ3Mode {
  all = 'all',
  run = 'run',
  get = 'get',
  each = 'each',
}

/**
 * 基础类
 * */
class SQ3Base {
  public db:Database | undefined;

  private depCreateTabelMap:Array<any>;

  private createTabelStatus:string | Error;

  constructor() {
    this.depCreateTabelMap = [];
    this.createTabelStatus = '';
    awaitSqlite3Init()
      .then((db) => {
        this.db = db;
      });
  }

  /**
     * 创建表
     * @param sentence    CREATE TABLE 语句
     * @used
     * let sentence = `
     * create table if not exists ${this.tableName}(
     * begin_time varchar(255),
     * create_time varchar(255),
     * end_time varchar(255),
     * play_id varchar(255),
     * postion_id int(50),
     * status int(50),
     * task_id int(50)
     * );`;
     * this.createTable(sentence);
    */
  async createTable(tablename: string, param: Array<string>) {
    if (this.createTabelStatus === 'success') {
      this.depCreateTabelMap.forEach(([r]) => r(''));
      this.depCreateTabelMap = [];
      return;
    }
    this.createTabelStatus = 'pendding';
    await awaitSqlite3Init();
    const sqldata = param.join(',');
    const sentence = ` create table if not exists ${tablename} (${sqldata});`;
    await new Promise((resolve, reject) => {
      this.db?.exec(sentence, (err) => {
        if (err) {
          this.createTabelStatus = err;
          this.depCreateTabelMap.forEach(([,r]) => r(err));
          reject(err);
        } else {
          this.createTabelStatus = 'success';
          this.depCreateTabelMap.forEach(([r]) => r(''));
          resolve('');
        }

        this.depCreateTabelMap = [];
      });
    });
  }

  private awaitCreateTable() {
    return new Promise((resolve, reject) => {
      if (this.createTabelStatus === 'success') {
        resolve('');
        return;
      }

      if (typeof this.createTabelStatus !== 'string') {
        reject(this.createTabelStatus);
        return;
      }

      this.depCreateTabelMap.push([resolve, reject]);
    });
  }

  /**
     * 执行 增  删  改  查(单个数据查询或者多个数据查询)
     * @param sql    sql语句
     * @param param     参数(可以是数组或者数字或者字符串,根据sql语句来定)
     * @param mode    执行模式, 默认run,执行sql,如果查询的话,则使用get(单个)all(多个)
     * @returns {Promise}
     * @used
     * 增 : this.sql(`insert into ${this.tableName} (begin_time, status) values(?, ?)`,
     * [obj.begin_time, obj.status_value);

     * 删 : this.sql(`delete from ${this.tableName} where id = ?`, id);

     * 改 : this.sql(`update ${this.tableName} set begin_time = ?, status = ? where postion_id = ?`,
     * [begin_timeValue, statusValue, postion_idValue]);

     * 查 : this.sql(`select * from ${this.tableName} where id = ?`, id, 'get/all');
     */
  async sql(sql: string, params: any, mode: ESQ3Mode = ESQ3Mode.all): Promise<unknown> {
    await awaitSqlite3Init();
    await this.awaitCreateTable();

    // console.info(`SQL: ${mode} ${sql} ${JSON.stringify(params)}`);

    return new Promise((resolve, reject) => {
      (this.db as any)[mode](sql, params, (err:Error, data:unknown) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
// -------------------------------- sqlite3 基础公共类 -------------------------
export default SQ3Base;
