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
      output: {
        preserveModules: true,
      },
    },
  }),
);
