import IServer from './interface';

const files = (require as any).context('.', false, /\.ts$/);
const modules: any = {};
files.keys().forEach((key: string) => {
  if (/Srv\.ts$/.test(key)) {
    modules[key.replace(/(.\/|.ts)/g, '')] = files(key).default;
  }
});

export default modules as IServer;
