import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: '两颗樱桃',
  icon: '/favicon.png',
  logo: '/icon.png',
  logoText: '两颗樱桃',
  globalUIComponents: [path.join(__dirname, 'src', 'components', 'test.tsx')],
  builderConfig: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
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
});
