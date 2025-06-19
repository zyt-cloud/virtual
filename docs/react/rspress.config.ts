import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { pluginPreview } from '@rspress/plugin-preview';

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
        '@z-cloud/virtual-react': path.join(__dirname, '../../', 'packages/react/src'),
        '@z-cloud/virtual-browser': path.join(__dirname, '../../', 'packages/browser/src'),
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
