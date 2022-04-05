import { defineConfig, defineConfigWithTheme } from "vitepress"
{/* <link rel="icon" type="image/svg+xml" href="/logo.svg"></link> */}
export default defineConfig({
    /** publicPath
     * eg. deploy to `https://foo.github.io/bar/`,base should be `/bar/`
    */
    base: "/",
    /** html lang attribute, 'en-US' , 'zh-CN'*/
    lang: 'zh-CN',
    /** page title suffix*/
    title: 'happy-learning',
    /** page description meta */
    description: 'Vite & Vue powered static site generator for personal learning.',
    /** 是否在页面底部显示最近一次更新文档的时间 */
    lastUpdated: true,
    head: [
        [
            "meta",
            {
              name: "viewport",
              content:
                "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,shrink-to-fit=no",
            },
        ],
        ["meta", { name: "keywords", content: "vinsurs的个人博客" }],
        ["link", { rel: "icon", type: "image/png", href: "/imgs/remax.png" }],
        // 引入 Gitalk
        [
            "link",
            { rel: "stylesheet", href: "https://unpkg.com/gitalk/dist/gitalk.css" },
        ],
        ["script", { src: "https://unpkg.com/gitalk/dist/gitalk.min.js" }],
    ],
    /** 主题配置 */
    themeConfig: {
        repo: 'vinsurs/happy-learning',
        docsDir: 'docs',
        docsBranch: 'master',
        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        prevLinks: true,
        nextLinks: true,
        algolia: {
            // appId: '8J64VVRP8K',
            // apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
            // indexName: 'vitepress'
        },

        carbonAds: {
            // carbon: 'CEBDT27Y',
            // custom: 'CKYD62QM',
            // placement: 'vuejsorg'
        },

        nav: [
            { 
                text: '框架文档',
                activeMatch: '^/$|^/framework-docs/',
                items: [
                    {
                        text: 'vitepress',
                        link: '/framework-docs/vitepress/index.html'
                    },
                    {
                        text: 'react-router-dom(v5)',
                        link: '/framework-docs/react-router-dom-v5/index.html'
                    }
                ]
            },
            { 
                text: '插件扩展',
                items: [
                    {
                        text: 'react-sortable-hoc',
                        link: '/externals/react-sortable-hoc/index.html'
                    },
                ]
            },
            
        ],
        // todo...
        // sidebar: {
        //     '/guide/': getGuideSidebar(),
        //     '/config/': getConfigSidebar(),
        //     '/': getGuideSidebar()
        // }
    }
})

function getGuideSidebar() {
  return [
    {
      text: 'Introduction',
      children: [
        { text: 'What is VitePress?', link: '/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Configuration', link: '/guide/configuration' },
        { text: 'Asset Handling', link: '/guide/assets' },
        { text: 'Markdown Extensions', link: '/guide/markdown' },
        { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
        { text: 'Deploying', link: '/guide/deploy' }
      ]
    },
    {
      text: 'Advanced',
      children: [
        { text: 'Frontmatter', link: '/guide/frontmatter' },
        { text: 'Theming', link: '/guide/theming' },
        { text: 'API Reference', link: '/guide/api' },
        {
          text: 'Differences from Vuepress',
          link: '/guide/differences-from-vuepress'
        }
      ]
    }
  ]
}

function getConfigSidebar() {
  return [
    {
      text: 'App Config',
      children: [{ text: 'Basics', link: '/config/basics' }]
    },
    {
      text: 'Theme Config',
      children: [
        { text: 'Homepage', link: '/config/homepage' },
        { text: 'Algolia Search', link: '/config/algolia-search' },
        { text: 'Carbon Ads', link: '/config/carbon-ads' }
      ]
    }
  ]
}
