import { ISQ3Common } from './common';
import { ISQ3Conversation } from './conversation';
import { ISQ3UserInfo } from './userInfo';
import { ISQ3ChartMsg } from './chartMsg';

export * from './common';
export * from './conversation';
export * from './userInfo';
export * from './chartMsg';
export default interface ISQ3{
  common:ISQ3Common,
  conversation:ISQ3Conversation
  userInfo:ISQ3UserInfo
  chartMsg:ISQ3ChartMsg
}
