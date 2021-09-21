const files = (import.meta as any).globEager(".ts")
const modules: any = {};

for (const key in files) {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
    if (/_window.ts/.test(key)) {
      modules[key.replace(/_window.ts/, '')] = files[key].default
    }
  }
}

export default modules;
