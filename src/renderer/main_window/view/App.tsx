import React, { useEffect } from 'react';
import {
  HashRouter, Routes, Route, useNavigate,
} from 'react-router-dom';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import {
  selectNavigationActiva,
} from '@renderer/main_window/store/navigation';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { Provider } from 'react-redux';
import Msg from '@renderer/main_window/view/msg';
import AddressBook from '@renderer/main_window/view/addressBook';
import { Spin } from 'antd';
import { store } from '../store';
import SideLayout from '../layout/SideLayout';

const NonePage = function () {
  const navActiva = useAppSelector(selectNavigationActiva);
  const navigate = useNavigate();
  useEffect(() => {
    navigate(navActiva.path);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navActiva]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <Spin size="large" />
    </div>

  );
};

const App = function () {
  useEffect(() => {
    mainBridge.server.connectSrv.mainMenuReady();
  }, []);
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<NonePage />} />
          <Route path="/logged" element={<SideLayout />}>
            <Route path="/logged/msg" element={<Msg />} />
            <Route path="/logged/addressBook" element={<AddressBook />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default App;
