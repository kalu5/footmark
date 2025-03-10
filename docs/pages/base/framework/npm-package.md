# Npm 发布包

**如果你确实需要在公共npm仓库发布包，检查你的.npmrc文件或者npm配置，确保你使用的是正确的公共注册表地址（通常是https://registry.npmjs.org/）。**

``` bash
npm config get registry  # 查看当前注册表地址
npm config set registry https://registry.npmjs.org/  # 设置正确的注册表地址
```

1. 跳转npm登录页验证登录信息
``` bash
npm login
```

2. 使用npm init 初始化package.json，并配置files
``` json
{
  "name": "test",
  "main": "dist/index.js",
  "files": [  // 指点发布到npm的文件信息
    "dist/",
    "readme.md"
  ]
}
```

3. npm publish

4. 使用

``` bash
pnpm i @kalu5/vue_hooks
```

``` js
import { useState } from '@kalu5/vue_hooks'
const [ count, setCount ] = useState(0)
```

# 使用ts写一个vue3工具库并发布到npm

## 初始化项目

``` bash
npm init -y
```

``` json
{
  "name": "@kalu5/vue_hooks",
  "version": "1.0.1",
  "description": "This is vue3 hooks utils",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "test": "vitest",
    "build": "rollup -c"
  },
  "keywords": [
    "vue3",
    "hooks"
  ],
  "author": "lujialong",
  "license": "ISC",
  "dependencies": {
    "vue": "^3.4.21"
  },
  "files": [
    "dist/",
    "readme.md"
  ],
  "private": false,
  "devDependencies": {
    "@rollup/plugin-babel": "^6.0.4",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-typescript": "^11.1.6",
    "@vitejs/plugin-vue": "^5.0.4",
    "rollup": "^4.14.0",
    "rollup-plugin-terser": "^7.0.2",
    "tslib": "^2.6.2",
    "typescript": "^5.4.3",
    "vitest": "^1.4.0"
  }
}

```

## 安装依赖

``` bash
pnpm i typescript rollup @rollup/plugin-typescript @rollup/plugin-json tslib rollup-plugin-terser @vitejs/plugin-vue vitest -D
```

``` bash
pnpm i vue
```

## 创建rollup.config.js

注意： format格式为es（vue默认是esModule）

``` js
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser'
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'rollup';

export default defineConfig({
  input: 'libs/main.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    name: 'vue_hooks',
  },
  plugins: [
    vue(),
    json({
      include: 'package.json'
    }),
    typescript({
      lib:['es5', "es6", "dom"],
      target: "es5"
    }),
    terser()
  ],
});
```

## 自动化测试

__test__/index

``` ts
import type { Ref } from 'vue'
import { expect, test } from 'vitest'
import { useState } from '../libs/main'

test('useState number', () => {
  const [count, setCount]  = useState<number>(0)
  expect((count as Ref<number> ).value).toBe(0);
  setCount(1)
  expect((count as Ref<number> ).value).toBe(1)
  setCount((val: Ref<number>) => {
    return val.value + 2
  })
  expect((count as Ref<number> ).value).toBe(3)
})
```

## 书写libs公共方法,

libs/hooks/useState.ts
``` ts
import { ref } from 'vue'
import type { Ref } from 'vue'
import { SetStateSetter } from '../types/index'

export default function useState<T>(init: T) {
  const _state = createState<T>(init);
  const _setState = createStateSetter<T>(_state);
  return [_state, _setState] as [Ref<T>, SetStateSetter<T | Function>]
}

function createState<T>(init: T) {
  return ref(init) as Ref<T>
}

function createStateSetter<T>(state: Ref<T>) {
  return function<U extends T | Function > (newState: U) {
    if (typeof newState === 'function') {
      state.value = newState(state)
    } else {
      state.value = newState as T
    }
  }
}
```

libs/hooks/index.ts
``` ts
import useState from './useState'
export {
  useState
}
```

main.ts
``` ts
export * from './hooks/index'
```

## 打包生成dist/index

``` bash
pnpm build
```

## 发布到npm 

```bash
npm publish
```