import React, { LegacyRef, forwardRef } from 'react';
import type { IUserBaseInfo } from '@main/modules/sqlite3/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import './index.scss';

export interface IPopupMenuProps {
  filterMemberList:IUserBaseInfo[],
  memberActionIndex:number,
  setMemberActionIndex:Function,
  onClickGroupMember:Function
}
const PopupMenu = forwardRef((
  {
    filterMemberList,
    memberActionIndex,
    setMemberActionIndex,
    onClickGroupMember,
  }:IPopupMenuProps,
  popupMenuRef:LegacyRef<HTMLDivElement>,
) => (
  <div
    className="input-popup-menu scroll"
    ref={popupMenuRef}
  >
    {
        !!filterMemberList.length && (
          <ul className="input-popup-menu__inner">
            {
              filterMemberList
                .map((member, index) => (
                  <li
                    key={member.id}
                    className={`input-popup-menu__item 
                    ${index === memberActionIndex
                    && 'input-popup-menu__item--active'}`}
                    onMouseOver={() => setMemberActionIndex(index)}
                    onFocus={() => {}}
                    onClick={() => onClickGroupMember(member.realName)}
                    aria-hidden="true"
                  >
                    <span className="input-popup-menu__avatar">
                      <Avatar url={member.avatar} />
                    </span>

                    <span className="input-popup-menu__name">{member.realName}</span>
                  </li>
                ))
            }
          </ul>
        )
      }
  </div>
));

export default PopupMenu;
