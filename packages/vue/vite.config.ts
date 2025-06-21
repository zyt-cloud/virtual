import { defineConfig, mergeConfig } from 'vite';
import { viteConfig } from '@z-cloud/vite-config';
import vue from '@vitejs/plugin-vue';

const config = defineConfig({
  plugins: [vue()],
});

export default mergeConfig(
  config,
  viteConfig({
    lib: {
      entry: './src/index.ts',
    },
    rollupOptions: {
      external: ['@z-cloud/virtual-vanilla', '@z-cloud/virtual-browser', 'vue'],
      output: {
        preserveModules: true,
      },
    },
  }),
);
