import { app } from 'electron';
import path from 'path';
import sqlite3, { Database } from 'sqlite3';
import { dirExists } from '@main/utils/fileUtil';

// -------------------------------- sqlite3 初始化逻辑 -------------------------
/**
 * 初始化sqlite3
 * */
let sqlite3DB:Database;
export async function init() {
  const dbDir = path.join(app.getPath('userData'), 'db');
  await dirExists(dbDir);
  const dbPath = path.join(dbDir, 'db.db');

  await new Promise((resolve, reject) => {
    sqlite3DB = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('');
      }
    });
  });
}

// -------------------------------- sqlite3 初始化逻辑 -------------------------

// -------------------------------- sqlite3 基础公共类 -------------------------
export interface ISQ3Base {
  createTable(tabelName:string, tabelStruct:Array<string>):Promise<unknown>
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
class SQ3Base implements ISQ3Base {
  public db:Database | undefined;

  constructor() {
    this.db = sqlite3DB;
  }

  createTable(tabelName:string, tabelStruct:Array<string>): Promise<unknown> {
    if (!this.db) {
      this.db = sqlite3DB;
    }

    return new Promise((resolve, reject) => {
      if (!tabelName || !tabelStruct) {
        throw new Error(`${tabelName}:表名或表结构不存在`);
      }
      const sqldata = tabelStruct.join(',');
      const sentence = ` create table if not exists ${tabelName} (${sqldata});`;
      this.db?.exec(sentence, (err) => {
        if (err) {
          console.error(tabelStruct);
          reject(new Error(`创建表-${tabelName}:${err}`));
        } else {
          resolve('');
        }
      });
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
    // console.info(`SQL: ${mode} ${sql} ${JSON.stringify(params)}`);

    return new Promise((resolve, reject) => {
      (this.db as any)[mode](sql, params, (err:Error, data:unknown) => {
        if (err) {
          reject(new Error(`SQL: ${mode} ${sql} ${JSON.stringify(params)} - ${err}`));
        }
        resolve(data);
      });
    });
  }
}
// -------------------------------- sqlite3 基础公共类 -------------------------
export default SQ3Base;
