export enum EEventName {
  friendChange = 'FRIEND_CHANGE',
  groupCreate = 'GROUP_CREATE',
  groupDelete = 'GROUP_DELETE',
  groupUpdate = 'GROUP_UPDATE',
  groupAddMembers = 'GROUP_ADDMEMBERS',
  groupDelMembers = 'GROUP_DELMEMBERS',
  groupExitGroup = 'GROUP_EXITGROUP',
  singleMsgNew = 'SINGLEMSG_NEW',
}

export enum EFriendStatus {
  FriendSubscribe = 1,
  FriendUnsubscribe = 2,
  FriendRefuse = 3,
  FriendIgnore = 4,
  FriendNone = 0,
}

export default EEventName;
