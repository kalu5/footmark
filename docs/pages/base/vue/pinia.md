# Pinia

## Pinia出现的原因
1. 打破传统flux思想，直接通过Action修改state(不需要mutation)
2. 将所有的modle扁平化，解决vuex嵌套过深

## 特性
1. 所有的state最终都会转为响应式数据ref挂载到pinia
2. 所有的getter最终都会转为computed挂载到store
3. 所有的actions最终都会转为function挂载到store

## createPinia和defineStore之前的联系

createPinia执行后会创建一个pinia并且通过app.provide提供给所有的子组件
defineStore创建一个store在组件中使用时自动inject pinia,并将当前的store保存到pinia的store中

## mini Pinia

``` ts
import { ref, effectScope, reactive, inject, isRef, isReactive,computed } from 'vue';
const piniaSymbol = Symbol()

function createPinia() {
  const scope = effectScope(true)
  const state = scope.run(() => ref({}))
  const store = new Map();
  return {
    scope,
    state,
    store,
    install
  }
}

function install (app, options) {
  app.provide(piniaSymbol, this)
}

// 定义一个store, 返回一个useStore
function defineStore (...args) {
  // 对参数进行解析
  const {
    id,
    options,
    setup
  } = parseArgs(args)

  // 是否是setup
  const isSetup = isFunction(setup)

  function useStore() {
    /**
     * 1. 注入pinia
     * 2. 判断pinia.store 是否有当前id
     *    没有：创建store,并将响应式数据挂到pinia的state中，通过id对应
     *    有：返回store
     * */ 
    const pinia = inject(piniaSymbol)
    if (!pinia.store.has(id)) {
      /**
         * pinia.store.id = store
         * pinia.state.id = {cout: 1}
        */
      // setup
      if (isSetup) {
        createSetupStore(pinia, id, setup)
      } else {
        // options
        createOptionsStore(pinia, id, options)
      }
    }
    // store -> Map
    return pinia.store.get(id)
  }

  return useStore
}

function createSetupStore(pinia, id, setup) {
  const setupStore = setup()
  /**
   * store
   * 
   * pinia Apis
   * state
   * computed
   * methods
   * 
  */
  const store = reactive({})

  // 在pinia scope中创建子scope, 可使用pinia.stop停止响应
  let storeScope
  const result = pinia.scope.run(() => {
    storeScope = effectScope()
    // 解析setupStore,将响应式数据添加到pinia
    return setupStore.run(() => compileSetup(pinia, id, setupStore))
  })

  setStore(pinia, id, store, result)
}

// 解析setupStore,将响应式数据添加到pinia
function compileSetup(pinia, id, setupStore) {
  !pinia.state.value[id] && (pinia.state.value[id] = {})

  for (let key in setupStore) {
    const el = setupStore[key]
    if ((isRef(el) && !isComputed(el)) || isReactive(el)) {
      /**
       * pinia: {
       *   state: {
       *     'todo': {
       *       count: 1
       *     }
       *   }
       * }
      */
      pinia.state.value[id][key] = el
    }
  }
  return {
    ...setupStore
  }
}

function createOptionsStore(pinia, id, options) {
  const store = reactive({})
  let storeScope
  const result = pinia.scope.run(() => {
    storeScope = effectScope()
    return storeScope.run(() => compileOptions(pinia,id, store, options))
  })
  setStore(pinia, id, store, result)
}

function setStore(pinia, id, store, result) {
  pinia.store.set(id, store)
  Object.assign(store, result)
  return store
}

function compileOptions(pinia, id, store, options) {
  const {
    state,
    getters,
    actions
  } = options;
  const storeState = createStoreState(pinia, id, state)
  const storeGetters = createStoreGetters(store, getters)
  const storeActions = createStoreActions(store, actions)

  return {
    ...storeState,
    ...storeGetters,
    ...storeActions
  }
}

function createStoreState(pinia, id, state) {
  return pinia.state.value[id] = state || {}
}

function createStoreGetters(store, getters) {
  // 需要处理this问题
  return Object.keys(getters || {}).reduce((acc, cur) => {
    acc[cur] = computed(() => getters[cur].call(store))
    return acc
  }, {})
}

function createStoreActions(store, actions) {
  return Object.keys(actions || {}).reduce((acc, cur) => {
    acc[cur] = function () {
      actions[cur].apply(store, arguments)
    }
    return acc; 
  }, {})
}



// 解析参数
 /**
   * 1. id + options
   * 2. id + setup
   * 3. options
   * 
  */
function parseArgs(args: any) {
  let id,
      options,
      setup;
  // 判断args[0]是否是id
  if (isString(args[0])) {
    id = args[0]
    // 判断args[1]是不是setup
    if (isFunction(args[1])) {
      setup = args[1]
    } else {
      options = args[1]
    }
  } else {
    // 为options
    options = args[0]
    id = args[0]?.id
  }

  return {
    id,
    options,
    setup
  }
}

// 是否是字符串
function isString (str: unknown) {
  return typeof str === 'string'
}

// 是否函数
function isFunction (func: unknown) {
  return typeof func === 'function'
}

// 是否computed
function isComputed(val) {
  return !!(isRef(val) && val.effect)
}
```

