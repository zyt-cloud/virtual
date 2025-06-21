import { defineConfig, mergeConfig } from 'vite';
import { viteConfig } from '@z-cloud/vite-config';
import react from '@vitejs/plugin-react';

const config = defineConfig({
  plugins: [react()],
});

export default mergeConfig(
  config,
  viteConfig({
    lib: {
      entry: './src/index.ts',
    },
    rollupOptions: {
      external: [
        '@z-cloud/virtual-vanilla',
        '@z-cloud/virtual-browser',
        'react',
        'react-dom',
      ],
      output: {
        preserveModules: true,
      },
      jsx: {
        mode: 'automatic',
        preset: 'react-jsx',
      },
    },
  }),
);
