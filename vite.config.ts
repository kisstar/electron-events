import { resolve as pResolve } from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import vue from '@vitejs/plugin-vue';

const resolve = (...paths: string[]) => pResolve(__dirname, ...paths);

export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve';
  const resolveConfig = {
    alias: {
      '@core': resolve('packages/core'),
      '@demo': resolve('packages/demo')
    }
  };

  return {
    resolve: resolveConfig,
    plugins: [
      vue(),
      electron(
        [
          {
            entry: isDevelopment
              ? 'packages/demo/main/index.ts'
              : 'packages/core/index.ts',
            vite: {
              resolve: resolveConfig
            }
          },
          isDevelopment &&
            ({
              entry: {
                preload: 'packages/demo/preload/index.ts'
              },
              onstart(options: any) {
                options.reload();
              },
              vite: {
                resolve: resolveConfig
              }
            } as any)
        ].filter(Boolean)
      )
    ]
  };
});
