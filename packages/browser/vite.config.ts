import { defineConfig, mergeConfig } from 'vite';
import { viteConfig } from '@z-cloud/vite-config';

// https://vite.dev/config/
const config = defineConfig({});

export default mergeConfig(
  config,
  viteConfig({
    lib: {
      entry: './src/index.ts',
    },
    rollupOptions: {
      external: ['@z-cloud/virtual-vanilla'],
      output: {
        preserveModules: true,
      },
    },
  }),
);
