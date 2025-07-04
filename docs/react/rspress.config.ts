import * as path from 'node:path'
import { defineConfig } from 'rspress/config'
import { pluginPreview } from '@rspress/plugin-preview'

const alias = ['react', 'browser', 'vanilla'].reduce(
  (prev, name) => {
    prev[`@z-cloud/virtual-${name}`] = path.join(__dirname, '../../', `packages/${name}/src`)
    return prev
  },
  {
    '@z-cloud/pull-to-refresh/react': path.join(
      __dirname,
      '../../',
      `packages/pull-to-refresh/src/react`,
    ),
  },
)

export default defineConfig({
  plugins: [pluginPreview()],
  root: path.join(__dirname, 'docs'),
  base: '/virtual/',
  outDir: '../dist',
  description: '基于浏览器的虚拟列表实现, React virtual, VirtualList, virtual list',
  title: '两颗樱桃',
  // https://zyt-cloud.github.io/virtual/favicon.png
  icon:
    process.env.NODE_ENV === 'development'
      ? '/favicon.png'
      : 'https://zyt-cloud.github.io/virtual/favicon.png',
  logo:
    process.env.NODE_ENV === 'development'
      ? '/icon.png'
      : 'https://zyt-cloud.github.io/virtual/icon.png',
  logoText: '两颗樱桃',
  globalStyles: path.join(__dirname, 'src/styles/index.css'),
  builderConfig: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        ...alias,
      },
    },
  },
  themeConfig: {
    searchPlaceholderText: '文档搜索',
    searchSuggestedQueryText: '请换一个不同的关键字搜索',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/zyt-cloud/virtual',
      },
    ],
  },
})
