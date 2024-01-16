import { resolve as stlResolve } from 'path';
import { existsSync, rmSync } from 'fs';
import { defineConfig, type BuildOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron/simple';
import pkg from './package.json';

const resolve = (...paths: string[]) => stlResolve(__dirname, ...paths);
const clean = () => {
  existsSync(resolve('dist')) && rmSync(resolve('dist'), { recursive: true });
  existsSync(resolve('dist-electron')) &&
    rmSync(resolve('dist-electron'), { recursive: true });
};
const resolveConfig = {
  alias: {
    '@core': resolve('packages/core'),
    '@demo': resolve('packages/demo'),
    lodash: 'lodash-es'
  }
};
const notSupportEsModules = ['lodash-es'];
const cjsBuildConf: BuildOptions = {
  rollupOptions: {
    external: [
      'electron',
      'events',
      ...Object.keys(pkg.dependencies || {})
    ].filter(item => !notSupportEsModules.includes(item))
  },
  lib: {
    entry: 'packages/core/index.ts',
    formats: ['cjs'],
    fileName: 'index'
  },
  outDir: 'dist-electron'
};
const esBuildConf: BuildOptions = {
  rollupOptions: {
    external: ['electron', 'events', ...Object.keys(pkg.dependencies || {})]
  },
  lib: {
    entry: 'packages/core/index.ts',
    formats: ['es'],
    fileName: 'index'
  },
  outDir: 'dist-electron',
  minify: false
};

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const isTest = process.env.NODE_ENV === 'test';
  const isRealBuild = isBuild && !isTest;

  if (isRealBuild) {
    clean();
  }

  const electronOptions = {
    main: {
      entry: 'packages/demo/main/index.ts',
      vite: {
        resolve: resolveConfig,
        build: isRealBuild ? cjsBuildConf : {}
      }
    },
    preload: isRealBuild
      ? undefined
      : {
          input: {
            preload: 'packages/demo/preload/index.ts'
          },
          vite: {
            resolve: resolveConfig
          }
        }
  };

  return {
    resolve: resolveConfig,
    build: {
      ...(isRealBuild ? esBuildConf : {})
    },
    plugins: [!isRealBuild && vue(), electron(electronOptions)].filter(Boolean)
  };
});
