import { Menu, MenuItem, MenuItemConstructorOptions } from 'electron';

export interface IRightMenu {
  show(params:MenuItemConstructorOptions[]):Promise<MenuItemConstructorOptions | undefined>
}

function show(params:MenuItemConstructorOptions[]) {
  return new Promise((resolve) => {
    const menu = new Menu();

    for (const p of params) {
      menu.append(
        new MenuItem({
          ...p,
          click: () => {
            resolve(p);
          },
        }),
      );
    }

    menu.popup({
      callback: () => {
        resolve(undefined);
      },
    });
  });
}

export default {
  show,
};
