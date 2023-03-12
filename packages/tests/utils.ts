import { resolve as stlResolve } from 'path';

export const resolve = (...paths: string[]) =>
  stlResolve(__dirname, '../..', ...paths);
