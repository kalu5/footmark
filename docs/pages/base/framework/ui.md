# 组件库开发

## 建立设计体系

- 颜色
- 字号
- 间距
- 阴影
- 圆角

## 组件库的设计与开发思路

### 整体设计

#### 整体组件库架构设计

1. 分层
- 基础组件
  - rc-xxx,提供基础组件，unstyled component (headless), 只具备功能交互不具备UI 表现
  加上样式体系（theming），去给组件加上UI 和表现，以此完成整个UI库的组件封装

- 复合组件： Search(Input + Select), IconButton(Icon + Button)
- 业务组件

2. 解耦
   - 对于每个组件都需要定义样式、TS类型、基础操作、工具方法等放在特定的文件中，用时组合在一起

3. 响应式设计
   - 媒体查询 media query 、 ResizeObserver、 Grid

#### 状态管理
- 全局状态：基础配置、国际化配置、主题配置
  - 最佳实践
    - react(Context/useSyncExternalStore)
    - vue(vue-demi)
- 局部状态：表单（受控和非受控），判断依据是状态是否跟着表单值双向奔赴 
  受控：`<input value={v} onChange={() => setV} />`
  非受控：`<input defaultValue={v} />`

#### 样式体系与主题设计

- Color Tokens: 颜色色值系统
  - 主要有几个派系
    - antd 、arco
    - mantineUI
    - mui
    - shadcn/ui
- 样式模块化方案
  - css-in-js: 
    - 弊端：运行时性能损耗、ssr支持不友好，需要单独提取样式
    - 最佳实践：emotion、styled-components
  - module css
- 样式优先级与覆盖：控制样式优先级

#### 模块化

- 可复用性： 对于props、events的设计非常重要（input textarea都需要value onChange成对）
- 公共方法：颜色计算函数、格式化处理、本地化、工具函数 -- @ant-design/utils

### 开发流程

#### 本地开发
二次开发，基于antd

#### 组件库开发流程

1. 工程架构：monorepo(core + components + hooks + utils + shared)
2. Typescipt
3. 流程化、规范化、自动化
   - script 如何定义（CI/CD的源头）
   - eslint9、stylelint、spellcheck、commitlint
   - 颜色值生成、自动化构建、增量构建、缓存构建
4. 构建打包：rollup、esbuild、swc
5. 测试：单元测试（vitest / jext + react-testing-library）

## 从0到1实现一个组件库基础框架

1. 技术选型与方案评审
   - 包管理： pnpm workspace
   - 语言选择： ts
   - 打包构建：rollup/esbuild（推荐）
   - 样式管理： css-in-js
   - 组件组织：模块化设计与分层
   - 测试：jest
   - CI/CD
   - 构建产物发布（docker-compose）

2. 初始化工程
3. 依赖选择
4. ts配置，构建配置
5. monorepo 分包
6. 组件文档编写
7. 构建发布
   - 组件库
     pnpm build
     pnpm publish
   - 组件文档
     docker nginx

8. 版本管理
   - np

