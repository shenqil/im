import React, { useEffect } from 'react';
import {
  HashRouter, Routes, Route, Outlet, useNavigate,
} from 'react-router-dom';
import { mainEvent, EMainEventKey, mainBridge } from '@renderer/public/ipcRenderer';
import AddFriend from './addFriend';
import BusinessCard from './businessCard';

const Layout = function () {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('init');
    mainEvent.on(EMainEventKey.ModalRouteChange, (routeName:string) => {
      navigate(routeName);
      mainBridge.wins.modal.win?.show();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Outlet />
  );
};

const App = function () {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div />} />
          <Route path="/addFriend" element={<AddFriend />} />
          <Route path="/businessCard" element={<BusinessCard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
