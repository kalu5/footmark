import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kalu5",
  description: "Yak Shaving",
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/footmark/l.png" }],
    ["meta", { name: "theme-color", content: "#5f67ee" }],
  ],
  themeConfig: {
    logo: { src: "/j.png", width: 24, height: 24 },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "学习记录", link: "/pages/base/index" },
    ],

    sidebar: [
      {
        text: "学习记录",
        items: [
          {
            text: "计算机基础",
            items: [
              {
                text: "浏览器工作原理",
                link: "/pages/base/computer/browser",
              },
              {
                text: "计算机网络",
                link: "/pages/base/computer/network",
              },
              {
                text: "设计模式",
                link: "/pages/base/computer/design-principles",
              },
              {
                text: "数据结构与算法",
                link: "/pages/base/computer/algorithm",
              },
            ],
          },
          {
            text: "Javascript",
            items: [
              {
                text: "Js基础",
                link: "/pages/base/js/js-deep",
              },
              {
                text: "对象克隆",
                link: "/pages/base/js/clone-obj",
              },
              {
                text: "Reduce原理",
                link: "/pages/base/js/arr-traversal",
              },
              {
                text: "Promise原理",
                link: "/pages/base/js/promise",
              },
              {
                text: "正则表达式",
                link: "/pages/base/js/regexp",
              },
            ],
          },
          {
            text: "NodeJs",
            items: [
              {
                text: "深入浅出Node",
                link: "/pages/base/node/base",
              },
              {
                text: "MiniExpress",
                link: "/pages/base/node/mini-express",
              },
            ],
          },
          {
            text: "Vue及周边",
            items: [
              {
                text: "Vue设计原理",
                link: "/pages/base/vue/vue",
              },
              {
                text: "Pinia实现原理",
                link: "/pages/base/vue/pinia",
              },
              {
                text: "VueRouter原理",
                link: "/pages/base/vue/router",
              },
              {
                text: 'Element Plus Form表单封装',
                link: '/pages/base/vue/element-plus-form'
              }
            ],
          },
          {
            text: "React及周边",
            items: [
              {
                text: "React Hooks",
                link: "/pages/base/react/hooks",
              },
            ],
          },
          {
            text: "架构设计",
            items: [
              {
                text: "Webpack",
                link: "/pages/base/framework/webpack",
              },
              {
                text: "工程化",
                link: "/pages/base/framework/project",
              },
              {
                text: "Docker",
                link: "/pages/base/framework/docker",
              },
              {
                text: "Monorepo",
                link: "/pages/base/framework/monorepo",
              },
              {
                text: "发布Npm包",
                link: "/pages/base/framework/npm-package",
              },
              {
                text: "Git基操",
                link: "/pages/base/framework/git",
              },
              {
                text: "性能优化",
                link: "/pages/base/framework/performance",
              },
              {
                text: "Commitlint",
                link: "/pages/base/framework/commitlint",
              }
            ],
          },
          {
            text: "拓展",
            items: [
              {
                text: '可视化大屏开发技术方案设计',
                link: '/pages/base/specific/big-screen'
              },
              {
                text: '小程序开发技术方案设计',
                link: '/pages/base/specific/mini-program'
              },
              {
                text: 'h5开发技术方案设计',
                link: '/pages/base/specific/h5'
              },
              {
                text: '金额相关工具',
                link: '/pages/base/specific/money',
              },
              {
                text: "大文件上传",
                link: "/pages/base/specific/upload",
              },
              {
                text: "Topic",
                link: "/pages/base/specific/topic",
              },
            ],
          },
          {
            text: "English",
            items: [
              {
                text: "Base Vocabulary",
                link: "/pages/english/base-vocabulary",
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/kalu5" }],
    footer: {
      message: "基于 MIT 许可发布",
      copyright: `版权所有 © 2024-${new Date().getFullYear()} kalu5`,
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
  base: "/footmark/",
});
