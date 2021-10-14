import React, { FC } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

interface IProps extends RouteConfigComponentProps {

}

const SideLayout:FC<IProps> = ({ route }) => (
  <div>
    <h1>SideLayout</h1>
    {route && renderRoutes(route.routes)}
  </div>
);

export default SideLayout;
