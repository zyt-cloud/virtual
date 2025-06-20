import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '两颗樱桃',
  description:
    '基于浏览器的虚拟列表实现, Vue virtual, VirtualList, virtual list',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/icon.png',
    nav: [
      { text: '指南', link: '/guide', activeMatch: '/guide' },
      { text: '联系我', link: '/contact', activeMatch: '/contact' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: '配置项', link: '/guide/config' },
            { text: '虚拟器实例', link: '/guide/instance' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zyt-cloud/virtual' },
    ],
  },
});
