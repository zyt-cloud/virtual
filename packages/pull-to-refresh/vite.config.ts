import { defineConfig, mergeConfig } from 'vite'
import { viteConfig } from '@z-cloud/vite-config'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const config = defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
})

export default mergeConfig(
  config,
  viteConfig({
    cssCodeSplit: true,
    lib: {
      entry: ['./src/index.ts', './src/react/index.ts'],
    },
  }),
)
