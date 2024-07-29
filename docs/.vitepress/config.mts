import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kalu5",
  description: "Yak shaving",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/footmark/vitepress-logo-mini.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/footmark/vitepress-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }]
  ],
  themeConfig: {
    logo: { src: '/vitepress-logo-mini.svg', width: 24, height: 24 },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '薅牛毛', link: '/' },
      { text: '薅牛毛前', link: '/pages/base/index' }
    ],

    sidebar: [
      {
        text: '薅牛毛前',
        items: [
          { text: '你不知道的Javascript', items: [
            {
              text: '对象克隆',
              link: '/pages/base/js/clone-obj'
            },
            {
              text: '数组遍历',
              link: '/pages/base/js/arr-traversal'
            }
          ] },
          { text: 'Css世界', link: '/pages/base/css/index' },
          { text: 'Vue设计与原理', link: '/pages/base/vue/index' },
          { text: 'React原理', link: '/pages/base/react/index' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kalu5' }
    ],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} kalu5`
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },
  base: '/footmark/'
})
