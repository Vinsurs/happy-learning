---
sidebarDepth: 4
---
# VitePress(v0.22.3)
## 什么是vitepress
::: warning
vitepress当前处于0.x状态。它已经适合开箱即用的文档使用，但是config和theme API可能会在各个minor版本中发生改变。
:::
### 动机
vuepress是建立在webpack之上的，就算是用于一个简单的文档站点，启动开发服务器花费的时间也是让人无法忍受的。甚至HMR更新也需要花费几十秒来反映到浏览器。

从根本上说，这是因为vuepress v1底层使用的是webpack。甚至只有两个页面，webpack也会完整的编译。当项目有很多页面时，情况会变得更糟。每个页面都必须首先完全编译，然后服务器才能显示任何内容，并且闪电般的HMR

顺便说一句，Vite 很好地解决了这些问题：几乎即时的服务器启动，按需编译，只编译正在服务的页面。另外，随着时间的推移，我在 VuePress v1 中注意到了一些额外的设计问题，但由于需要大量的重构，我一直没有时间修复。

现在，有了 Vite 和 Vue 3，是时候重新思考“基于 Vue 的静态站点生成器”到底能做什么了。
### 在vuepress v1上的改进
#### vitepress使用vue3
#### vitepress底层使用vite
- 更快的开发服务器启动
- 更快的热更新
- 更快的构建（内部使用rollup)
#### 更轻的页面体积
- vue3 tree-shaking + rollup 代码分割
- 不会为每个请求的每个页面发送元数据,这将页面大小与页面总数分离, 仅发送当前页面的元数据。客户端导航同时获取新页面的组件和元数据。
- 不使用`vue-router`,因为 VitePress 的需求非常简单和具体-一个简单的自定义路由器（低于 200 LOC）被使用
- (开发中)i18n 语言环境数据也应该是按需获取
#### 其他区别
VitePress 更有主见且可配置性更低: VitePress 旨在缩减当前 VuePress 的复杂性，并从其极简主义的根源重新开始。

VitePress 面向未来：**VitePress 仅针对支持原生 ES 模块导入的浏览器**。它鼓励使用原生 JavaScript 而无需转译，以及用于主题的 CSS 变量。
#### vitepress会取代vuepress吗
[vuepress-next](https://github.com/vuepress/vuepress-next)已经发布了, 它是下个vuepress的主要版本。它也在vuepress v1上进行了诸多改进，并且现在也支持vite了。

VitePress与当前的VuePress生态系统(主要是主题和插件)不兼容。总体思路是，VitePress 将拥有一个**更精简的主题 API**（更喜欢 JavaScript API 而不是文件布局约定）并且**可能没有插件**（所有自定义都在主题中完成）。
## 起步
本节将帮助您从头开始构建一个基本的 VitePress 文档站点。如果您已经有一个现有项目并希望在项目中保留文档，请从第 3 步开始。

1. 创建并进入一个新目录
```bash
$ mkdir vitepress-starter && cd vitepress-starter
```
2. 初始化项目
```bash
$ yarn init
```
3. 本地安装vitepress依赖
```bash
$ yarn add --dev vitepresshandling
```
4. 创建你的第一个文档
```bash
$ mkdir docs && echo '# Hello VitePress' > docs/index.md
```
5. 在`package.json`中添加一些npm scripts:
```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```
6. 启动开发服务器
```bash
$ yarn docs:dev
```
vitepress将会在`http://localhost:3000`开启一个热重载的开发服务器。

现在，你应该有一个基础但具有功能的vitepress文档站点。

当你的文档站点开发成型时，确保去阅读[部署指南](#deploying)
## 配置
`.vitepress/config.js`是vitepress配置的核心文件, 它应该导出一个JavaScript对象:
```js
module.exports = {
  title: 'Hello VitePress',
  description: 'Just playing around.'
}
```
查看[配置参考](#config-reference)以获得完整的配置选项列表
### 配置智能提示
- 利用IDE的jsdoc type hints:
```js
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```
- use `defineConfig`helper:
```js
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ...
})
```
### 类型化theme配置
默认情况下, `defineConfig`helper 只是从默认主题中获取theme类型:
```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    // Type is `DefaultTheme.Config`
  }
})
```
如果您使用**自定义主题并希望对主题配置进行类型检查**, 你需要改用`defineConfigWithTheme`替代,并且通过泛型参数传递自定义主题的配置类型:
```ts
import { defineConfigWithTheme } from 'vitepress'
import { ThemeConfig } from 'your-theme'

export default defineConfigWithTheme<ThemeConfig>({
  themeConfig: {
    // Type is `ThemeConfig`
  }
})
```
## asset handling

- absolute path asset(based on vitepress project root, `docs`)
输入
```md
  ![logo](/imgs/remax.png)
```
  ![logo](/imgs/remax.png)

- relative path asset
```md
  ![logo](./images/remax.png)
```
  ![logo](./images/remax.png)

类似于vue-cli,小于4kb的资源将会被base64内联处理,否则会在生产构建中被拷贝到构建目录(dist)下并且以hash命名。
### Public Files
vitepress项目的根目录(eg.docs)下的public目录在生产打包时会直接复制到打包输出的根目录下。当你引用public下的资源时，需要使用根绝对路径。比如, `public/icon.png`应该在代码中这样引用`/icon.png`。
### base url
如果你的项目的不是路径不是在服务器根路径，那你需要在`.vitepress/config.js`中配置`base`选项。比如你打算将你的站点部署到`https://foo.github.io/bar/`,那么`base`应该设置为`/bar/`(前后必须加上'/')。

所有静态资源路径会根据`base`做自动调整。比如你在markdown中有下面的资源引用:
```md
![An image](/image-inside-public.png)
```
当年修改`base`选项值后，你是**不需要**更新资源引用路径的，构建时vitepress会自动调整。

然而，如果你的组件动态链接了一个资源，比如，img的src是基于一个theme配置值:

```vue
<img :src="theme.logoPath" />
```
在这种情况下，推荐的做法是用vitepress提供的`withBase`辅助函数对链接进行包裹：
```vue
<script setup>
import { withBase, useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
<img :src="withBase(theme.logoPath)"/>
</template>
```
## markdown extensions
### links
#### internal links
内部链接将会转换成router link用于SPA导航。并且，每个包含在二级目录下的`index.md`也会自动转换为`index.html`，并带有相应的URL`/`。

比如，给定如下目录结构:
```
.
|- index.md
|- foo
|  |- index.md
|  |- one.md
|  |- two.md
|- bar
|  |- index.md
|  |- three.md
|  |- four.md
```
并且此时你处在`foo/one.md`:
```md
[Home](/) <!-- sends the user to the root index.md -->
[foo](/foo/) <!-- sends the user to index.html of directory foo -->
[foo heading](./#heading) <!-- anchors user to a heading in the foo index file -->
[bar - three](../bar/three) <!-- you can omit extention -->
[bar - three](../bar/three.md) <!-- you can append .md -->
[bar - four](../bar/four.html) <!-- or you can append .html -->
```
#### page suffix
页面和内部链接默认会以`.html`后缀生成。

#### external links
外部链接自动会加上`target="_blank" rel="noopener noreferrer"`
[vueJs](https://vuejs.org/)

### frontmatter
[yaml frontmatter]()也是开箱即用
```yaml
---
title: Blogging like a Hacker
lang: en-US
```

### github-style table

| repository        |     description      | stars |
| :---------------- | :------------------: | ----: |
| vue-banner-better | vue banner component |     2 |
| glfe              |   A prop-path util   |     0 |

### Emoji
输入
```md
:tada: :100: :coffee:
```
:tada: :100: :coffee:

A [list of all emojis](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json) is availble

### Table of Contents
输入
```md
[[toc]]
```
输出
[[toc]]

### Custome Containers

custome container can be defined by their types, titles and contents.

#### default title

- tip
  ```md
  ::: tip
  this is tip
  :::
  ```
  ::: tip
  this is tip
  :::

- info
  ```md
  ::: info
  this is info
  :::
  ```
  ::: info
  this is info
  :::

- warning
  ::: warning
  this is warning
  :::

- danger
  ::: danger
  this is danger
  :::

- details
  ::: details
  this is detail
  :::

#### custom title
输入
```md
::: danger danger area
this is very dangerous
:::
```
::: danger danger area
this is very dangerous
:::

::: details click me to view details

```js
console.log('vitepress is cool')
```

:::

### syntax highlight in code blocks

vuepress 使用 prism 通过使用有颜色的文本来高亮 markdown 中的语言代码,你所需要做的就是在代码块开始指定语言名称即可.

```js
console.log('vitepress is cool')
```

prism 支持的所有语言可在[prism 文档](https://prismjs.com/#languages-list)找到

### 指定代码块中具体行高亮
语法：
````
```js{4}
function sum(...args) {
    let amount = 0
    for(let i = 0; i< args.length; i++) {
        amount += args[i]
    }
    return amount
}
```
````
```js{4}
function sum(...args) {
    let amount = 0
    for(let i = 0; i< args.length; i++) {
        amount += args[i]
    }
    return amount
}
```

除了单行，还可以指定多个单行，行范围，和他们的组合:
- 行范围: 比如 `{5-8}`, `{3-10}`, `{10-17}`
- 多个单行: 比如 `{4,7,9}`
- 组合: 比如 `{4,7-13,16,23-27,40}`

### 行号
可通过配置启用为每个代码块添加行号
```js
export default defineConfig({
    markdown: {
        lineNumbers: true
    }
})
```
```bash
#!/usr/bin/env sh

# 如果你需要部署到你自己的域名
# echo "www.example.com" > CNAME

git init
git add -A
git commit -m "deploy"

# 如果你要部署到 https://<UserName>.github.io
# git push -f git@github.com:<UserName>/<UserName>.github.io.git master

# 如果你要部署到 https://<UserName>.github.io/<Repo>
# git push -f git@github.com:<UserName>/<Repo>.git master:gh-pages

cd -
```
### 导入代码片段
可以通过下面语法从已存在的代码文件中导入代码片段
```
<<< @/filepath
```
导入之后同样支持行高亮
```
<<< @/filepath{1,3-4}
```
其中,语法中的@符号是路径占位符，可通过srcDir配置，默认值是vitepress项目根目录(docs)
- 例子
// 导入foo.js
```
<<< @/snippets/foo.js{1}
```
这将会把foo.js**完全**导入过来并高亮第一行

<<< @/snippets/foo.js{1}

如果你不想完全将foo.js导入过来，只是想导入其中部分代码，可利用[VS Code region](https://code.visualstudio.com/docs/editor/codebasics#_folding)语法做到只导入文件的一部分, region name默认是snippet。
语法：
1. 在代码片段文件中，使用*vs code region*定义一个region：
```
// #region 名称
console.log("只会把我导出去")
// #endregion 名称
console.log("我不会导出去")
```
2. 在你的`.md`文件中导入该代码片段中的region：
```md
<<< @/代码文件路径#region名称{高亮语法}
```
比如：
// bar.js
```js
// #region snippet
function bar() { 
    console.log("bar")
}
// #endregion snippet
export default bar
```
开始导入
```
<<< @/snippets/bar.js#snippet{2}
```
输出如下：

<<< @/snippets/bar.js#snippet{2}

### Advanced Configuration
vitepress 使用[markdown-it](https://github.com/markdown-it/markdown-it)作为markdown的渲染器。上面的大部分markdown扩展功能都是通过自定义插件实现的。你可在`.vitepress/config.js`中的`markdown`选项进一步自定义`markdown-it`实例:
```js
const anchor = require('markdown-it-anchor')

module.exports = {
  markdown: {
    // options for markdown-it-anchor
    // https://github.com/valeriangalliat/markdown-it-anchor#permalinks
    anchor: {
      permalink: anchor.permalink.headerLink()
    },

    // options for markdown-it-table-of-contents
    toc: { includeLevel: [1, 2] },

    config: (md) => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-xxx'))
    }
  }
}
```
## using vue in markdown

在vitepress中，每个markdown文件将被编译为html，然后将被视为vue单文件组件处理。这意味着你可以在markdown文件中使用任何vue的特性，包括动态模板，使用vue组件，或者通过添加`<script>`标签书写vue的逻辑。

vitepress使用vue3编译器来自动检测和优化纯静态的markdown内容。静态内容将优化成单个站位节点并且会从页面的JavaScript载荷中移除。静态内容会在客户端hydration的时候被跳过。总之，你只需要关注页面的动态部分即可。

### 插值
每个markdown文件首先会被编译为html，然后会被vite当做vue组件来处理。这意味着你可以在文本中使用vue风格的插值：
输入：
```html
{{ 1 + 1 }}
```
输出：

{{ 1 + 1 }}

### 指令
输入：
```html
<span v-for="i in 3">{{i}}</span>
```
输出：

<span v-for="i in 3">{{i}}</span>

### 访问站点和页面数据
你可在`<script>`中使用`useData`辅助函数来将数据暴露给页面

输入
```md
<script setup>
  import { useData } from 'vitepress'
  const { page } = useData()
</script>

<pre>{{ page }}</pre>
```
输出

<script setup>
  import { useData } from 'vitepress'
  const { page } = useData()
</script>

<pre>{{ page }}</pre>

### escape(`v-pre` custom container)

输入
```md
::: v-pre
`{{ 这不会被vue编译 }}`
:::
```
输出

::: v-pre
`{{ 这不会被vue编译 }}`
:::

## 使用组件
当你需要更多的灵活性，vitepress允许你通过使用vue组件扩展你的工具箱
### 在markdown中导入组件
如果你的组件只会在某些地方使用到，推荐的方式是在它被使用到的地方导入它们，然后使用即可。
```md
<script setup>
  import CustomComponet from "../components/CustomComponent"
</script>

# Docs
这是一个使用自定义组件的markdown

<CustomComponent/>

## more docs
```
### 在theme中注册全局组件
如果你的组件将会在docs中的多个页面中使用到，它们可在theme中全局注册

在`.vitepree/theme/index.js`中，`enhanceApp`函数接收vue的`app`实例作为参数，因此你可以像在一个常规的vue应用中那样来注册组件

`.vitepree/theme/index.js`:
```js
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('CompName', comp)
  }
}
```
定义之后，然后就可以在你的任何md页面中使用了

```md
<CompName />
```
::: warning IMPORTANT
确保自定义组件的组件名要么包含“-”连词符，要么是PascalCase命名。否则，该自定义组件会被视为inline(内联)元素并会用`<p>`标签包裹，这可能会导致hydration mismatch，因为`<p>`标签内部**不允许**有block(块级)元素
:::

### 在Headers中使用组件
你可以在headers中使用vue组件，但是得注意下面语法之间的区别：
| markdown |output html | parsed Header |
| :------: |:----------:| :-----------: |
|`# text <Tag />`|`<h1> text <Tag /> </h1>`|`text`|
|`# text '<Tag/>'` | `<h1>text <code>&lt;Tag/&gt;</code></h1>`|`text <Tag />`|

上面，包裹在`<code>`(反单引号,例如上面的tag)中的html将会原样显示，否则将会被vue解析。
::: tip
output html是通过[`markdonw-it`](https://github.com/markdown-it/markdown-it)完成的，而parsed headers是通过vitepress处理的(该条同样适用于sidebar和document title)
:::

## 使用css预处理器
vitepress对于css预处理器内置支持，包括.scss,.sass,.less,.styl和.stylus。不需要再去安装它们对应的vite插件，但是预处理器本身是需要安装的:
```bash
# .scss and .sass
npm i -D sass
# .less
npm i -D less
# .styl and .stylus
npm i -D stylus
```
然后你就可以在markdown和theme组件中使用了
```vue
<style lang="sass">
.title
  font-size: 20px
</style>
```
## script & style hoisting
有时您可能只需要对当前页面应用一些 JavaScript 或 CSS。在这种情况下，你可以在markdown文件中直接写根级别的`<script>`或`<style>`。这将从编译后的 HTML 中取出并用作生成的 Vue 单文件组件的 `<script>` 和 `<style>` 块
[This is rendered by inline script and styled by inline CSS]()
## 内置组件
vitepress提供了内置组件，比如`ClientOnly`和`OutboundLink`,详情请查看[全局组件指南](https://vitepress.vuejs.org/guide/global-component.html)

## 浏览器API访问限制
因为静态生成构建时vitepress是服务端渲染的，所以任何vue的使用必须遵守vue的服务端渲染。总之，确保**仅**在`beforeMount`或`mounted`钩子中访问BOM/DOM APIs。

如果你正在使用或演示**对服务端渲染不友好**的组件(比如包含自定义指令),你可以使用内置组件`<ClientOnly />`包裹它们:
```md
<ClientOnly>
 <NonSSRFriendlyComp />
</ClientOnly>
```
注意这并不会修复那些在导入(import)时就访问浏览器APIs的组件或库。为了使用那些在import时就访问浏览器APIs的代码(组件或库),你应该在合适的生命周期钩子中动态import它们:
```vue
<script>
export default {
  mounted() {
    import("./lib-that-access-window-on-import").then(module=>{
      // use code
    })
  }
}
```
如果你的模块`export default`一个vue组件，你可以动态注册它:
```vue
<template>
  <component v-if="dynamicComponent" :is="dynamicComponent"/>
</template>

<script>
export default {
  data() {
    return {
      dynamicComponent: null
    }
  },
  mounted() {
    import("./lib-that-access-window-on-import").then(module=>{
      this.dynamicComponent = module.default
    })
  }
}
</script>
```
## deploying
以下的部署指南建立在下面几个假设上:
- 你的文档放在你项目的docs目录下
- 你正在使用默认构建输出目录(.vitepress/dist)
- vitepress作为项目的本地依赖已安装，并且package.json有以下npm scripts：
```json
{
  "scripts": {
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```
### building the docs
你可通过`yarn docs:build`构建文档
```sh
$ yarn docs:build
```
默认构建输出目录是`.vitepress/dist`,你可将`dist`目录部署到任何你喜欢的平台。
#### 本地测试
一旦你构建后，你可通过运行`yarn docs:serve`命令本地测试它们。
```sh
$ yarn docs:build
$ yarn docs:serve
```
`serve`命令将会在`http://localhost:5000`启动一个服务`.vitepress/dist`目录的本地静态web服务器。这是在你本地环境检查生成构建是否正确的最简单方法。

你也可以通过传递`--port`标志给`serve`命令来配置服务的端口:
```json
{
  "scripts": {
    "docs:serve": "vitepress serve docs --port 8080"
  }
}
```
现在`docs:serve`将会在`http://localhost:8080`启动服务。

### 部署到GitHub Pages
1. 在`docs/.vitepress/config.js`正确配置`base`选项
   如果你想部署到`https://<USERNAME>.github.io/`,你可以忽略(不用)配置`base`,因为它默认就是`/'。

   如果你想部署到`https://<USERNAME>.github.io/<REPO>/`, 比如你的仓库在`https://github.com/<USERNAME>/<REPO>`，那么`base`应该设置为`/<REPO>/`。

2. 在你的项目中创建`deploy.sh`并写有以下内容(高亮的行按需取消注释即可),然后运行它:
```bash{13,20,23}
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vitepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -

```
::: tip
You can also run the above script in your CI setup to enable automatic deployment on each push.
:::

### GitHub Pages and Travis CI(持续集成)
1. 在`docs/.vitepress/config.js`正确配置`base`选项
   如果你想部署到`https://<USERNAME>.github.io/`,你可以忽略(不用)配置`base`,因为它默认就是`/'。

   如果你想部署到`https://<USERNAME>.github.io/<REPO>/`, 比如你的仓库在`https://github.com/<USERNAME>/<REPO>`，那么`base`应该设置为`/<REPO>/`。
2. 在项目根目录创建`.travis.yml`文件
3. 本地运行`yarn` 或`npm install`并提交产生的lockfile(`yarn.lock` 或 `package-lock.json`)
4. Use the GitHub Pages deploy provider template, and follow the [Travis CI documentation](https://docs.travis-ci.com/user/deployment/pages).

```yaml
language: node_js
node_js:
  - lts/*
install:
  - yarn install # npm ci
script:
  - yarn docs:build # npm run docs:build
deploy:
  provider: pages
  skip_cleanup: true
  local_dir: docs/.vitepress/dist
  # A token generated on GitHub allowing Travis to push code on you repository.
  # Set in the Travis settings page of your repository, as a secure variable.
  github_token: $GITHUB_TOKEN
  keep_history: true
  on:
    branch: main
```
### netlify
1. 在[netlify](https://www.netlify.com/)上创建一个来自GitHub的新项目,并有以下设置:
+ **构建命令**: `vitepress build docs` 或 `yarn docs:build` 或 `npm run docs:build`
+ **部署目录**: `docs/.vitepress/dist`
2. 按下部署按钮

### surge
1. 安装[surge](https://www.npmjs.com/package/surge)
2. 运行`yarn docs:build` 或 `npm run docs:build`
3. 通过`surge docs/.vitepress/dist`部署到surge

你也可以通过`surge docs/.vitepress/dist yourdomain.com`部署到一个[custom domain](https://surge.sh/help/adding-a-custom-domain)

### heroku
1. 安装[hereku cli](https://devcenter.heroku.com/articles/heroku-cli)
2. 通过[signing up](https://signup.heroku.com/)创建一个heroku账户
3. 运行`heroku login`并且填写你的heroku credentials：
```bash
$ heroku login
```
4. 在项目根目录创建一个`static.json`,填充以下内容:
`static.json`:
```json
{
  "root": "./docs/.vitepress/dist"
}
```
这是你站点的配置,详情[heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static)

5. Set up your Heroku git remote
```bash
# version change
$ git init
$ git add .
$ git commit -m "My site ready for deployment."

# creates a new app with a specified name
$ heroku apps:create example

# set buildpack for static sites
$ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
```
6. 部署
```bash
# publish site
$ git push heroku main

# opens a browser to view the Dashboard version of Heroku CI
$ heroku open
```

### vercel
要使用[vercel for git](https://vercel.com/docs/concepts/git)部署你的vitepress应用, 首先确保你的vitepress应用已经push到git仓库。

访问<https://vercel.com/new>，并且使用git选项(GitHub,GitLab或BitBucket)将你的vitepress项目导入到vercel。跟随窗口选择项目的根目录并且使用`yarn docs:build`或`npm run docs:build`覆盖构建步骤，使用`./docs/.vitepress/dist`来覆盖输出目录.
![](https://vitepress.vuejs.org/assets/vercel-configuration.e8badd11.png)

在你的项目导入之后，所有后续推送到分支将生成预览部署，并且对生产分支（通常为“main”）所做的所有更改都将导致生产部署。

一旦部署成功，你将会得到一个链接来访问你的站点，比如https://vitepress.vercel.app。

## 进阶
### frontmatter
任何包含YAML frontmatter块的markdown文件将会由[gray-matter](https://github.com/jonschlinkert/gray-matter)处理。frontmatter必须放在markdown文件的顶部，并且必须使用有效的YAML格式写在虚线之间，比如:
```md
---
title: Docs with vitepress
editLink: true
---
```
在虚线之间你可以设置[预定义变量](#预定义变量),或者甚至创建自己的自定义变量。这些变量可通过指定的`$frontmatter`变量来访问

例如下面markdown文件
```md
---
title: Docs with vitepress
editLink: true
---

# {{ $frontmatter.title }}

Guide content
```
#### 可选的frontmatter格式
vitepress也支持JSON frontmatter语法:
```md
---
{
  "title": "Blogging Like a Hacker",
  "editLink": true
}
---
```
#### 预定义变量
##### title
- 类型：`string`
- 默认值：`h1_title || siteData.title`
当前页面的标题
#### head
- 类型：`array`
- 默认值：`undefined`
指定需要额外注入的head标签
```yaml
---
head:
  - - meta
    - name: description
      content: hello
  - - meta
    - name: keywords
      content: super duper SEO
---
```
#### navbar
- 类型：`boolean`
- 默认值：`undefined`
你可通过`navbar: false`来禁用指定页面的navbar
#### sidebar
- 类型：`boolean|'auto'`
- 默认值：`undefined`
你可通过`sidebar: false`来禁用指定页面的sidebar, 或通过`sidebar: ‘auto'`在指定页面显示sidebar
#### editLink
- 类型：`boolean`
- 默认值：`undefined`
定义是否在指定页面底部显示一个编辑链接

### theme
#### 使用自定义主题
你可通过添加`.vitepress/theme/index.js`文件(theme的入口文件)来启用自定义主题
```bash
.
├─ docs
│  ├─ .vitepress
│  │  ├─ theme
│  │  │  └─ index.js
│  │  └─ config.js
│  └─ index.md
└─ package.json
```
一个vitepress自定义主题仅仅只是个简单的对象，它包含三个属性：
```ts
interface Theme {
  Layout: Component // Vue 3 component
  NotFound?: Component
  enhanceApp?: (ctx: EnhanceAppContext) => void
}

interface EnhanceAppContext {
  app: App // Vue 3 app instance
  router: Router // VitePress router instance
  siteData: Ref<SiteData>
}
```
theme入口文件(`./vitepress/theme/indexjs`)应该默认导出theme对象:
```js
// .vitepress/theme/index.js
import Layout from './Layout.vue'

export default {
  Layout,
  NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData` is a `ref` of current site-level metadata.
  }
}
```
`Layout`组件可能看起来长这样:
```vue
<!-- .vitepress/theme/Layout.vue -->
<template>
  <h1>Custom Layout!</h1>
  <Content /><!-- this is where markdown content will be rendered -->
</template>
```
自定义主题仅能默认导出。在你的自定义主题中，它就像是一个普通的vite + vue3应用一样工作着。同样注意theme也需要[兼容ssr](#浏览器API访问限制)。

如果要发布一个主题，只需要在你的包入口文件中导出theme对象即可。
如果要使用一个外部(第三方)主题，只需要在主题入口文件导入主题，然后重新导出它即可:
```js
// .vitepress/theme/index.js
import Theme from 'awesome-vitepress-theme'
export default Theme
```
#### 扩展默认主题
如果你想要**扩展和自定义**默认主题，你可以从`vitepress/theme`中导入默认主题，并且在自定义主题入口文件中增强它即可。下面是几个自定义主题的例子：
##### 注册全局组件
```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('MyGlobalComponent' /* ... */)
  }
}
```
因为我们使用的是vite,你也可以使用vite的[glob import feture](https://vitejs.dev/guide/features.html#glob-import)来自动注册一个组件目录。
##### 自定义css
默认主题的css可通过覆盖根级别的css变量来自定义:
```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```
```css
/* .vitepress/theme/custom.css */
:root {
  --c-brand: #646cff;
  --c-brand-light: #747bff;
}
```
[点击查看可以被覆盖的默认主题css变量](https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css)

##### 布局插槽
默认主题的`<Layout />`组件有一些slots,这些slots可以被用来在页面的指定位置注入内容。这里有个在sidebar顶部注入组件的例子：
```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that injects the slots
  Layout: MyLayout
}
```
```vue
<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #sidebar-top>My custom sidebar top content</template>
  </Layout>
</template>
```
下面是默认主题layout组件中所有可用的slots:
- navbar-search
- sider-top
- sider-bottom
- page-top-ads
- page-top
- page-bottom
- page-bottom-ads
- 仅当 `home: true` 通过 frontmatter 启用时:
  - home-hero
  - home-features
  - home-footer

### API Reference
#### helper methods
以下方法可从`vitepress`中全局导入，并且一般会使用在自定义主题vue组件中。然而，它们也可用在`.md`页面中，因为markdown文件最终会被编译为vue单文件组件。

以`use*`开头的方法表明它是一个vue3 composition API函数，意味着它们仅能在`setup()`函数或`<script setup>`中使用。

##### `useData`
返回指定页面数据。返回对象如下结构:
```js
interface VitePressData {
  site: Ref<SiteData>
  page: Ref<PageData>
  theme: Ref<any> // themeConfig from .vitepress/config.js
  frontmatter: Ref<PageData['frontmatter']>
  title: Ref<string>
  description: Ref<string>
  lang: Ref<string>
  localePath: Ref<string>
}
```
例如:
```vue
<script setup>
import { useData } from 'vitepress'
const { theme } = useData()
</script>

<template>
  <h1>{{ theme.heroText }}</h1>
</template>
```
##### `useRoute`
返回下面结构的当前路由对象:
```ts
interface Route {
  path: string
  data: PageData
  component: Component | null
}
```
##### `useRouter`
返回vitepress router实例, 所以你可以使用编程式导航到其他页面:
```ts
interface Router {
  route: Route
  go: (href?: string) => Promise<void>
}
```
##### `withBase`
- 类型: (path: string) => string
给指定的url path附加配置的`base`

#### 全局组件
vitepress自带一些内置组件，这些内置组件可在全局使用。你可在markdown文件或者你的自定义主题配置中使用它们。
##### `<Content />`
`<Content />`组件用于显示已渲染的markdown内容。当[创建你自己的主题](#使用自定义主题)时非常有用。
```vue
<template>
  <h1>Custom Layout!</h1>
  <Content />
</template>
```
##### `<ClientOnly/>`
`<ClientOnly/>`组件仅会在客户端渲染它的插槽。

因为vitepress应用在构建静态生成时是服务端渲染的，所以任何vue的用法必须遵守vue的服务端渲染。总之，确保仅在`beforeMount`或`mounted`钩子中访问BOM/DOM APIs。

如果你正在使用或演示的组件对服务端渲染不友好(比如，包含自定义指令),你就可以将它们包裹在`<ClientOnly/>`组件中。
```html
<ClientOnly>
  <NonSSRFriendlyComponent />
</ClientOnly>
```
### 和vuepress的区别
详见[vitepress和vuepress的区别](https://vitepress.vuejs.org/guide/differences-from-vuepress)

## Config Reference
### App Config
::: tip
配置参考不完整，因为配置格式可能仍会收到进一步的更改。有关当前可用选项的完整参考，请参阅 [config.ts](https://github.com/vuejs/vitepress/blob/45b65ce8b63bd54f345bfc3383eb2416b6769dc9/src/node/config.ts#L30-L65)
:::
#### base
- 类型: string
- 默认: /
站点部署的基础URL。如果您计划在服务器子路径下部署您的站点，您将需要设置此项。否则，你不需要设置该项。
```js
module.exports = {
  base: '/base/'
}
```
#### lang
- 类型: string
- 默认: en-US
用于站点的`lang`属性。这将在页面html中以`<html lang="en-US">`渲染
```js
module.exports = {
  lang: 'zh-CN'
}
```
#### title
- 类型: string
- 默认: VitePress
网站标题。这将是所有页面标题的后缀，并显示在导航栏中。
```js
module.exports = {
  title: 'VitePress'
}
```
#### description
- 类型: string
- 默认: A VitePress site
网站描述。这将在页面html中以`<meta>`标签渲染。
```js
module.exports = {
  description: 'A VitePress site'
}
```
### Theme Config
#### Homepage
VitePress 提供主页布局。要使用它，请在根 `index.md` 的 `YAML frontmatter` 中指定 `home: true` 以及其他一些元数据。这是它如何工作的示例：
```yaml
---
home: true
heroImage: /logo.png
heroAlt: Logo image
heroText: Hero Title
tagline: Hero subtitle
actionText: Get Started
actionLink: /guide/
features:
  - title: Simplicity First
    details: Minimal setup with markdown-centered project structure helps you focus on writing.
  - title: Vue-Powered
    details: Enjoy the dev experience of Vue + webpack, use Vue components in markdown, and develop custom themes with Vue.
  - title: Performant
    details: VitePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
footer: MIT Licensed | Copyright © 2019-present Evan You
---
```
#### Algolia Search
`themeConfig.algolia` 选项允许您使用 [Algolia DocSearch](https://docsearch.algolia.com/)。要启用它，您至少需要提供 apiKey 和 indexName：
```js
module.exports = {
  themeConfig: {
    algolia: {
      apiKey: 'your_api_key',
      indexName: 'index_name'
    }
  }
}
```
有关更多选项，请查看 [Algolia DocSearch 的文档](https://docsearch.algolia.com/docs/api/)。您可以将任何额外选项与其他选项一起传递, 比如，传递`searchParameters`:
```js
module.exports = {
  themeConfig: {
    algolia: {
      apiKey: 'your_api_key',
      indexName: 'index_name',
      searchParameters: {
        facetFilters: ['tags:guide,api']
      }
    }
  }
}
```
##### Internationalization (i18n)
如果您的文档中有多个语言环境，并且您在 `themeConfig` 中定义了`locales`对象: 
```js
module.exports = {
  themeConfig: {
    locales: {
      // ...
    },
    algolia: {
      apiKey: 'your_api_key',
      indexName: 'index_name'
    }
  }
}
```
VitePress 会自动将 `lang` *facetFilter* 添加到 `searchParameters.facetFilter` 数组中，并带有正确的语言值。
Algolia 根据 `<html>` 标签上的 `lang` 属性自动添加正确的facet filter, 这将使得搜索结果与当前查看的页面语言相匹配。
#### Carbon Ads
VitePress 内置了对 [Carbon Ads](https://www.carbonads.net/) 的原生支持。通过在配置中定义 Carbon Ads 凭据， VitePress 将在页面上展示广告。
```js
module.exports = {
  themeConfig: {
    carbonAds: {
      carbon: 'your-carbon-key',
      custom: 'your-carbon-custom',
      placement: 'your-carbon-placement'
    }
  }
}
```