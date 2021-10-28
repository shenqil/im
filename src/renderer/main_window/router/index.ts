import { RouteConfig } from 'react-router-config';
import Msg from '../view/msg/index';
import AddressBook from '../view/addressBook/index';
import SideLayout from '../layout/SideLayout';

const routes:RouteConfig[] = [
  {
    component: SideLayout,
    routes: [
      {
        path: '/',
        name: 'msg',
        exact: true,
        component: Msg, // 消息
      },
      {
        path: '/addressBook',
        name: 'addressBook',
        component: AddressBook, // 通讯录
      },
    ],
  },
];

export default routes;
