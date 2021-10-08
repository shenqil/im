import IMainBridge from '../../../main/ipcMain/interface';

export const mainBridge = (window as any).mainBridge as IMainBridge;

export default IMainBridge;
