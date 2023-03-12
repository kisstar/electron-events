import { resolve as stlResolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron, { Configuration } from 'vite-plugin-electron';

const resolve = (...paths: string[]) => stlResolve(__dirname, ...paths);

export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve';
  const isTest = process.env.NODE_ENV === 'test';

  const resolveConfig = {
    alias: {
      '@core': resolve('packages/core'),
      '@demo': resolve('packages/demo')
    }
  };
  const electronOptions = [
    {
      entry:
        isDevelopment || isTest
          ? 'packages/demo/main/index.ts'
          : 'packages/core/index.ts',
      vite: {
        resolve: resolveConfig
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
