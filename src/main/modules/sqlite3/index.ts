import ISQ3 from './interface';

const files = (require as any).context('.', false, /\.ts$/);
const modules: any = {};
files.keys().forEach((key: string) => {
  if (!/(index|interface|base)\.ts$/.test(key)) {
    modules[key.replace(/(.\/|.ts)/g, '')] = files(key).default;
  }
});

export default modules as ISQ3;