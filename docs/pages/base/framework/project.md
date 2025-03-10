# 前端工程化

## ESLint 前端编码规范化与原理

### 你之前的项目，工程化规范是怎么定的，你怎么看项目规范化这个问题？

提要：工程化、规范化是为了解决什么问题？

#### 什么是规范化

看起来代码像一个人写的
- 代码风格、文件命名、目录结构、提交规范统一化
- 目的：为了项目的可维护性、一致性、可读性而努力，最终能够减少团队之间成员的协作（成员扯皮）

细化：
- 文件结构
- 代码规范：变量命名、函数、风格统一（eslint + prettier + stylelint）
- 提交规范
- 单词拼写规范

> 这一切都需要以编译原理作为基础，操作代码、解析代码（babel、swc、esbuild）,eslint parser转化代码后再对代码进行操作（规范、格式化）

#### js规范化

eslint: 专门来做**语言质量检查**， js/vue/ts
对于前端来说eslint就是为了解决js/ts/vue代码规范的

eslint首先依然需要构建 ast, 但前端工具链、打包构建相关工具没有一个标准

#### eslint 规范约定

- 规范等级
    - off
    - warn
    - error
- 核心规则
    - 语法检查，变量命名了未使用，console调试代码未删等
    - 风格一致性（分号、空格、缩进、换行等）
    - 最佳实践，原型污染（Array.prototype.slice = null, evel()）
- 大量的规范来控制这些代码的编写

- eslint + prittier 集成
- CI/CD 通过调用监本来实现校验触发

#### eslint常见规则

- 不能存在未使用的变量： no-unused-vars
- 不允许存在console: no-console
- 不允许数组定义时有多余的逗号：no-sparse-arrays
`const arr = [1, , 3]`
- 不允许未声明的变量：no-undef
`console.log (a)`
- 不允许函数return后还写代码：no-unreachable
``` js
function test() {
  const user = 'user'
  return user
  console.log (user)
}
```
- 不允许对象有重复的key：no-dupe-keys
``` js
const user = {
  name: 'user',
  name: 'user1'
}
```

#### 请以ESlint作者的视角，拆解一下完备的前端代码规范与格式化工具架构

- eslint 核心引擎（eslint初始化、配置加载、文件解析、规则的处理）
- parser (解析器) eslint解析器(espree、@typescript-eslint/parser)将代码转为抽象语法树ast
- rules(规则集)规则系统负责根据ast节点应用特定的校验逻辑
- plugins(插件)，通过插件机制，开发者可以引入额外的规则和功能，使eslint支持更多的语言和框架
- 配置层

**解析器的工作流程**

             代码输入
               |
            读取ESlint配置文件
               |
            选择适用的解析器
               |
      -------------------------------------
      |        |                          |
    Espree    BabelParser                TypescriptParser
  解析Js代码   解析含有JSX或实验语法代码       解析Typescript代码
      |        |                          |
      -------------------------------------  
               生成AST
               |
               遍历AST节点
               |
               应用已开启的规则
               |
               节点是否符合规则
               |
          ------------
          |           |
          符合        不符合
          继续遍历     报告警告或错误
          ------------
              |
            解析结束


#### 在团队中，沉淀一些专属的eslint规范，通过插件集来提升团队代码规范

- 插件
- 规则 rule
- eslint 使用规范

**需求：**
不然团队成员使用 test 这几个字来作为变量名

- rule定义：编写一个rule，原理是通过ast节点处理来完成
- plugin插件定义：将rule进行插件化
- use： 将插件引入eslint配置文件

plugin.js
``` js
// 插件的本质就是一个对象，符合插件的基础协议
import noAVars from "../rules/no-a-vars.js";

const eslintKaluPlugin = {
  rules: {
    "no-a-vars": noAVars,
  },
};

export default eslintKaluPlugin;
```

rule.js
``` js
// 规则本质就是一个对象
// 插件化体系中，这个对象的属性约束就是我们所说的插件协议

// eslint插件必须长的像一个约定好的对象
const noAVars = {
  // 插件元信息
  meta: {
    // 上报的错误，给外部暴露信息
    messages: {
      noAVars: "no use a vars",
    },
  },
  // 插件入口
  create(context) {
    return {
      // 这个就是一个访问者模式，访问到某一个ast节点，就进行处理
      Identifier(node) {
        // console.log (node);
        if (node.name === "a") {
          context.report({
            node,
            messageId: "noAVars",
            data: {
              name: node.name,
            },
          });
        }
      },
    };
  },
};

export default noAVars;

```

使用插件 eslint.config.js
``` js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import eslintKaluPlugin from "./packages/eslint-plugin/plugins/eslint-plugin-kalu.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  // 忽略文件
  {
    ignores: [
      "**/node_modules/",
      ".git/",
      "**/dist/",
    ],
  },
  { languageOptions: {
    globals: globals.browser,
    sourceType: "module",
    ecmaVersion: "latest",
  },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  // 自定义eslint插件，实现团队独有eslint规则
  {
    plugins: {
      kalu: eslintKaluPlugin,
    },
    rules: {
      // 不能使用a作为变量名
      "kalu/no-a-vars": "error",
      "semi": "error",
      "no-console": "error",
    },
    linterOptions: {
      // 禁用内联注释实现eslint
      // /*eslint semi: error*/
      noInlineConfig: true,
      // 启用未使用的禁用启用命令报告
      // /*eslint-disable*/ /*eslint-enable*/ /*eslint-disable-next-line*/
      reportUnusedDisableDirectives: "error",
      // 报告未使用的内联配置
      // /*eslint semi: error*/
      reportUnusedInlineConfigs: "error",
    },
  },
  { files: ["**/*.vue"],
    languageOptions: {
      // 更改eslint解析代码的方式
      parserOptions: { parser: tseslint.parser },
    },
  },
  // 应限制内联禁用 ESLint 规则
  // 在配置文件中统一配置，并给出禁用原因
  {
    files: ["*-test.js", "*-index.js"],
    rules: {
      semi: "off",
    },
  },
  // 代码风格
  stylistic.configs.customize({
    flat: true,
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
  }),
];

```

## 代码提交检查

lint-staged + simple-git-hooks

## 提交信息校验

commitlint/cli 


```js  package.json
{
  "name": "starter-monorepo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:vue": "pnpm -F vue-app run dev",
    "build:vue": "pnpm -F vue-app run build",
    "preview:vue": "pnpm -F vue-app run preview",
    "lint": "eslint .",
    "lint:ui": "npx @eslint/config-inspector@latest",
    "lint:fix": "eslint . --fix",
    "prepare": "simple-git-hooks"
  },
  "keywords": [
    "monorepo",
    "react",
    "vue"
  ],
  "author": "kalu5",
  "license": "ISC",
  "devDependencies": {
    "@commitlint/cli": "^19.7.1",
    "@commitlint/config-conventional": "^19.7.1",
    "@eslint/config-inspector": "^1.0.0",
    "@eslint/js": "^9.21.0",
    "@stylistic/eslint-plugin": "^4.1.0",
    "@types/node": "^22.13.4",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/tsconfig": "^0.7.0",
    "eslint": "^9.21.0",
    "eslint-plugin-vue": "^9.32.0",
    "globals": "^16.0.0",
    "lint-staged": "^15.4.3",
    "simple-git-hooks": "^2.11.1",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.24.1",
    "unocss": "^65.5.0",
    "unplugin-auto-import": "^19.1.0",
    "unplugin-vue-components": "^28.1.0",
    "vite": "^6.1.0",
    "vue-tsc": "^2.2.2"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "element-plus": "^2.9.4",
    "pinia": "^3.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vue": "^3.5.13",
    "vue-router": "4"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged",
    "commit-msg": "npx --no -- commitlint --edit"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}


```

## GitLab CI/CD

**gitLab 多人协作时，怎样阻止其他人强制提交代码**

1. 分支保护规则
启用分支保护：在 GitLab 项目中，进入 Settings > Repository > Protected Branches，选择要保护的分支（如 main 或 develop），设置保护规则。

权限限制：

Allowed to merge：仅允许特定角色（如 Maintainer）合并代码。

Allowed to push：仅允许特定角色推送代码。

勾选 "Prevent force push"：防止任何人强制推送。

2. 使用 Merge Request
强制使用 Merge Request：在分支保护设置中，启用 Require merge request to merge，确保所有代码变更通过 Merge Request 进行，避免直接推送。

代码审查：通过 Merge Request 流程，确保代码经过审查后才能合并。

3. Git Hooks
服务器端 Hook：在 GitLab 服务器上配置 pre-receive 或 update Hook，检查提交记录，阻止强制推送。

自定义脚本：编写脚本检查提交历史，若发现强制推送则拒绝。

4. 权限管理
角色权限控制：在 Settings > Members 中，限制 Developer 和 Maintainer 的权限，确保只有高级别角色能进行敏感操作。

5. 定期备份
备份仓库：定期备份仓库，防止强制推送导致的数据丢失。

6. 教育团队成员
培训：教育团队成员避免使用 git push --force，推荐使用 git push --force-with-lease，减少覆盖他人代码的风险。

