import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { pluginPreview } from '@rspress/plugin-preview';

const alias = ['react', 'browser', 'vanilla'].reduce((prev, name) => {
  prev[`@z-cloud/virtual-${name}`] = path.join(
    __dirname,
    '../../',
    `packages/${name}/src`,
  );
  return prev;
}, {});

export default defineConfig({
  plugins: [pluginPreview()],
  root: path.join(__dirname, 'docs'),
  title: '两颗樱桃',
  icon: '/favicon.png',
  logo: '/icon.png',
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
});
