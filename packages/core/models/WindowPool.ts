import { type BrowserWindow } from 'electron';
import { isString } from 'lodash';

export class WindowPool {
  protected pool = new Map<string, BrowserWindow>();
  protected idMap = new Map<number, string>();

  add(name: string, bw: BrowserWindow) {
    if (this.pool.has(name)) {
      this.remove(name);
    }

    this.pool.set(name, bw);
    this.idMap.set(bw.id, name);

    bw.on('close', () => this.remove(name));
  }

  get(idOrname: string | number) {
    if (!isString(idOrname)) {
      idOrname = this.idMap.get(idOrname) || '';
    }

    return this.pool.get(idOrname);
  }

  getAll() {
    return [...this.pool.values()];
  }

  remove(idOrname: string | number) {
    if (!isString(idOrname)) {
      const id = idOrname;

      idOrname = this.idMap.get(idOrname) || '';
      this.idMap.delete(id);
    } else {
      const bw = this.pool.get(idOrname);

      if (bw) {
        this.idMap.delete(bw.id);
      }
    }

    return this.pool.delete(idOrname);
  }

  clear() {
    this.pool.clear();
    this.idMap.clear();
  }

  getName(id: number) {
    return this.idMap.get(id);
  }

  getAllNames() {
    return [...this.idMap.values()];
  }
}
