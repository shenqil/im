export enum EMainEventKey {
  appQuit = 'APP_QUIT', // 整个app 退出
  loginStatus = 'LOGIN_STATUS', // 登录状态
  UserInfoChange = 'USER_INFO_CHANGE', // 当前用户信息发生变化

  RouteChange = 'ROUTE_CHANGE',
  ModalRouteChange = 'MODAL_ROUTE_CHANGE',
  UnifiedPrompt = 'UNIFIED_PROMPT',

  MyFriendChange = 'MY_FRIEND_CHANGE',
  QuasiFriendChange = 'QUASI_FRIEND_CHANGE',
  MyGroupChange = 'MY_GROUP_CHANGE',
  ConversationChange = 'CONVERSATION_CHANGE',
  ConversationaAtivaIdChange = 'CONVERSATIONA_ATIVA_ID_CHANGE',
  ConversationaRemove = 'CONVERSATIONA_REMOVE',

  MsgInsert = 'MSG_INSERT',
  MsgUpdate = 'MSG_UPDATE',
  MsgNotifica = 'MSG_NOTIFICA',
}

export default EMainEventKey;
