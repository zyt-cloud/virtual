import { defineConfig, mergeConfig } from 'vite'
import { viteConfig } from '@z-cloud/vite-config'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const config = defineConfig({
  plugins: [
    react(),
    vue(),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
      jsAssetsFilterFunction: function customJsAssetsfilterFunction(outputChunk) {
        console.log(outputChunk)
        return true
      },
    }),
  ],
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
