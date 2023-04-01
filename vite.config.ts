import { resolve as stlResolve } from 'path';
import { existsSync, rmSync } from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron, { Configuration } from 'vite-plugin-electron';

const resolve = (...paths: string[]) => stlResolve(__dirname, ...paths);

existsSync(resolve('dist')) && rmSync(resolve('dist'), { recursive: true });
existsSync(resolve('dist-electron')) &&
  rmSync(resolve('dist-electron'), { recursive: true });

export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve';
  const isTest = process.env.NODE_ENV === 'test';

  const resolveConfig = {
    alias: {
      '@core': resolve('packages/core'),
      '@demo': resolve('packages/demo'),
      lodash: 'lodash-es'
    }
  };
  const electronOptions = [
    {
      entry:
        isDevelopment || isTest
          ? 'packages/demo/main/index.ts'
          : 'packages/core/index.ts',
      vite: {
        resolve: resolveConfig,
        build:
          isDevelopment || isTest
            ? undefined
            : {
                rollupOptions: {
                  external: ['electron', 'events']
                },
                lib: {
                  entry: 'packages/core/index.ts',
                  formats: ['es'],
                  fileName: 'index'
                },
                outDir: 'dist-electron',
                minify: false
              }
      }
    },
    (isDevelopment || isTest) && {
      entry: {
        preload: 'packages/demo/preload/index.ts'
      },
      onstart: (options: any) => options.reload(),
      vite: {
        resolve: resolveConfig
      }
    }
  ].filter(Boolean) as Configuration;

  return {
    resolve: resolveConfig,
    plugins: [vue(), electron(electronOptions)]
  };
});
