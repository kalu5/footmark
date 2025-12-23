# 小程序开发

## 一、技术选型

### 核心概念：什么是小程序？
首先，我们需要明确“小程序”的范畴。它主要分为两大阵营：

平台原生小程序：运行在超级App（如微信、支付宝、抖音）内的轻量级应用，无需下载安装，即用即走。

跨端框架小程序：使用一套代码，通过编译工具转换成各平台原生小程序代码的解决方案。

### 我们的技术选型主要围绕这两大方向展开。

#### 平台原生小程序开发
这是最基础、最稳定、性能最好的方式。直接使用各个平台提供的官方语言、框架和IDE进行开发。

1. 微信小程序
技术栈： WXML（模板语言） + WXSS（样式语言） + JavaScript/TypeScript + 微信小程序API。

优点：

性能最佳：直接运行在微信环境中，无额外抽象层。

功能最全：能第一时间使用微信官方提供的最新API和能力。

文档和社区最完善：作为开创者，拥有最庞大的开发者社区和丰富的学习资源。

官方工具成熟：微信开发者工具功能强大，提供调试、预览、上传等一站式服务。

缺点：

平台锁定：代码只能在微信生态内运行，无法直接迁移到其他平台。

技术栈独特：需要学习平台特定的WXML和WXSS。

2. 支付宝小程序、字节跳动小程序、百度小程序等
技术模型与微信小程序高度相似，都是模板 + 样式 + JS + 平台API的结构。

优点：能深度集成各自平台的特有能力（如支付宝的支付、信用；抖音的内容、推荐）。

缺点：与微信小程序一样，存在平台锁定和学习成本。

何时选择原生开发？

项目强依赖单一平台生态：例如，严重依赖微信社交关系链或支付宝金融服务。

追求极致性能：对启动速度、页面流畅度有极高要求。

需要使用平台最新的、独家的API。

团队规模小，且专注于一个平台。

### 跨端开发框架
为了解决“多平台重复开发”的痛点，跨端框架应运而生。它们允许开发者使用一套技术栈（如Vue、React）编写代码，然后编译到不同的小程序平台以及Web、App端。

1. Uni-app (Vue 技术栈)
简介： 由DCloud团队开发，是目前国内生态最繁荣、应用最广泛的跨端框架。使用 Vue.js 语法。

优点：

学习成本低： 对于Vue开发者来说几乎零门槛。

生态丰富： 插件市场提供了大量现成的组件和SDK。

多端覆盖能力极强： 一套代码可发布到iOS、Android、Web以及各种小程序（微信、支付宝、抖音、快手、H5等）。

性能良好： 相比其他跨端框架，其编译到小程序的性能损耗很小，接近原生。

缺点：

灵活性有一定限制： 在某些极端复杂的平台特定功能上，可能需要编写条件代码或原生插件。

对Vue 3的支持： 虽然已支持Vue 3，但其核心设计最初围绕Vue 2，部分高级Vue 3特性可能受限。

2. Taro (React/Vue/Nerv 技术栈)
简介： 由京东团队开发，是一个开放式跨端跨框架解决方案。最初支持React，现在也支持Vue。

优点：

技术选型灵活： 支持 React、Vue 等多种框架，适合不同技术背景的团队。

架构先进： Taro 3 之后采用了重运行时架构，更接近真正的React/Vue开发体验，灵活性非常高。

扩展性强： 支持自定义插件和平台扩展。

与React生态结合紧密： 对于React技术栈团队是首选。

缺点：

包体积相对较大： 重运行时架构会带来一定的包体积增加。

学习曲线： 其配置和插件系统对新手有一定复杂度。

3. 美团 MPVue (已停止维护)
注意： 这是一个曾经流行的基于Vue的框架，但已官宣停止维护，新项目不推荐使用。

4. 原生混合开发（Hybrid）
这不是一个框架，而是一种思路。例如，使用 Kbone 这样的库，可以让完整的Web项目（Vue/React）在小程序里运行。

优点： 最大程度复用Web代码。

缺点： 性能损耗大，体验与原生有差距，通常用于非常复杂的、对性能不敏感的页面。

何时选择跨端框架？

需要覆盖多个平台：这是跨端框架的核心价值。

团队技术栈统一：团队熟悉Vue就选Uni-app，熟悉React就选Taro，可以降低学习成本。

开发效率优先：希望用一套代码快速覆盖多端，减少重复劳动。

项目不极度依赖某个平台的独家特性。

### 技术选型决策指南
你可以通过以下流程图来快速定位适合你的技术方案：

flowchart TD
    A[项目启动] --> B{是否需要覆盖<br>多个平台？};
    
    B -- 否，专注单一平台 --> C[选择该平台的<br>原生开发方案];
    
    B -- 是 --> D{团队主要技术栈是？};
    
    D -- Vue / 无明确偏好 --> E[推荐 Uni-app<br>生态成熟，学习成本低];
    D -- React --> F[推荐 Taro<br>架构灵活，与React生态结合好];
    
    E & F --> G[评估并进行<br>可行性验证];
    
    C --> H[追求极致性能<br>与平台深度集成];
    G --> I[提升开发效率<br>实现多端覆盖];

### 总结与表格对比
技术方案	技术栈	优点	缺点	适用场景
微信原生	WXML/WXSS/JS	性能最佳、功能最新、生态成熟	平台锁定、技术栈独特	强依赖微信生态、追求极致性能
Uni-app	Vue	学习成本低、生态丰富、多端能力强	灵活性受限、Vue 3支持需留意	多端需求、Vue技术栈团队、快速开发
Taro	React/Vue	框架灵活、架构先进、扩展性强	包体积稍大、配置稍复杂	多端需求、React技术栈团队、需要高定制性

### 现代开发趋势与建议
TypeScript是标配：无论选择哪种方案，强烈推荐使用TypeScript。它能极大地提升代码的健壮性和可维护性。所有主流框架都对TS有很好的支持。

状态管理：对于复杂应用，需要引入状态管理库。Vue技术栈用 Pinia（Vuex已退役），React技术栈用 Redux Toolkit 或 Zustand。

构建工具：现代跨端框架都基于 Vite 或 Webpack，提供热更新、代码分割等现代化开发体验。

UI组件库：

原生微信： 可使用 WeUI 或 Vant Weapp。

Uni-app： 官方有 uni-ui，社区有 uView 等。

Taro： 可使用 Taro UI 或 NutUI（京东出品）。

### 最终建议：

新手或小团队：如果主要做微信小程序，从微信原生开始学起，打好基础。如果有Vue背景且需要多端，直接上 Uni-app。

成熟团队：根据团队技术栈和项目需求来选。React团队选Taro，Vue团队选Uni-app。对于大型核心业务，如果只在单一平台，依然可以坚持使用原生开发。

决策前务必进行可行性验证（PoC）：用一个简单的页面，在你选定的技术方案上实际开发一遍，评估开发体验、性能表现和是否有无法实现的“坑”。


### 核心决策：跨端框架 vs. 原生开发
在深入跨端框架对比之前，必须先回答这个首要问题：你的项目真的需要/适合跨端吗？

1. 选择跨端框架的核心驱动力：

业务需要同时覆盖多个平台：如微信小程序、支付宝小程序、H5，甚至App。

追求开发效率和成本控制：一套代码多端发布，减少重复劳动。

团队技术栈统一：希望用熟悉的Vue或React技术栈开发小程序。

产品功能非平台强依赖型：核心功能不深度依赖某个平台的独家API。

2. 坚持原生开发的情况：

业务强依赖于单一平台生态：例如，严重依赖微信的社交链或抖音的内容推荐算法。

对性能有极致要求：如复杂的动画、高频交互的页面（如游戏、绘图App）。

需要频繁使用平台最新、最独家的API：跨端框架对官方新API的支持可能有延迟。

#### taro和uniapp对比

##### 核心特性对比
<table>
  <tr>
    <th>
      维度
    </th>
    <th>
     Taro
    </th>
    <th>
     uni-app
    </th>
  </tr>
  <tbody>
    <tr>
      <td>
        技术栈
      </td>
      <td>
        React/Vue/Nerv/Vue3 (主推 React)
      </td>
      <td>
        Vue/Vue3 (原生支持，深度集成)
      </td>
    </tr>
    <tr>
      <td>
        设计哲学
      </td>
      <td>
        技术栈驱动，追求与现代前端开发范式一致
      </td>
      <td>
        业务驱动，追求开发效率和开箱即用
      </td>
    </tr>
    <tr>
      <td>
        核心原理
      </td>
      <td>
        编译时 + 运行时
      </td>
      <td>
        基于 Vue.js 的 运行时编译
      </td>
    </tr>
    <tr>
      <td>
        跨端能力
      </td>
      <td>
        微信/支付宝/百度/字节/QQ/京东小程序、H5、React Native、HarmonyOS、Electron 等
      </td>
      <td>
        微信/支付宝/百度/字节/QQ/快手/飞书小程序、H5、App(weex/uni-appx)、快应用
      </td>
    </tr>
    <tr>
      <td>
        性能
      </td>
      <td>
        引入运行时，包体积稍大，但通过优化和原生支持弥补
      </td>
      <td>
       轻量级运行时，Vue.js 到小程序平台的直接转换，性能表现优秀
      </td>
    </tr>
    <tr>
      <td>
        组件生态
      </td>
      <td>
        1. 官方组件库 (@taro/components)
        2. 丰富的第三方React生态 (如 Taro UI, NutUI)
      </td>
      <td>
        3. 功能丰富的官方组件 (uni-ui)
        4. 插件市场，海量组件和模板
      </td>
    </tr>
    <tr>
      <td>
        学习成本
      </td>
      <td>
        熟悉 React/Vue 本身，需学习 Taro 特有规范和 API
      </td>
      <td>
       	熟悉 Vue 即可，API 与小程序原生高度相似，上手快
      </td>
    </tr>
    <tr>
      <td>
        社区与生态
      </td>
      <td>
        社区活跃，由京东团队主导，社区共同推动，技术氛围浓
      </td>
      <td>
       	生态繁荣，由 DCloud 团队主导，官方插件市场是巨大优势，文档和问答非常完善
      </td>
    </tr>
    <tr>
      <td>
        TypeScript
      </td>
      <td>
        原生支持极佳，与 React 生态完美契合
      </td>
      <td>
       	支持，但体验和生态整合度稍逊于 Taro
      </td>
    </tr>
    <tr>
      <td>
        开放性
      </td>
      <td>
        更开放，易于与第三方库和构建工具集成
      </td>
      <td>
       	相对闭环，提供了从开发到上线的完整云端一体方案
      </td>
    </tr>
  </tbody>
</table>

##### 深入分析与选择场景

###### 何时选择 Taro？
1. 团队技术栈是 React
如果你的团队主要由 React 开发者构成，或者公司内部有成熟的 React 技术体系，Taro 是不二之选。开发者几乎可以无缝迁移他们的技能，使用熟悉的 JSX、Hooks、Redux 等。

2. 追求更现代的前端架构和范式
Taro 的架构更贴近现代前端工程化思想，对 Webpack/Vite 的配置、自定义、与新兴库（如 pnpm, Turborepo）的集成有更好的支持。适合需要深度定制构建流程或实践微前端等复杂场景的团队。

3. 跨端目标包含 React Native
Taro 是少数能同时将代码编译到小程序和 React Native 的框架。如果你的终极目标是“一套代码，同时拥有小程序和原生 App”，且希望 App 部分使用 React Native 生态，Taro 是唯一成熟的选择。

4. 对 TypeScript 有极高要求
Taro 源于京东，对 TypeScript 的支持是“一等公民”，类型定义非常完善，在大型复杂项目中能提供更好的开发体验和代码质量保障。

5. 需要支持 HarmonyOS
Taro 是社区内首个支持鸿蒙生态的框架，如果你有鸿蒙应用的需求，Taro 是目前的领先选择。

###### 何时选择 uni-app？
1. 团队技术栈是 Vue
uni-app 本质上是 Vue 的超集，对 Vue 开发者极其友好。如果你团队擅长 Vue，用 uni-app 开发小程序几乎没有学习成本。

2. 追求极致的开发效率和快速上线
uni-app 的插件市场是其王牌。你需要一个功能（如支付、地图、图表），很可能已经有现成的、经过验证的插件，直接引入即可，能极大缩短开发周期。

3. 跨端目标包含原生 App
uni-app 可以将代码编译成 iOS/Android App（基于 weex 或新的 uni-appx）。其 App 生态非常成熟，有大量的原生插件和云打包服务，对于需要快速从小程序扩展到 App 的场景，uni-app 提供了非常平滑的路径。

4. 项目历史遗留或团队背景复杂
uni-app 对从原生小程序迁移、或者混合开发非常友好。它的 API 设计贴近微信原生，方便老项目迁移或团队成员（如部分成员只懂小程序）快速上手。

5. 需要官方强支持和一站式服务
DCloud 为 uni-app 提供了从 IDE（HBuilderX）、云端打包、推送、统计等一整套商业闭环服务。对于需要稳定商业支持的企业来说，这很有吸引力。

##### 总结与选择建议
你的情况	推荐选择
团队主力是 React / 想用 React	Taro
团队主力是 Vue / 想用 Vue	uni-app
需要开发 React Native App	Taro
需要开发原生 App (非RN)	uni-app
项目非常复杂，重度依赖 TypeScript 和工程化	Taro
追求快速开发、有大量现成组件需求、希望“拿来即用”	uni-app
技术探索型团队，喜欢社区驱动和前沿技术	Taro
业务驱动型团队，追求稳定、高效和商业支持	uni-app
需要支持鸿蒙 HarmonyOS	Taro (目前领先)
最终建议：

没有绝对的好坏，只有是否适合。核心判断依据是团队的技术栈和项目的核心需求。

进行技术选型验证（PoC）。如果条件允许，可以分别用 Taro 和 uni-app 花 1-2 天时间实现一个简单的 demo 页面，亲身体验一下开发流程、文档和生态，团队的感受是最真实的。

考虑长期维护成本。一个框架的社区活跃度、版本更新频率、背后公司的支持力度，都决定了你项目未来 2-3 年的技术生命力。

对于大多数 Vue 技术栈、追求效率和生态完备性的团队，uni-app 是更稳妥、高效的选择。对于 React 技术栈、追求架构灵活性和跨端深度（尤其是 RN）的团队，Taro 是更自然、强大的选择。

### 最终选择trao跨端框架

原因：
1. 团队技术栈为react
2. 有多端需求（目前小程序和h5）
3. 对ts支持更友好（相比于uniapp，uniapp对vue3和ts的支持不太友好）
4. 大厂背书（京东）

## 二、项目架构

### 基本项目搭建使用官方脚手架@tarojs/cli

1. 全局安装tarojs/cli

``` bash
npm install -g @tarojs/cli
```

2. 初始化项目

``` bash
taro init myApp
```

选择react、ts、sass、webpack、基础模板

**注意：**
默认的模板中ts版本为4.5.4,存在冲突，建议修改为5.3.3

### 代码提交检查

Husky + lint-staged

> [Husky](https://typicode.github.io/husky/zh/)

> [lint-staged](https://github.com/lint-staged/lint-staged#readme)


**Husky 的核心作用**

1. 自动化 Git Hooks
Git 本身就提供了 Git Hooks 机制，允许你在特定的重要动作（如 commit、push）发生时触发自定义脚本。但这些脚本默认存储在 .git/hooks 目录下，不会被同步到版本库中，导致每个团队成员都需要手动设置，非常麻烦。

Husky 的价值在于：它让 Git Hooks 的配置变得可管理、可版本化。你可以将 Hooks 的配置（在 package.json 或专门的 .husky 目录中）提交到 Git，这样所有拉取该项目的开发者都会自动拥有完全相同的 Hooks。

2. 强制执行代码规范
这是 Husky 最经典的应用场景。通过在 pre-commit 和 commit-msg 等钩子上挂载任务来实现：

pre-commit 钩子：在代码提交之前自动执行。

典型应用：运行 ESLint 和 Prettier。

好处：自动检查和修复代码格式问题，确保所有提交的代码都符合团队的编码规范。如果检查不通过，提交会被中止，从而防止“脏代码”进入仓库。

示例：在提交前，自动运行 eslint --fix ./src 和 prettier --write .。

commit-msg 钩子：在提交信息被创建后，但提交完成前执行。

典型应用：使用 commitlint 来检查提交信息的格式。

好处：强制要求提交信息遵循 Conventional Commits 等规范，这使得生成清晰易懂的变更日志和自动化版本号成为可能。

示例：要求提交信息格式为 feat: add new login button，如果写成 fixed a bug 则会拒绝提交。

3. 在代码提交前运行测试
典型应用：在 pre-commit 或 pre-push 钩子中运行单元测试。

好处：防止将破坏现有功能的代码提交到仓库，为代码稳定性提供了一层基础保障。对于快速反馈的单元测试，放在 pre-commit 非常有效。

**LintStaged:**

lint-staged 只对即将提交的暂存区（staged）文件运行检查，而不是整个项目，这大大提高了检查速度，尤其是在大型项目中。


**配置：**

1. 安装依赖
``` bash
pnpm add -D lint-staged husky @commitlint/cli @commitlint/config-conventional
```

2. 执行husky install生成.husky文件夹
``` bash
husky install
```

通常配置在脚本中
``` json
"scripts": {
  "prepare": "husky",
}
```

3. 在./husky文件夹中新建pre-commit文件，内容如下
``` sh
npx lint-staged
```

4. package.json中配置lintStaged
``` json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix"
  ],
}
```

5. 在./husky文件夹中新建commit-msg文件，内容如下
``` sh
#!/usr/bin/env sh

# 运行 commitlint 检查 commit message
npx --no -- commitlint --edit ${1}
```
6. 根目录新建commitlint.config.mjs
``` js
export default { extends: ["@commitlint/config-conventional"] };
```
7. 提交代码自动检查代码格式抛出异常部分并检查提交信息是否符合规范阻止提交

### UI框架接入

> [NutUI](https://nutui.jd.com/taro/react/3x/#/zh-CN/guide/intro-react)

**注意：**
1. 项目安装依赖时会默认安装最新的sass导致启动编译报错，需要切换到当前项目对应的版本
2. 编译报错
微信开发者工具报错信息
``` 
app.js错误:
 Error: module 'prebundle/node_modules_taro_weapp_prebundle_style_icon-b6279ff2_css.wxss.js' is not defined, require args is './prebundle/node_modules_taro_weapp_prebundle_style_icon-b6279ff2_css.wxss'
    at q (VM1337 WASubContext.js:1)
    at n (VM1337 WASubContext.js:1)
    at app.js:15
    at VM1337 WASubContext.js:1
    at f.runWith (VM1337 WASubContext.js:1)
    at q (VM1337 WASubContext.js:1)
    at appservice.js:7
    at doWhenAllScriptLoaded (getmainpackage.js:7169)
    at Object.scriptLoaded (getmainpackage.js:7204)
    at Object.<anonymous> (getmainpackage.js:7262)(env: Windows,mp,1.06.2504060; lib: 3.11.1)

[JS 文件编译错误] 以下文件体积超过 500KB，已跳过压缩以及 ES6 转 ES5 的处理。
   prebundle/vendors-node_modules_taro_weapp_prebundle_nutui_nutui-react-taro_js.js
```
解决方法：

``` js
  // config / index.js
  // 配置后重新编译
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
```
3. 编译后页面有时不显示，需要重新编译

### 配置快捷访问
``` ts
// config/index.ts
import path from 'path'

alias: {
   '@/components': path.resolve(__dirname, '..', 'src/components'),
   '@/utils': path.resolve(__dirname, '..', 'src/utils'),
 },
```

### 配置ts严格类型检查

``` json
{
  "noImplicitAny": true,
  "strictNullChecks": true,
}
```

### 封装请求及相关公共方法（storage/toast）并使用

1. 封装storage
``` ts
import Taro from "@tarojs/taro";

export function setStorage(key: string, value: any) {
  Taro.setStorageSync(key, value)
}

export function getStorage(key: string) {
  return Taro.getStorageSync(key)
}
```

2. 封装toast
``` ts
import Taro from "@tarojs/taro";

interface IToastOption {
  title?: string;
  duration?: number;
  icon?: "success" | "error" | "loading" | "none";
  mask?: boolean;
}

function toastInstance(options: IToastOption) {
  const { title = '', icon = 'none' } = options || {}
  Taro.showToast({
    title,
    icon,
    duration: 2000,
    mask: true,
  })
}

export default function toast(title: string) {
  toastInstance({
    title
  })
}
```

3. 配置环境变量
``` ts
// .env.development .env.production  .env.test
TARO_APP_API_BASE = 'http://192.168.110.3:8093/dflc/investmentProject'
```

4. 封装fetch
``` ts
import type { TRecord } from '@/typings';
import Taro from '@tarojs/taro';
import toast from '@/utils/toast';
import { getStorage } from './storage';

interface IRequestOption {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: TRecord;
  header?: TRecord;
}

interface IRequestRes<T> {
  data: T;
  message?: string;
  status?: number;
}

const ERROR_TIP = '请求失败，请稍后重试';

const interceptor = (chain: Taro.Chain) => {
  const requestParams = chain.requestParams
  const token = getStorage('token');
  if (token) {
    requestParams.header['Authorization'] = `Bearer ${token}`;
  }
  return chain.proceed(requestParams)
}

class Http {
  private async request<R>(option: IRequestOption) {
    return new Promise<R>((resolve, reject) => {
      const { url, method = 'GET', data = {}, header = {} } = option;

      const BASE_URL = process.env.TARO_APP_API_BASE;
      Taro.addInterceptor(interceptor)
      Taro.request({
        url: `${BASE_URL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header,
        },
        success: (res: Taro.request.SuccessCallbackResult<IRequestRes<R>>) => {
          const { status, data: resData, message } = res.data || {};
          if (status === 200) {
            return resolve(resData);
          }
          toast(message || ERROR_TIP);
          reject(new Error(message || ERROR_TIP));
        },
        fail: (err) => {
          toast(ERROR_TIP);
          reject(err);
        },
      });
    });
  }

  async get<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
    });
  }

  async post<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
      method: 'POST',
    });
  }

  async delete<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
      method: 'DELETE',
    });
  }

  async put<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
      method: 'PUT',
    });
  }
}

export default new Http();
```

5. 封装请求函数
``` ts
import fetch from '@/utils/http';

interface ILoginReq {
  username: string;
  password: string;
}

interface ILoginRes {
  token: string;
  [key: string]: any;
}

// 登录
export async function login(data: ILoginReq) {
  return await fetch.post<ILoginRes>('/sysLoginUser/login', data)
}

// 获取公钥
export async function getRSAPublicKey() {
  return await fetch.get<string>(
    `/sysLoginUser/getRSAPublicKey`,
  );
}

```

6. 使用
``` tsx
import { getRSAPublicKey, login } from "@/apis/user";
import { Button } from "@nutui/nutui-react-taro";
export default function Test() {

  const handleLogin = async() => {
    const res = await login({
      username: 'test',
      password: 'test',
    })
    console.log (res, 'res========')
  }

  const handleGetRSAPublicKey = async() => {
    const res = await getRSAPublicKey()
    console.log (res, 'res====')
  }
  return (
    <>
      <h1 >Test ..</h1>
      <Button onClick={handleLogin} >登 录</Button>
      <Button onClick={handleGetRSAPublicKey} >获取公钥</Button>
    </>
  );
}
```

### 增加全局状态

**技巧：**

在pages中新建页面
``` bash
taro create login
```

**注意:**
react hooks只能在顶层使用（其他地方使用会报错）


1. 安装依赖
``` bash
pnpm add @reduxjs/toolkit react-redux
```

2. 创建store
``` ts
// src/stores/index
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/user';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

```

3. 创建userReducer
``` ts
// src/stores/user/user.ts
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface IUser {
  username: string;
  isAdmin: number;
  unitId: number;
  deptId: number;
}

interface IUserState {
  userInfo: IUser;
}

const initialState: IUserState = {
  userInfo: {
    username: '',
    isAdmin: 0,
    unitId: 0,
    deptId: 0,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state) => {
      state.userInfo = {
        username: 'test',
        isAdmin: 1,
        unitId: 1,
        deptId: 1,
      };
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state?.user?.userInfo;

export default userSlice.reducer;

```

4. 定义全局stores hooks
``` ts
// src/stores/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

```

5. App.tsx中提供store
**注意：**
文件用tsx
``` tsx
import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import '@nutui/nutui-react-taro/dist/styles/themes/default.css';
import { Provider } from 'react-redux';
import { store } from './stores';
import './app.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {});

  // children 是将要会渲染的页面
  return <Provider store={store}>{children}</Provider>;
}

export default App;

```

6. 组件中使用
``` tsx
import { Button } from '@nutui/nutui-react-taro';
import { Text, View } from '@tarojs/components';
import { setUser } from '@/stores/user/user';
import { useAppSelector, useAppDispatch } from '../stores/hooks';

export default function Test() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.userInfo);

  const handleGetUserInfo = async () => {
    dispatch(setUser());
  };
  return (
    <>
      <Text>Test ..</Text>
      <View>{user.username ?? 'test username'}</View>
      <Button onClick={handleGetUserInfo}>获取用户信息</Button>
    </>
  );
}

```

### 路由跳转相关封装

``` ts
import Taro from '@tarojs/taro';

// events 页面间通信接口，用于监听被打开页面发送到当前页面的数据。
export const navigateTo = (url: string, events = {}) => {
  Taro.navigateTo({
    url,
    events,
  });
};

export const switchTab = (url: string) => {
  Taro.switchTab({
    url,
  });
};

export const navigateBack = (delta = 1) => {
  Taro.navigateBack({
    delta,
  });
};

export const redirectTo = (url: string) => {
  Taro.redirectTo({
    url,
  });
};

export const reLaunch = (url: string) => {
  Taro.reLaunch({
    url,
  });
};

```

### 登录流程

登录前置

**存储用户信息：**

用户信息存储在react-redux，需**注意**最新版本的redux使用新语法创建异步的action报错，建议降低版本或者在store外请求，`"@reduxjs/toolkit": "^2.10.1" / "react-redux": "^9.2.0"`; 目前选择在store外请求，具体代码如下

``` ts
// store/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginRes, IUserInfo } from '@/apis/user';
import { AUTH_DATA_KEY } from '@/utils/const';
import { removeStorage, setStorage } from '@/utils/storage';
import { reLaunch } from '@/utils/navigate';
import { RootState } from '../index';

interface AuthState {
  accessToken: string | null;
  userInfo: IUserInfo | null;
  isLoggedIn: boolean;
  expiresIn: number | null;
  refreshExpiresIn: number | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  userInfo: null,
  isLoggedIn: false,
  expiresIn: null,
  refreshExpiresIn: null,
  refreshToken: null,
};

// 计算过期时间
const calculateExpiresIn = (expiresIn: number) => {
  return new Date().getTime() + expiresIn * 1000;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ILoginRes>) => {
      const {
        expiresIn,
        refreshExpiresIn,
        refreshToken,
        accessToken,
        userInfoVo,
      } = action.payload;
      state.accessToken = accessToken;
      state.userInfo = userInfoVo;
      state.isLoggedIn = true;
      state.expiresIn = calculateExpiresIn(expiresIn);
      state.refreshExpiresIn = calculateExpiresIn(refreshExpiresIn);
      state.refreshToken = refreshToken;

      setStorage(AUTH_DATA_KEY, {
        accessToken: accessToken,
        userInfo: userInfoVo,
        expiresIn: calculateExpiresIn(expiresIn),
        refreshExpiresIn: calculateExpiresIn(refreshExpiresIn),
        refreshToken: refreshToken,
      });
    },
    initCredentials: (state, action: PayloadAction<ILoginRes>) => {
      const {
        expiresIn,
        refreshExpiresIn,
        refreshToken,
        accessToken,
        userInfoVo,
      } = action.payload;
      state.accessToken = accessToken;
      state.userInfo = userInfoVo;
      state.isLoggedIn = true;
      state.expiresIn = (expiresIn);
      state.refreshExpiresIn = (refreshExpiresIn);
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userInfo = null;
      state.isLoggedIn = false;
      state.expiresIn = null;
      state.refreshExpiresIn = null;
      state.refreshToken = null;
      removeStorage(AUTH_DATA_KEY);
      reLaunch('/pages/login/index');
    },
  },
});

export const selectAuth = (state: RootState) => state?.auth;
export const { setCredentials, logout, initCredentials } = authSlice.actions;
export default authSlice.reducer;

```

**免登录流程**

登录成功 -> 存储用户信息到storage(statoken/refreshToken/expriseTime)
再次进入 -> 从storage中获取信息，更新到redux(需要判断token是否过期，过期时重新请求刷新token)
  接口请求401：刷新token

每次进入主动检查token是否过期，过期手动刷新token


AuthGuard: 放入App.tsx

App:

``` tsx
// app.tsx
import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import '@nutui/nutui-react-taro/dist/styles/themes/default.css';
import { Provider } from 'react-redux';
import { store } from './stores';
import './app.scss';
import AuthGuard from './components/auth/AuthGuard';

// @ts-ignore
global['crypto'] = {
  // @ts-ignore
  getRandomValues: wx.getRandomValues
}

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {});

  // children 是将要会渲染的页面
  return <Provider store={store}>
    <AuthGuard>{children}</AuthGuard>
  </Provider>;
}

export default App;
```

权限检查组件：

``` tsx
// AuthGuard 
import { useDidShow, useLoad, useUnload } from '@tarojs/taro';
import { PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { selectAuth, setCredentials, logout } from '@/stores/auth/authSlice';
import { getStorage } from '@/utils/storage';
import { AUTH_DATA_KEY } from '@/utils/const';
import { refreshTokenApi } from '@/apis/user';
import { tokenService } from '@/utils/tokenService';

export default function AuthGuard({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch();

  const { isLoggedIn } = useAppSelector(selectAuth);

  useLoad(() => {
    const init = async () => {
      try {
        // 初始化时从本地存储恢复登录状态
        const authData = getStorage(AUTH_DATA_KEY);
        if (authData) {
          const { expiresIn, refreshExpiresIn, refreshToken } = authData;
          const now = Date.now();

          // 检查refreshToken是否过期（30天）
          if (now < refreshExpiresIn) {
            dispatch(setCredentials(authData));

            // 如果token已过期但refreshToken未过期，尝试刷新
            if (now >= expiresIn) {
              // 这里可以触发自动刷新，但需要在组件中处理
              const refreshData = await refreshTokenApi({ refreshToken });
              dispatch(setCredentials(refreshData));
            }
          } else {
            // refreshToken已过期，清除存储
            dispatch(logout());
          }
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    init();
    tokenService.startTokenRefresh();
  });

  useUnload(() => {
    tokenService.stopTokenRefresh();
  });

  useDidShow(() => {
    if (isLoggedIn) {
      tokenService.checkToken();
    } else {
      dispatch(logout());
    }
  });

  return children;
}

```
请求相关

``` ts
import type { TRecord } from '@/typings';
import Taro from '@tarojs/taro';
import toast from '@/utils/toast';
import { store } from '@/stores';
import { logout } from '@/stores/auth/authSlice';
import { tokenService } from '@/utils/tokenService';
import { getStorage } from './storage';
import { AUTH_DATA_KEY } from './const';
import { hideLoading } from './loading';

interface IRequestOption {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: TRecord;
  header?: TRecord;
}

interface IRequestRes<T> {
  data: T;
  message?: string;
  status?: number;
}

const ERROR_TIP = '请求失败，请稍后重试';
let retryCount = 3;

// 请求白名单
const whiteList = ['/sysLoginUser/wechatLogin', '/sysLoginUser/wechatPhoneLogin'];

function isWhiteList(url: string) {
  return whiteList.some(item => url.indexOf(item) > -1);
}

const interceptor = async (chain: Taro.Chain) => {
  const requestParams = chain.requestParams;
  const isValid = await tokenService.ensureValidToken();
  if (!isValid && !isWhiteList(requestParams.url)) {
    hideLoading();
    throw new Error('Authentication required');
  }

  const { accessToken } = getStorage(AUTH_DATA_KEY) || {}
  if (accessToken) {
    requestParams.header['Cookie'] = `satoken=${accessToken}`;
  }
  return chain.proceed(requestParams);
};

class Http {
  private async request<R>(option: IRequestOption) {
    return new Promise<R>((resolve, reject) => {
      const { url, method = 'GET', data = {}, header = {} } = option;

      const BASE_URL = process.env.TARO_APP_API_BASE;
      Taro.addInterceptor(interceptor);
      Taro.request({
        url: `${BASE_URL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header,
        },
        success: async (
          res: Taro.request.SuccessCallbackResult<IRequestRes<R>>
        ) => {
          const { status, data: resData, message } = res.data || {};
          if (status === 200) {
            return resolve(resData);
          }
          if (status === 401) {
            // token过期，尝试刷新后重试
            if (retryCount > 0) {
              const isValid = await tokenService.ensureValidToken();
              if (isValid) {
                retryCount -= 1;
                // 使用新的token重试请求
                return this.request({
                  ...option,
                });
              }
            }
            store.dispatch(logout());
          }
          toast(message || ERROR_TIP);
          reject(new Error(message || ERROR_TIP));
        },
        fail: (err) => {
          toast(ERROR_TIP);
          reject(err);
        },
      });
    });
  }

  async get<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
    });
  }

  async post<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
      method: 'POST',
    });
  }

  async delete<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
      method: 'DELETE',
    });
  }

  async put<R>(url: string, data?: TRecord) {
    return await this.request<R>({
      url,
      data,
      method: 'PUT',
    });
  }
}

export default new Http();


```

TokenService
``` ts
import { refreshTokenApi } from '@/apis/user';
import { store } from '@/stores';
import { setCredentials, logout } from '@/stores/auth/authSlice';
import { getStorage } from './storage';
import { AUTH_DATA_KEY } from './const';

async function checkAndRefreshToken() {
  const authData = getStorage(AUTH_DATA_KEY)
  const { expiresIn, refreshExpiresIn, refreshToken } = authData || {};

  // 如果没有token信息，直接返回
  if (!expiresIn || !refreshExpiresIn) {
    return null;
  }

  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // 检查refreshToken是否过期
  if (now >= refreshExpiresIn) {
    // refreshToken已过期，需要重新登录
    store.dispatch(logout());
    throw new Error('Refresh token expired');
  }

  // 检查token是否即将过期（5分钟内）
  if (expiresIn - now <= fiveMinutes) {
    // 刷新token
    const refreshData = await refreshTokenApi({
      refreshToken: refreshToken as string,
    });
    store.dispatch(setCredentials(refreshData));
  }

  return true;
}

class TokenService {
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 2 * 60 * 1000; // 2分钟检查一次

  startTokenRefresh() {
    // 立即检查一次
    this.checkToken();

    // 定时检查
    this.refreshInterval = setInterval(() => {
      this.checkToken();
    }, this.CHECK_INTERVAL);
  }

  stopTokenRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  async checkToken() {
    try {
      await checkAndRefreshToken();
    } catch (error) {
      // token刷新失败，可能需要重新登录
      throw error;
    }
  }

  // 手动刷新token（在发起API请求前调用）
  async ensureValidToken(): Promise<boolean> {
    try {
      const res = await checkAndRefreshToken();
      return Boolean(res);
    } catch (error) {
      return false;
    }
  }
}

export const tokenService = new TokenService();

```


1. 手机号登录: 使用原生的button / e.detail.errMsg === 'getPhoneNumber:ok' 
``` tsx
import { View, Button, Text } from '@tarojs/components';
import { useAppDispatch } from '@/stores/hooks';
import { ILoginReq, login, phoneLogin } from '@/apis/user';
import { setCredentials } from '@/stores/auth/authSlice';

import './index.scss';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  // 异步登录
  const asyncLogin = async (login: () => Promise<any>) => {
    try {
      setIsLoading(true);
      const data = await login();
      dispatch(setCredentials(data));
      setTimeout(() => {
        switchTab('/pages/index/index');
      }, 500);
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // 获取手机号授权登录
  const handleGetPhoneNumber = async (e: any) => {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 1. 获取微信登录code
      const { code } = e.detail;
      // 2. 发送登录请求
      await asyncLogin(() =>
        phoneLogin({
          phoneCode: code,
        })
      );
    }
  };

  return (
    <View className="login-page">
      <View className="login-content">
      <View className="flex-row-center login-footer">
        <Button
          className="phone-login-btn"
          style={{
            backgroundColor: 'rgba(242, 243, 255, 1)',
            border: 'none',
            outline: 'none',
            backgroundImage: `url(${phoneIcon})`,
          }}
          openType="getPhoneNumber"
          type="primary"
          onGetPhoneNumber={handleGetPhoneNumber}
          loading={isLoading}
          disabled={isLoading}
        ></Button>
      </View>
    </View>
  );
};
export default LoginPage;

```

2. 账号密码登录
   
**注意兼容性问题：**
1. 密码加密不支持使用RSA加密-JSEncrypt, 依赖web端的crypto, 报错（CryptoJS is not undefined）
2. 密码加密使用AES因为web端和小程序端获取随机加密数据的方法不同, 小程序端设置如下
   **注意Iv使用16位纯数字，不然前后端解密失败**

App.tsx中配置
``` tsx
// @ts-ignore
global['crypto'] = {
  // @ts-ignore
  getRandomValues: wx.getRandomValues
}
```

具体加密实现

``` json
"crypto-js": "^4.2.0",
"@types/crypto-js": "^4.2.2",
```

```ts
import CryptoJS from 'crypto-js'

function generateIv() {
  const random = Math.floor(Math.random() * 10);
  return new Date().getTime().toString() + (random < 10 ? `0${random}` : random)  + '6';
}

function aesEncrypt(password: string) {
  const publicKey = process.env.TARO_APP_KEY;
  const key = CryptoJS.enc.Utf8.parse(publicKey ?? '');
  const iv = CryptoJS.enc.Utf8.parse(generateIv());

  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
  return {
    iv: iv.toString(),
    encrypted
  }
}

export default aesEncrypt;
```

登录流程：

``` tsx
import { View, Button, Text, Image } from '@tarojs/components';
import { Form, Input, Button as NutButton } from '@nutui/nutui-react-taro';
import { useAppDispatch } from '@/stores/hooks';
import { ILoginReq, login, phoneLogin } from '@/apis/user';
import { setCredentials } from '@/stores/auth/authSlice';
import { switchTab } from '@/utils/navigate';
import { useState, useRef } from 'react';
import { Eye, Marshalling } from '@nutui/icons-react-taro';

import './index.scss';
import logo from '@/assets/images/logo.png';
import phoneIcon from '@/assets/images/phone.png';
import toast from '@/utils/toast';
import aesEncrypt from '@/utils/aes';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState('password');
  const passwordRef = useRef(null);

  // 异步登录
  const asyncLogin = async (login: () => Promise<any>) => {
    try {
      setIsLoading(true);
      const data = await login();
      dispatch(setCredentials(data));
      setTimeout(() => {
        switchTab('/pages/index/index');
      }, 500);
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (values: ILoginReq) => {
    const { userName, password } = values;
   
    if (!userName) {
      toast('请输入账号');
      return false;
    }
    if (!password) {
      toast('请输入密码');
      return false;
    }
    return true;
  };

  // 账号密码登录
  const submitSucceed = async (values: ILoginReq) => {
    // @ts-ignore
    const password = passwordRef?.current?.nativeElement?.value;
    if (!validateForm({ ...values, password })) return;
    const { encrypted: aesPassword, iv } = aesEncrypt(password);
    await asyncLogin(() =>
      login({
        userName: values.userName,
        password: aesPassword,
        iv,
      })
    );
  };

  return (
    <View className="login-page">

      <View className="login-content">
        <Form onFinish={(values) => submitSucceed(values)}>
          <Form.Item
            align="center"
            label=""
            className="login-form-item"
            name="userName"
          >
            <Input
              style={{
                '--nutui-input-background-color': 'rgba(243, 243, 243, 1)',
              }}
              placeholder="请输入账号"
              type="text"
            />
          </Form.Item>
          <Form.Item
            align="center"
            className="login-form-item"
            label=""
            name="password"
          >
            <View className="flex-row-between">
              <Input
                style={{
                  '--nutui-input-background-color': 'rgba(243, 243, 243, 1)',
                }}
                type={inputType}
                ref={passwordRef}
                placeholder="请输入密码"
              ></Input>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() =>
                  setInputType(inputType === 'text' ? 'password' : 'text')
                }
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {inputType === 'text' ? (
                  <Eye color="rgba(0, 0, 0, 0.9)" width={20} height={20} />
                ) : (
                  <Marshalling
                    color="rgba(0, 0, 0, 0.9)"
                    width={20}
                    height={20}
                  />
                )}
              </View>
            </View>
          </Form.Item>

          <View className="login-form-footer">
            <NutButton
              size="normal"
              nativeType="submit"
              loading={isLoading}
              block
              type="primary"
            >
              登 录
            </NutButton>
          </View>
        </Form>
      </View>
    </View>
  );
};
export default LoginPage;

```

## 三、开发遇到的问题

1. 首页引入echarts导致主包体积过大

**如果主包体积过大，应该使用分包而不是 Webpack 代码分割，将使用 echarts 的页面放到独立分包中。**

解决方案：

  1. 使用webpack代码分割将echarts单独打包为一个chunk添加到需要加载的页面，但体积还是超过小程序限制244kb
  **设置 maxSize: 244000, // 最大 chunk 大小（小程序单文件限制）后echarts被打包为多个chunk，小程序对代码分割支持有限。当 echarts 被单独打包成 chunk 后，小程序无法正确加载该模块，导致 module 'echarts.js' is not defined 错误。**
  解决方案： 使用**分包策略：**将使用 echarts 的页面移到分包
  ``` ts
   webpackChain(chain) {
        // 分析包体积（仅在需要时启用，避免影响构建速度）
        if (process.env.ANALYZE === 'true') {
          chain.plugin('analyzer').use(BundleAnalyzerPlugin, [{
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          }]);
        }
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        
        // 优化代码分割，减小主包体积
        chain.merge({
          optimization: {
            splitChunks: {
              chunks: 'all',
              cacheGroups: {
                // echarts 单独打包
                [echartChunkName]: {
                  name: echartChunkName,
                  priority: 50,
                  chunks: 'all',
                  enforce: true,
                  test(module: { resource?: string }) {
                    return module.resource && /[\\/]node_modules[\\/](echarts|zrender)[\\/]/.test(module.resource);
                  },
                },
              },
            },
          },
        });
      },
      addChunkPages(pages) {
        // 指定哪些页面需要依赖上面生成的 echarts chunk
        pages.set('pages/index/index', [echartChunkName]);
      },
  ```   

  2. 使用分包
  小程序分包是文件系统层面的物理分离，不是代码层面的逻辑分割：
  主包：启动时下载，包含 app.js、tabBar 页面、公共资源
  分包：按需下载，独立目录，独立打包

  分包是整体下载，不是按需加载单个文件
  分包下载后会被缓存
  分包之间可以共享主包的公共代码

  **分包的优势和限制**
  优势：
   减小主包体积（主包限制 2MB）
   按需加载，提升启动速度
   独立更新（独立分包可独立发布）
  限制：
   tabBar 页面必须在主包
   分包大小限制：单个分包 ≤ 2MB，所有分包总和 ≤ 20MB
   分包之间不能直接引用

  **项目中tabBar的Index页面中使用echarts，不是特别推荐这种方案， 最佳实践首页只有入口，将echarts放在分包页面中**
  ``` ts
   // 1. 修改 app.config.ts，添加分包
   export default defineAppConfig({
     pages: [
       'pages/index/index',  // 主包：首页（tabBar）
       // ...
     ],
     subPackages: [
       {
         root: 'subpackages/charts',  // 分包根目录
         pages: [
           'pages/statistics/index',  // 图表统计页面
         ],
       },
     ],
     // 预下载分包（可选）
     preloadRule: {
       'pages/index/index': {
         packages: ['subpackages/charts'],
         network: 'wifi',
       },
     },
   });

   // 2. 修改首页，移除直接引入 Charts
   // src/pages/index/index.tsx
   export default function Index() {
     return (
       <View className="index page-padding">
         <ProjectStatistics projectStatistics={projectStatistics ?? []} />
         <QuickLink />
         {/* 改为入口卡片 */}
         <View className="chart-entry" onClick={() => navigateTo('/subpackages/charts/pages/statistics/index')}>
           <Text>查看数据统计</Text>
         </View>
       </View>
     );
   }
  ```

2. 开发环境预览时报错文件体积过大
解决方法：
不需要配置手动压缩，微信开发者工具预览时也会走build流程，使用taro默认配置，
建议使用build后的产物预览

3. 本地预览后端API为IP时，在微信开发者工具中勾选不校验合法url
微信开发者工具-> 详情 -> 本地设置 -> 勾选不校验合法域名

4. 开发完成上传代码时微信开发者工具警告体积过大
微信开发者工具-> 详情 -> 本地设置 -> 勾选上传时自动压缩脚本/ 自动压缩wxml

5. 开发完成上传代码时微信开发者工具警告未按需注入
配置app.config.ts
``` ts
lazyCodeLoading: "requiredComponents",
```

6. 打包时报错Error: chunk common [mini-css-extract-plugin]
Conflicting order. Following module has been added:- couldn't fulfill desired order of chunk group(s) pages/project-detail/index

配置：config/index.ts
``` ts
mini: {
  // 忽略CSS顺序检查来消除错误。
  miniCssExtractPluginOption: {
    ignoreOrder: true, // 增加这一行
  },
}
```


