import { require, resolve } from './utils.mjs';

const pkg = require('package.json');

const notSupportEsModules = ['lodash-es'];

export const resolveConfig = {
  alias: {
    '@core': resolve('packages/core'),
    '@demo': resolve('packages/demo'),
    lodash: 'lodash-es'
  }
};

export const cjsBuildConf = {
  rollupOptions: {
    external: ['electron', ...Object.keys(pkg.dependencies || {})].filter(
      item => !notSupportEsModules.includes(item)
    )
  },
  lib: {
    entry: {
      index: 'packages/core/index.ts',
      main: 'packages/core/main.ts',
      renderer: 'packages/core/renderer.ts'
    },
    formats: ['cjs']
  },
  outDir: 'dist-electron',
  minify: false
};

export const esBuildConf = {
  rollupOptions: {
    external: ['electron', ...Object.keys(pkg.dependencies || {})]
  },
  lib: {
    entry: {
      index: 'packages/core/index.ts',
      main: 'packages/core/main.ts',
      renderer: 'packages/core/renderer.ts'
    },
    formats: ['es']
  },
  outDir: 'dist-electron',
  minify: false
};
