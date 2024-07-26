import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kalu5",
  description: "Yak shaving",
  themeConfig: {
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
            }
          ] },
          { text: 'Vue设计与原理', link: '/pages/base/vue/index' },
          { text: 'React原理', link: '/pages/base/react/index' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kalu5' }
    ]
  },
  base: '/footmark/'
})
