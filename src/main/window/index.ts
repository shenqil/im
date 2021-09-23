import IWins from './interface'

const files = (require as any).context('.', false, /_window\.ts$/);
const modules: any = {};
files.keys().forEach((key: string) => {
  modules[key.replace(/(.\/|_window.ts)/g, '')] = files(key).default;
});

export default modules as IWins;
