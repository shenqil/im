import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Msg from '@renderer/main_window/view/msg';
import AddressBook from '@renderer/main_window/view/addressBook';
import { store } from '../store';
import SideLayout from '../layout/SideLayout';

const App = function () {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route element={<SideLayout />}>
            <Route path="/" element={<Msg />} />
            <Route path="/addressBook" element={<AddressBook />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default App;
