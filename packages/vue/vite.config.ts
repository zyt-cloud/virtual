import { defineConfig, mergeConfig } from 'vite';
import { viteConfig } from '@z-cloud/vite-config';
import vue from '@vitejs/plugin-vue';

const config = defineConfig({
  plugins: [vue()],
});

export default mergeConfig(
  config,
  viteConfig({
    entry: 'src/index.ts',
  }),
);
