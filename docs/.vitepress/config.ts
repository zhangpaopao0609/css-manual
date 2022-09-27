import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-ch',
  title: 'css manual',
  description: 'css manual.',
  head: [
    [
      'link',
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '32x32',
      },
    ],
  ],

  lastUpdated: true,

  themeConfig: {
    siteTitle: 'css manual',
    // logo: "/assets/logo/logo.png",

    outlineTitle: '页面概要',

    nav: nav(),

    sidebar: {
      '/guide/': guideSidebar(),
    },

    editLink: {
      pattern:
        'https://github.com/zhangpaopao0609/css-manual/tree/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/zhangpaopao0609/css-manual',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Zhangpaopao0609',
    },

    // algolia: {
    //   appId: '0RZZKNW6D6',
    //   apiKey: 'aada13abf56c713fc794469fbf1f3264',
    //   indexName: 'alg',
    // },
  },
});

function nav() {
  return [
    {
      text: 'Guide',
      link: '/guide/less/01-overview',
      activeMatch: '^/guide/',
    },
    {
      text: 'github',
      link: 'https://github.com/zhangpaopao0609/css-manual',
    },
  ];
}

function guideSidebar() {
  return [
    {
      text: 'less',
      collapsible: true,
      items: [
        { text: '概览', link: '/guide/less/01-overview' },
        { text: '变量', link: '/guide/less/02-variables.md' },
      ],
    },
  ];
}
