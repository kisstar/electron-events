import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';

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
      onstart(options) {
        options.reload();
      }
    } as any);
  }

  return {
    plugins: [electron(electronOptions)]
  };
});
