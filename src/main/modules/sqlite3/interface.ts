import { ISQ3Common } from './common';
import { ISQ3Conversation } from './conversation';

export * from './common';
export * from './conversation';

export default interface ISQ3{
  common:ISQ3Common,
  conversation:ISQ3Conversation
}
