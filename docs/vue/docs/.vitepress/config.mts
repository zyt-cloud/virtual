import path from 'node:path'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'

const alias = ['vue', 'browser', 'vanilla'].reduce(
  (prev, name) => {
    prev[`@z-cloud/virtual-${name}`] = path.join(process.cwd(), '../../', `packages/${name}/src`)
    return prev
  },
  {
    '@z-cloud/pull-to-refresh/vue': path.join(
      process.cwd(),
      '../../',
      `packages/pull-to-refresh/src/vue`,
    ),
  },
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '两颗樱桃',
  description: '基于浏览器的虚拟列表实现, Vue virtual, VirtualList, virtual list',
  head: [['link', { rel: 'icon', href: '/virtual/vue/favicon.png' }]],
  base: '/virtual/vue/',
  vite: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '..'),
        ...alias,
      },
    },
  },
  outDir: '../../dist/vue',
  markdown: {
    config: (md) => {
      md.use(vitepressDemoPlugin, {
        demoDir: path.resolve(__dirname, '../components'),
      })
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },
    logo: '/icon.png',
    nav: [
      { text: '指南', link: '/guide', activeMatch: '/guide' },
      { text: '联系我', link: '/contact', activeMatch: '/contact' },
      { text: '一杯咖啡', link: 'https://zyt-cloud.github.io/virtual/coffee/index.html' },
      {
        text: '其他链接',
        items: [
          { text: 'Virtual React', link: 'https://zyt-cloud.github.io/virtual/' },
          { text: 'Virtual Taro', link: 'https://www.npmjs.com/package/@z-cloud/virtual-taro' },
          { text: 'Virtual uni-app', link: 'https://www.npmjs.com/package/@z-cloud/virtual-uni' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: 'uni-app', link: '/guide/uni' },
            { text: '配置项', link: '/guide/config' },
            { text: '虚拟器实例', link: '/guide/instance' },
            { text: 'PullToRefresh组件', link: '/guide/pull-to-refresh' },
            {
              text: '示例',
              items: [
                { text: '基础使用', link: '/guide/demo/basic' },
                { text: '瀑布流', link: '/guide/demo/waterfall' },
                { text: '跟随页面滚动', link: '/guide/demo/page' },
                { text: '动态尺寸', link: '/guide/demo/dynamic' },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/zyt-cloud/virtual' }],
  },
})
