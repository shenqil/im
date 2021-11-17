import { RouteConfig } from 'react-router-config';
import msg from '../view/msg';
import addressBook from '../view/addressBook';
import SideLayout from '../layout/SideLayout';

const routes:RouteConfig[] = [
  {
    component: SideLayout,
    routes: [
      {
        path: '/',
        name: 'msg',
        exact: true,
        component: msg, // 消息
      },
      {
        path: '/addressBook',
        name: 'addressBook',
        component: addressBook, // 通讯录
      },
    ],
  },
];

export default routes;
