# Monorepo series

## 包管理工具

### Npm 

**存储依赖树的方式**

1. 对磁盘空间的浪费（2015年之前安装依赖的方式）


A包中有BC两个包同时依赖D

node_modules
  A 
    node_modules
      B
        node_modules
          D
      C 
        node_modules
          D

2. 扁平化依赖存储（最新）,解决磁盘空间浪费

依赖树和依赖的保存方式是没有关系的

node_modules
  A
  B
  C
  D

**扁平化会造成幽灵依赖问题**

      P
    A     
 B
项目P依赖A, A依赖B，扁平化后，项目P中可以直接使用B

当删除A后B也被删除，使用B的地方就会报错

B继续使用，版本被更新了也会产生幽灵依赖问题

### Pnpm

解决npm磁盘空间占用和幽灵依赖问题

      node_modules         
      |
      --> .pnpm
      |
      --> A-SL

      .pnpm
      |
      --> A@1.0.0 - HL
         |
         --> node_modules
           |
           --> B-SL
      |
      --> B@1.0.0 - HL

      .pnpm-store
      |
      --> A@1.0.0
      |
      --> B@1.0.0


1. 将项目的直接依赖通过软链接（SL-Symbolic Link）的方式放在node_modules中
2. 软连接指向了node_modules的.pnpm中的硬链接(HL-Hard Link)
3. 硬链接指向系统的.pnpm-store中的具体的包（A@1.0.0）的硬链接（指向磁盘空间）


**高性能Node包管理工具（Performant Node Package Manager）**

目的： 提升包安装和管理能力

中心化思想解决依赖复用问题

**优点：**

1. 快（所有的依赖都存储在.pnpm.store中，多个项目中使用的依赖在store中有的话直接从store中拿，不需要重新下载，没有的话下载到store中，硬链接过来）
2. 节省磁盘空间（相同的依赖不需要重新安装，通过软硬链接直接链接过去）
3. 支持模块化（引入的模块直接从store中拿，跨项目访问方便）

**运行的3个阶段**

1. 依赖解析，仓库中没有的依赖都被识别并获取到仓库中
2. 目录结构计算，node_modules目录结构是根据依赖计算出来的
3. 链接依赖项，所有以前安装过的依赖项都会直接从仓库中获取并链接到node_modules

常用命令

``` bash

# 获取下载依赖的源 

pnpm config get registry

# 设置下载依赖的源
pnpm config set registry 源地址

# 查看pnpm版本
pnpm -v 

# 获取pnpm-store路径
pnpm store path

# 查看依赖版本
pnpm view vue version

# 安装依赖
pnpm add/i/install 包名 -g/-S/-D

# 查看过期依赖
pnpm outdated

# 安装全部依赖
pnpm i
```

## Monorepo

什么是Monorepo

Monolithic Repository
单一仓库（多项目管理方案）

概念：一个仓库管理多个项目的工程化开发管理模式

**优势：**
1. 便于代码和依赖在多个项目之间共享
2. 更方便简单的项目版本控制
3. 提高多项目的构建与部署的便捷性
4. 提高代码的复用性和团队协助的便利性


- 应用
1. 项目的子项目架构 Project(项目的过程) / Application（开发完成的应用）
2. 对于工具分类封装的架构
3. 对于复杂而且丰富的应用需求的功能切片

## Repository项目管理的发展历程

1. 单体仓库单应用模式 - Monolith
  - 一个仓库管理一个单应用
  - 缺点：随着项目的功能迭代，单体应用的规模会逐渐变大，难以维护

2. 多仓库多应用模式 - Multirepo
  - 多个应用分配给多个对应的仓库进行管理
  - 缺点：无法进行项目依赖与代码的共享，多应用之间的结合变得复杂困难
    - 独立的项目结构，所有项目都是分开的仓库
    - 独立技术栈
    - 规范化、自动化相关处理在项目间是割裂的
    - 依赖管理，版本很难统一
    - 部署，docker、docker compose ,自动化脚本很难形成统一

3. 单仓库多应用模式 - Monorepo
  - 一个仓库管理多个应用
  - 优点：业务代码分离解耦，应用间共享依赖与代码、项目配置和构建部署、项目扩展更方便
    - 混合项目结构，所有的相关的工程形成子包
    - 技术栈统一
    - 规范化、自动化相关处理在项目间是统一的
    - 依赖管理，版本统一
    - 部署，docker、docker compose,自动化脚本统一

## Monorepo 架构方案

- 包管理：**pnpm** workspace 、 yarn workspace、lerna
- 构建缓存
- 增量构建 **turbo** nx

## 传统架构到monorepo架构演进

- 阶段1：传统架构基础痛点（主要矛盾）
    - 代码先集中化，将多个关联项目统一到一个仓库中
    - 工具引入，pnpm workspace
    - CI/CD 重构
- 阶段2：具体monorepo 架构
    - 公共模块抽离
    - pnpm、turbo 解决子包与主包的关系
- 阶段3：自动化构建流程优化
    - 打包方案：vite、webpack、rollup、parcel、**tsup**、esbuild、swc、rolldown
    - 构建流程优化，依赖关系（循环引用），哪些包需要提前构建
    - 发布，npm publish 、docker镜像
    - 监控和测试

## 关键性步骤

1. 项目统一
2. pnpm配置
3. 依赖管理
4. 统一化脚本
   - 工程化脚本：package.json中的script
   - scripts 文件夹下的脚本

> 总结：我主导了工程化架构的重构工作，基于pnpm workspace 统一工程化组织，统一自动化、流程、规范化相关内容，子包管理更清晰，基于vite构建业务包

## Monorepo的组成

1. apps: 应用（一个大项目中的子应用）
2. packages: 本地包（Local Package）
3. 依赖的共有和私有（每个子应用有自己私有的依赖）
4. 配置的公有和私有

目录结构

apps

- node_modules
- package.json
- apps
  - app1
    - package.json
  - app2
    - package.json
- packages
  - utils
    - package.json
  - ui   
    - package.json
    - src
      - button
        - index.ts
- pnpm-workspace.yaml
  packages:
    - "apps/*"
    - "packages/*"

基本使用：
``` bash
# 项目app1和app2使用packages/utils

pnpm add @monorepo/utils --workspace

# 工作区启动子应用
pnpm run -F @monorepo/app1 dev

# 工作区安装依赖
pnpm -w -D add vite @vitejs/plugin-vue @vitejs/plugin-react
```

## 将Vue、React项目使用monorepo架构

**思考：Vue、React安装到哪里**
为了扩展，建议安装到根目录

根目录安装
- vite
- vue @vitejs/plugin-vue
- react react-dom @vitejs/plugin-react

目录结构：

- package.json
- pnpm-workspace.yaml
- node_modules
- apps
  - home
    - package.json
    - vite.config.ts
  - manager
    - package.json
    - vite.config.ts
- packages

## Turborepo

是一个现代化的Monorepo管理工具，专门优化了构建速度和开发工作流

**核心特点**
1. 增量构建：只构建那些发生变化的内容
2. 构建缓存：缓存构建结果，避免重复构建相同的内容
3. 并行构建：支持并行执行任务，进一步加快构建过程
4. 高效的工作流：支持通过简单的命令自动化构建、测试、发布等任务

## 微前端

### 什么是微前端

1. 微前端就是一个大项目中的小应用的开发方式
2. 微前端的核心就是微应用
3. 一个复合型项目拆分成小应用进行开发，最后将小应用整合成一个项目的开发方式就是微前端

**示例：**
- 操作系统是一个项目
  QQ、微信都是系统中的小应用
- Office是一个项目
  Word、Excel是Office中的小应用

### 微前端开发的好处

1. 在项目整体框架下，可以独立开发、打包、部署、发布微应用（Micro Application）
2. 独立应用的调试和部署对整个项目的运行影响比较小
3. 应用的独立性强，复用性也就强
4. 创造了团队对于微应用独立开发、部署的条件
5. 技术栈不受限制

### 微前端的两种开发方式

1. MPA: Multiple-Page Application
2. SPA: Single-Page Application
   - Single-SPA -> 乾坤

### SPA模式的构建方式

1. 基座（base）: 提供给多应用的注册与应用路由设置的工具（项目）
2. 子应用（Sub Application）接入基座

### 应用场景

- 大型的复合项目（电商后端管理系统）

当一个项目可以明确的分很多相互之间独立而且不耦合的功能时需考虑微前端开发


1. 订单管理
2. 物流管理
3. 客户管理
4. 商品管理
5. 优惠管理

### Monorepo和微前端的关系

正好符合：

- Monorepo是单仓库多应用开发管理架构
- SPA是单页面项目，多独立应用开发










