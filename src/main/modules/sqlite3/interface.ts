import { ISQ3Common } from './common';
import { ISQ3Conversation } from './conversation';
import { ISQ3UserInfo } from './userInfo';

export * from './common';
export * from './conversation';
export * from './userInfo';

export default interface ISQ3{
  common:ISQ3Common,
  conversation:ISQ3Conversation
  userInfo:ISQ3UserInfo
}
