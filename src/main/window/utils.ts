import mainWin from './main_window';

// 计算相对于主窗口居中的点
export function centerPoint(w:number, h:number):Array<number> {
  if (!mainWin.win) {
    return [0, 0];
  }
  const [mX, mY] = mainWin.win.getPosition();
  const [mW, mH] = mainWin.win.getSize();
  const x = mX + (mW - w) / 2;
  const y = mY + (mH - h) / 2;

  return [Math.floor(x), Math.floor(y)];
}

export default {};
