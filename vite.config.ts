import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve';
  const electronOptions = [
    {
      entry: isDevelopment
        ? 'packages/demo/main/index.ts'
        : 'packages/core/index.ts'
    }
  ];

  if (isDevelopment) {
    electronOptions.push({
      entry: {
        preload: 'packages/demo/preload/index.ts'
      },
      onstart(options: any) {
        options.reload();
      }
    } as any);
  }

  return {
    plugins: [vue(), electron(electronOptions)]
  };
});
