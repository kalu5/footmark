# Webpack5.x

## 一、为什么要使用webpack 

### 发展历史

**传统开发模式**
1. 引用一些脚本来存放每个功能，此解决方案很难扩展，因为加载太多脚本会导致网络瓶颈。
2. 使用一个包含所有项目代码的大型 .js 文件，但是这会导致作用域、文件大小、可读性和可维护性方面的问题。

**发展过程**

IIFE 使用方式产生出 Make, Gulp, Grunt, Broccoli 或 Brunch 等工具。这些工具称为任务执行器，它们将所有项目文件拼接在一起。

但是，修改一个文件意味着必须重新构建整个文件。拼接可以做到很容易地跨文件重用脚本，但是却使构建结果的优化变得更加困难。如何判断代码是否实际被使用？

即使你只用到 lodash 中的某个函数，也必须在构建结果中加入整个库，然后将它们压缩在一起。如何 treeshake 代码依赖？难以大规模地实现延迟加载代码块，这需要开发人员手动地进行大量工作。

Nodejs诞生，CommonJS模块，在浏览器上无法运行

因而产生了 Browserify, RequireJS 和 SystemJS 等打包工具，允许我们编写能够在浏览器中运行的 CommonJS 模块。

ESM - ECMAScript 模块，而浏览器支持不完整，版本迭代速度也不够快


是否可以有一种方式，不仅可以让我们编写模块，而且还支持任何模块格式（至少在我们到达 ESM 之前），并且可以同时处理资源和资产？

**这就是 webpack 存在的原因。它是一个工具，可以打包你的 JavaScript 应用程序（支持 ESM 和 CommonJS），可以扩展为支持许多不同的静态资源，例如：images, fonts 和 stylesheets。**

## 二、内部原理

**打包，是指处理某些文件并将其输出为其他文件的能力。但是，在输入和输出之间，还包括有 模块, 入口起点, chunk, chunk 组和许多其他中间部分**

在打包过程中，模块会被合并成 chunk。 chunk 合并成 chunk 组，并形成一个通过模块互相连接的图(ModuleGraph)。

## 三、基础配置

### 3.1、开发模式
开发模式不会生产dist，是在内存中编译打包的

1. 编译代码，使浏览器能识别运行（处理样式、字体、图片、html资源等）
2. 代码质量检查，树立代码规范

### 3.2、Loader

使用 loader 对文件进行预处理。你可以构建包括 JavaScript 在内的任何静态资源。

### 3.3、Plugin

扩展webpack功能

1. 使用EslintWebpackPlugin对代码编译前进行语法检查

### 3.4、总结

0. (HtmlWebpackPlugin)该插件将为你生成一个 HTML5 文件， 在 body 中使用script 标签引入你所有 webpack 生成的 bundle。
1. 编译前使用eslint进行代码检查（ESLintPlugin）
2. 使用loader处理不同类型的文件
3. 开发环境搭建devServer
4. 生产环境处理css兼容性（postCss）
5. 生产环境提取css文件（MiniCssExtractPlugin）
6. 生产环境压缩css文件（CssMinimizerPlugin）

## 四、优化

### 4.1、提升开发体验

#### SourceMap（首次和二次构建速度不一样）

开发环境eval-cheap-module-source-map --> 打包速度和完整的第几行的提示
生产环境cheap-module-source-map  --> 更加好的代码提示 --> 生成map文件与main映射
``` js
/**
   * cheap: 提示哪一行出了问题，不管列
   * module: 第三方模块错误加提示
   * eval: 不会生成map文件，生产eval（）文件映射main.js, 打包速度快
  */
devtool: 'eval-cheap-module -source-map'

```
### 4.2、提升打包构建速度

#### 4.2.1、HMR: 热模块替换（当某个模块变更时只更新变更的模块），提升开发构建速度，只能用于开发环境

1. webpackDevServer自动刷新
保存代码页面刷新一次
速度较慢
整个页面状态丢失（变量，输入的值，路由）

2. HMR热更新
新代码生效
网页不刷新
状态不丢失

**注意：**

1. js文件需要单独判断
``` js
 // index.js
 if (module.hot) {
   module.hot.accept('./print.js', function() {
     console.log('Accepting the updated printMe module!');
     printMe();
   })
 }
```
2. css文件styleLoader和cssLoader已经处理
3. vue/react文件vueLoader/reactHotLoader

#### 4.2.2、OneOf

每个文件只能被一个loader处理

``` js
{
  oneOf: [
    {
      test: /\.[jt]sx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'esbuild-loader',
      options: {
        // JavaScript version to compile to
        target: 'es2015'
      }
    },
    {
      test: /\.css$/i,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
    {
      test: /\.less$/i,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // 将 JS 字符串生成为 style 节点
        'style-loader',
        // 将 CSS 转化成 CommonJS 模块
        'css-loader',
        // 将 Sass 编译成 CSS
        'sass-loader',
      ],
    },
    // 图片
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset',
      // 小于某个大小的图片转为base64
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024
        }
      },
      // 输出到指定文件

    },
    //字体.mp3/mp4
    {
      test: /\.(woff|woff2|eot|ttf|otf|mp3|mp4)$/i,
      type: 'asset/resource'
    }
  ]
}
```

#### 4.2.3、exclude / include

处理js或者eslint时排除nodemodules中的文件

``` js
{
  test: /\.[jt]sx?$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'esbuild-loader',
  options: {
    // JavaScript version to compile to
    target: 'es2015'
  }
}
```

#### 4.2.4、cache 缓存js和eslint处理，提升二次构建速度

``` js
// js开启
const jsRule = {
  test: /\.[jt]sx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      cacheDirectory: true, // 开启缓存
      cacheCompression: false, // 关闭缓存文件压缩
    }
  }
}

// eslint开启
const eslintOption = {
  // 检查哪些文件
  context: path.resolve(__dirname, '../src'),
  exclude: "node_modules", // 默认
  cache: true, // 开启缓存
  cacheLocation: path.resolve(
    __dirname,
    "../node_modules/.cache/eslintCache"
  )
}
```

#### 4.2.5、Thead多进程打包（主要处理js, 仅在特别耗时的操作中使用，每个进程启动大约600ms左右开销）

``` js
const os = require('os')

// 当前电脑进程数量
const threads = os.cpus().length

// eslint Option
const eslintOption = {
  // 检查哪些文件
  context: path.resolve(__dirname, '../src'),
  exclude: "node_modules", // 默认
  cache: true, // 开启缓存
  cacheLocation: path.resolve(
    __dirname,
    "../node_modules/.cache/eslintCache"
  ),
  threads, // 开启多进程和进程数量
}

const jsRule = {
  test: /\.[jt]sx?$/,
  exclude: /(node_modules|bower_components)/,
  use: [
    {
      loader: 'thread-loader',
      options: {
        worker: threads, //进程数量
      }
    },
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        cacheDirectory: true, // 开启缓存
        cacheCompression: false, // 关闭缓存文件压缩
      }
    }
  ]
}

// 多进程压缩代码自定义配置
optimization: {
  runtimeChunk: 'single',
  // 压缩相关
  minimize: true,
  minimizer: [
    new CssMinimizerPlugin(),
    new TerserWebpackPlugin({
      parallel: threads, // 开启多进程
    })
  ]
}

```


### 4.3、减少代码体积

#### 4.3.1、Tree Shaking （Es Module, 生产环境自动开启）

只打包使用的资源


#### 4.3.2、优化Babel处理后的代码体积（babel会为每个文件添加辅助代码，将辅助代码作为一个独立的模块，避免重复引入）

使用@babel/plugin-transform-runtime
``` js
const jsRule = {
  test: /\.[jt]sx?$/,
  exclude: /(node_modules|bower_components)/,
  use: [
    {
      loader: 'thread-loader',
      options: {
        worker: threads, //进程数量
      }
    },
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        cacheDirectory: true, // 开启缓存
        cacheCompression: false, // 关闭缓存文件压缩
        plugins: ["@babel/plugin-transform-runtime"] // 减少代码体积
      }
    }
  ]
```


#### 4.3.3、压缩图片（无损压缩）

ImageMinimizerWebpackPlugin


### 4.4、优化代码运行性能

#### 4.4.1、Code Split

1. 为什么要代码分割
打包代码时会将所有js文件打包到一个文件中，体积太大，如果我们只要渲染首页，就应该只加载首页的js文件，其他文件不加载

所以我们需要将打包生成的文件进行代码分割，生成多个js文件，渲染某个页面就只加载某个页面js文件，这样加载资源就少，速度就快

2. 代码分割主要做的两件事情
分割文件
按需加载

``` js
// 代码分割
splitChunks: {
  chunks: 'all'
}
```

3. 动态引入的模块会单独分割为一个模块，需要时动态加载

#### 4.4.2、preload / preFetch

#### 4.4.3、缓存优化

1. 使用contenthash当文件内容变化才改变
2. 配置runtimeChunk提取公共依赖的文件hash，当公共文件变化时，依赖的模块不会变化

``` js
output: {
  filename: 'js/[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
  assetModuleFilename: 'images/[contenthash:8][ext][query]',
  // 在打包前将path整个目录清空
  clean: true,
  // 确保文件资源serve到自定义的服务器上
  publicPath: '/'
},
optimization: {
  runtimeChunk: 'single'
}

```

#### 4.4.4、解决js兼容性问题

1. corejs 手动配置

``` js
// 全部加载
import 'core-js'

// 按需加载
import 'core-js/es/promise'
```

2. 使用babel预设

``` js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 按需自动引入
        corejs: 3
      }
    ]
  ]
}
```

#### 4.4.5、PWA 离线也能正常使用


## 五、React配置注意事项

### 5.1、处理jsx使用babel-babel-preset-react-app

安装依赖：

``` bash
pnpm add -D babel-loader @babel/core babel-preset-react-app
```

配置：bable.config.js
``` js
module.exports = {
  "presets": ["react-app"]
}
```

### 5.2、eslint配置使用eslint-config-react-app

安装依赖：

``` bash
pnpm add -D eslint-config-react-app eslint eslint-webpack-plugin
```

配置：.eslintrc.js
``` js
module.exports = {
  extends: ['react-app'],
  parserOptions: {
    babelOptions: {
      presets: [
        // 解决页面报错
        ['babel-preset-react-app', false],
        'babel-preset-react-app/prod'
      ]
    }
  }
}
```

### 5.3、react组件HMR使用react-refresh-webpack-plugin

安装依赖：

``` bash
pnpm add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

配置：.eslintrc.js
``` js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// ... your other imports
 
module.exports = {
  // ... other configurations
  plugins: [
    // ... other plugins
    !isProd && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  module: {
    rules: [
      {
        {
          test: /\.jsx?$/i,
          include: path.resolve(__dirname, '../src'),
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: threads
              }
            },
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                plugins: [!isProd && require.resolve('react-refresh/babel')].filter(Boolean),
              }
            }
          ]
        },
      }
    ]
  }
};
```

### 5.4、dev环境刷新路由404(dev默认是访问dist下的资源，需要配置找不到重定向index.html)

``` js
devServer: {
  port: 3000,
  hot: true,
  open: true,
  historyApiFallback: true, //前端路由刷新404
}
```

### 5.5、路由懒加载，分割不同路由组件

``` js
import React, { Suspense, lazy } from 'react'


import { Link, Routes, Route } from 'react-router-dom'

// import About from './pages/About/index'
// import Home from './pages/Home/index'

const About = lazy(() => import(/*wepackChunkName:'AboutJSX'*/'./pages/About/index'))
const Home = lazy(() => import(/*wepackChunkName:'HomeJSX'*/'./pages/Home/index'))

export default function App () {
  return (
    <>
    <h5>Hello React Webapck ！!！！！！</h5>

    <ul>
      <li>
        <Link to="/home"> Home22 </Link>
      </li>
      <li>
        <Link to="/about">About44</Link>
      </li>
    </ul>

    <Suspense>
    <Routes>
      <Route path='/home' element={<Home />} ></Route>
      <Route path='/about' element={<About />} ></Route>
    </Routes>
    </Suspense>
    </>
    
  )
}
```

### 5.6、复制public下的资源到dist下，使用copyWebpackPlugin

安装依赖：

``` bash
pnpm add -D copy-webpack-plugin
```

配置：
``` js
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, '../public'), 
          to: path.resolve(__dirname, '../dist'), 
          globOptions: { // 忽略html
            ignore: ["**/index.html"]
          } 
        },
      ],
    }),
  ],
};
```

### 5.7、将node_modules中的包进行分割

``` js
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    // react react-dom react-router-dom
    react: {
      test: /[\\/]node_modules[\\/]react(.*)?/,
      name: 'chunk-react',
      priority: 40
    },
    // antd
    antd: {
      test: /[\\/]node_modules[\\/]antd/,
      name: 'chunk-antd',
      priority: 30
    },
    lib: {
      test: /[\\/]node_modules[\\/]/,
      name: 'chunk-other',
      priority: 20
    }
  }
}
```

### 5.8、关闭性能分析，提升打包速度

``` js
performance: false // 关闭性能分析，提升打包速度
```

## 六、开发loader

**loader可以配置优先级**

pre > normal > inline > post

**loader的执行顺序**

从右到左，从上到下

### 6.1、loader就是一个函数，当webpack解析资源时，去调用相应的loader去处理

``` js
/**
 * map: sourceMap
 * meta: 其他loader传递的参数
 * content: 文件内容
*/
module.exports = funciton (content, map, meta) {
  // 处理传入的文件内容后返回
  console.log (content)

  return content
}

```

### 6.2、loader的分类

1. 同步loader （同步loader中不能进行异步loader）

``` js
module.exports = function (content, map, meta) {
  return content
}

module.exports = function (content, map, meta) {
  // null 具体错误信息
  this.callback(null, content, map, meta)
}
```
2. 异步loader

``` js
module.exports =function (content, map, meta) {
  const callback = this.async()
  setTimeout(() => {
    callback(null, content, map, meta)
  })
}
```

3. raw loader （接收到的数据是buffer数据）， 处理图片、图标、字体等

``` js
module.exports = function (content, map, meta) {
  return content
}
module.exports.raw = true
```

4. pitch loader


``` js
module.exports = function (content, map, meta) {
  return content
}
// 在loader执行之前优先执行, 如果有return后面的pitch和loader都不执行

/** <------------------------------------------
 * 
 *  loader1     loader2      loader3          |
 * 
 *  pitch1      pitch2       pitch3           |
 * 
 * 执行顺序------------------------------------>
*/
module.exports.pitch = function () {

}
```

## 七、插件

扩展webpack功能，在每个钩子中插入事件改变webpack执行，使webpack能力增强


1. Tapable 注册钩子

tab: 同步和异步钩子
tapAsync: 回调的方式注册异步钩子
tapPromise: promise方式注册异步钩子

2. Compiler 访问webpack的主环境配置

compiler.options 所有配置
compiler.inputFileSystem 文件处理
compiler.hooks   注册钩子

3. Compilation 资源的构建，对所有资源进行编译处理

### 7.1、基础插件

``` js

/**
 * 1. webpack加载webpack.config.js所有配置，此时就会new Plugin,执行constructor
 * 2. webpack创建compiler对象
 * 3. 遍历所有的plugins中的插件，调用插件的apply方法
 * 4. 执行剩下的编译流程（触发各个hooks事件）
*/
class Plugin {
  constructor(opt = {}) {
    this.options = opt
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('BannerWebpackPlugin', (compilation, callback) => {
      const extensions = ["css", 'js']
      // 获取即将输出的资源
      let files = compilation.assets
      // 过滤，只保留js和css资源
      const assets = Object.keys(files).forEach(assetPath => {
        const extArr = assetPath.split('.')
        const ext = extArr[extArr.length - 1]
        return extensions.includes.includes(ext)
      })

      // 追加的内容
      const prefix = `/**
      * Author: ${this.options.author}
      */
      `

      // 遍历剩下资源添加注释
      assets.forEach(asset => {
        // 获取源资源
        const fileSource = compilation.assets[asset].source()
        // 添加前缀
        const content = prefix + fileSource
        // 修改最终输出资源，必须定义size
        compilation.assets[asset] = {
          source() {
            return content
          },
          size() {
            return content.length
          }
        }
      })
      callback()
    })
  }
}
module.exports = Plugin
```
