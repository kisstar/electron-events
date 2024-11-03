import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron/simple';
import { resolveConfig } from './scripts/helpers/index.mjs';

export default defineConfig(() => {
  const electronOptions = {
    main: {
      entry: 'packages/demo/main/index.ts',
      vite: {
        resolve: resolveConfig
      }
    },
    preload: {
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
    plugins: [vue(), electron(electronOptions)].filter(Boolean)
  };
});
