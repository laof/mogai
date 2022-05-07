export const base = 'https://laof.github.io/mogai';
export const server = 'https://laof.github.io/mogai.json';

export function files(path: string = base, data: any[] = [], arr: any[] = []) {
  for (let index = 0; index < data.length; index++) {
    const obj: any = data[index];
    const oc: any[] = obj.children;
    if (!Array.isArray(oc)) {
      obj.link = `${path}/${obj.name}`;
      obj.file = obj.link.replace(base + '/', '');
      arr.push(obj);
    } else if (oc.length) {
      files(`${path}/${obj.name}`, oc, arr);
    }
  }
  return arr;
}

export function save(text: string, filename: string) {
  const fileReader = new FileReader();
  const b = new Blob([text], { type: 'application/javascript' });
  fileReader.readAsDataURL(b);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
