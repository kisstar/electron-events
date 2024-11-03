import { existsSync, rmSync } from 'fs';
import { build } from 'vite';
import {
  resolve,
  resolveConfig,
  cjsBuildConf,
  esBuildConf
} from './helpers/index.mjs';

const clean = () => {
  existsSync(resolve('dist')) && rmSync(resolve('dist'), { recursive: true });
  existsSync(resolve('dist-electron')) &&
    rmSync(resolve('dist-electron'), { recursive: true });
};
const libraries = [esBuildConf, cjsBuildConf];

clean();
for (const lib of libraries) {
  await build({
    resolve: resolveConfig,
    configFile: false,
    sourcemap: true,
    build: {
      emptyOutDir: false,
      ...lib
    }
  });
}
