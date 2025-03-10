# Vue设计原理

## 响应式原理

**关键技术点:** Proxy 和 Reflect

创建一个原始对象的代理对象，拦截对象的基本操作，比如get、set、delete等，与副作用函数建立联系，当响应式数据发生变化时，重新执行副作用函数。

### 响应式系统基本实现

``` js
const obj = {
  name: 'kalu5',
  age: 18,
  ok: true,
  job: 'Hello world'
}

const data = new Proxy(obj, {
  get(target, key, receiver) {
    // 收集依赖
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    // 触发依赖
    trigger(target, key)
  },
})

// 存储副作用函数
const bucket = new WeakMap()

// 存储当前激活的副作用函数
let activeEffect

// 解决副作用嵌套问题
/*
  effect(() => {
    effect(() => {
      console.log (data.bar)
    )})
    console.log (data.foo)
  })
  当修改data.foo时，执行的是bar的副作用, activeEffect指向bar的effect
**/
// 使用栈存储当前激活的副作用函数
// 函数执行时，将当前副作用函数压入栈中，执行完毕后，弹出栈顶元素，activeEffect指向栈顶元素
let activeEffectStack = []

// 收集依赖
function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

// 触发副作用函数执行
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  // Set结构， 遍历时 delete add 同一项 会死循环，用新Set处理
  // 分支切换时，副作用函数执行前先删除所有依赖，执行后又会重新添加依赖，此时Set还在遍历
  // 解决方法： 使用新的Set结构，在遍历新的Set时，修改原Set
  const newDeps = new Set()
  deps && deps.forEach(fn => {
    // 避免无限循环 data.name = data.name + 'test', 同时设置和读取
    if (fn !== activeEffect) {
      newDeps.add(fn)
    }
  })
  newDeps.forEach(fn => {
    // 调度执行
    if (fn.options.scheduler) {
      fn.options.scheduler(fn)
    } else {
      fn()
    }
  })
}

// 副作用函数
function effect(fn, options = {}) {
  // 解决硬编码副作用函数
  function effectFn() {
    // 清除上一次副作用函数的依赖关系
    cleanup(effectFn)
    activeEffect = effectFn
    // 入栈
    activeEffectStack.push(effectFn)
    // 将结果返回，computed需要
    const res = fn()
    // 出栈
    activeEffectStack.pop()
    // 恢复上一次副作用函数
    activeEffect = activeEffectStack[activeEffectStack.length - 1]
    return res
  }

  // 存储当前副作用的所有依赖关系，在追踪时添加，执行之前清空
  // 避免产生遗留的副作用函数
  // document.body.innerText = data.ok ? data.name : 'not'
  // 当ok为false时，修改name会触发副作用函数重写执行
  effectFn.deps = []

  // 将配置项挂载到副作用函数上
  effectFn.options = options

  // 解决懒执行
  if (!options.lazy) {
    return effectFn()
  }

  return effectFn
}

// 清除依赖关系
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// effect(() => {
//   console.log(data.name)
// })

// data.name = 'hello kalu5'

/**
 * 分支切换，导致不必要更新
effect(() => {
  console.log('effect run')
  document.body.innerText = data.ok ? data.name : 'not'
})

data.ok = false
setTimeout(() => {
  data.name = 'hello kalu5666'
}, 1000)
*/

/**
 * 循环嵌套副作用只绑定了内层的副作用函数
 effect(() => {
  console.log ('effect run')
  effect(() => {
    console.log ('effect run1')
    document.body.innerText = data.name
  })
  document.body.innerText = data.age
})

data.age = 20  // 只打印了effect run1
*/

/**
 * 同时读取和设置 导致无限循环 
 * vue.js:14 Uncaught RangeError: Maximum call stack size exceeded
    at Reflect.set (<anonymous>)
 effect(() => {
  console.log('effect run')
  data.age += 1;
 })
*/

/*
调度器
effect(() => {
  console.log('effect run')
  document.body.innerText = data.name
 }, {
  scheduler(fn) {
    console.log('scheduler run')
    setTimeout(fn)
  }
})

data.name = 'schduler'
*/

// 通过调度器过滤中间状态，只需要最终状态
const jobQueue = new Set();
const promise = Promise.resolve();
let isFlushing = false;

function flushJob(fn) {
  if (isFlushing) return
  jobQueue.add(fn)
  isFlushing = true
  promise.then(() => {
    console.log (jobQueue, 'job q')
    jobQueue.forEach(job => job())
  }).finally(() => {
    isFlushing = false
  })
}
effect(() => {
  console.log ('effect run job')
  document.body.innerText = data.job
}, {
  scheduler(fn) {
    console.log('scheduler run job')
    flushJob(fn)
  }
})
data.job = 'hello job1'
data.job = 'hello job2'
data.job = 'hello job3'
data.job = 'hello job4'
/**
 * 懒执行
 const res = effect(() => {
  console.log('effect run')
  document.body.innerText = data.name
 }, {
  lazy: true, // 懒执行
  scheduler(fn) {
    console.log('scheduler run')
    setTimeout(fn)
  }
})
console.log (res, 'res===')
res();
data.name ='schduler'
*/
```

### Computed实现

``` js
// computed
function computed(getter) {
  if (typeof getter !== 'function') {
    console.error('computed must be a function')
  }
  // 缓存计算结果
  let value
  // 标记是否需要重新计算
  // 多次读取值时，即使getter中依赖的值没有发生变化，也会重新计算
  let dirty = true
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        // 依赖的值发生变化时，手动调用trigger触发响应
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        console.log ('effect run')
        value = effectFn()
        dirty = false
      }
      // 在effect中读取计算属性时，产生effect嵌套，外层的effect只会收集getter的依赖
      // 所以需要手动收集computed vlaue 的依赖
      // 修改getter的值时，手动调用trigger触发响应
      track(obj, 'value')
      return value
    }
  }

  return obj;
}

const cValue = computed(() => data.name + ' ' + data.age)
console.log (cValue.value)
console.log (cValue.value)
console.log (cValue.value)

```

### Watch实现

``` js
// watch
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
}

function watch(source, cb, options = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue , newValue;

  // 存储用户注册的过期回调
  let cleanup;

  function onInvalidate(fn) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    // 在回调执行前，先调用过期回调
    // 处理异步竞态问题
    if (cleanup) cleanup()
    // 将onInvalidate作为回调函数的第三个参数传递
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

let res
let delay = 2000
watch(() => data.age, (newValue, oldValue, onInvalidate) => {
  console.log('watch run ============')
  console.log(newValue, oldValue)
  let expire = false
  onInvalidate(() => {
    expire = true
  })
  setTimeout(() => {
    if (!expire) {
      res = newValue
    }
  }, delay)
}, {
  immediate: true
})
delay = 1000
data.age = 1;
setTimeout(() => {
  console.log(res, 'res =============') // 18
}, 3000)
```

### 代理对象

#### 对象的基本操作

1. 访问属性，obj.foo (get)
2. 判断对象或原型上是否存在给定的key, key in obj （has）
3. 使用for...in循环遍历对象的属性 (ownKeys)
   - 添加属性才会触发与ITERATE_KEY相关的副作用函数
   - 修改属性触发get/set相关的副作用函数
4. 删除属性，delete obj.foo (deleteProperty)

``` js
// 记录对象for in 遍历对象的key
const ITERATE_KEY = Symbol()

function handlerFn(isShallow = false, isReadonly = false) {
  return {
    get(target, key, receiver) {
      // 代理对象可通过raw属性访问原始对象
      if (key === 'raw') {
        return target
      }
      // 非只读和不是迭代器属性，Symbol.iterator 才收集依赖
      if (!isReadonly && key !== 'symbol') {
        // 收集依赖
        track(target, key)
      }

      const res = Reflect.get(target, key, receiver)
      // 如果是浅响应，直接返回
      if (isShallow) {
        return res
      }
      // 如果是对象，递归代理
      if (typeof res === 'object' && res !== null) {
        return reactive(res)
      }
      return res
    },
    set(target, key, newValue, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 获取旧值
      const oldValue = target[key]
      // 只有添加属性时才触发与ITERATE_KEY相关的副作用函数
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newValue, receiver)
      // receiver就是target的代理对象
      if (target === receiver.raw) {
        // 只有新旧值不相等，且新旧值都不是NaN时，才触发依赖
        if (oldValue!== newValue && (oldValue === oldValue || newValue === newValue)) {
          // 触发依赖
          trigger(target, key, type)
        }
      }
      return res;
    },
    // 拦截对象的 in 操作符
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    // 拦截对象的for in 操作符
    ownKeys(target) {
      // 当target时数组时，修改数组元素和修改数组长度，都会触发与length相关的副作用函数
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    // 拦截对象的delete操作符
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (hadKey && result) {
        trigger(target, key, 'DELETE')
      }
      return result;
    } 
  }
}

function createReactive(obj, isShallow = false, isReadonly = false) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  // 已经代理过的对象直接返回
  if (obj.__v_isReactive) {
    return obj
  }
  const observed = new Proxy(obj, handlerFn(isShallow, isReadonly))
  // 标记已经代理过的对象
  obj.__v_isReactive = true
  return observed
}

function reactive(obj) {
  return createReactive(obj)
}

function shallowReactive(obj) {
  return createReactive(obj, true)
}

function readonly(obj) {
  return createReactive(obj, false, true)
}

function shallowReadonly(obj) {
 return createReactive(obj, true, true)
}
```

### 代理数组

#### 数组的基本操作

**读取：**
1. 访问数组元素，arr[0] (get)
2. 访问数组长度，arr.length (get)
3. 使用for...in循环遍历数组 (ownKeys)
4. 使用for...of循环遍历数组 (ownKeys)
5. 数组的原型方法，比如push、pop、shift、unshift、splice、sort、reverse等

**设置：**
1. 修改数组元素，arr[0] = 1 (set)，会隐式地修改数组的length属性
2. 修改数组长度，arr.length = 1 (set)，会隐式的影响数组元素，需要将index大于等于length的元素关联的副作用函数添加到依赖中
3. 数组栈方法，比如push、pop、shift、unshift
4. 使用原数组的原型方法，比如splice、sort、fill、reverse等

``` js
// 记录对象for in 遍历对象的key
const ITERATE_KEY = Symbol()

const arrInstruments = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrInstruments[method] = function (...args) {
    let res = originMethod.apply(this, args)
    if (!res || res === -1) {
      res = originMethod.apply(this.raw, args)
    }
    return res
  }
})

let shouldTrack = true;
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrInstruments[method] = function (...args) {
    shouldTrack = false
    const res = originMethod.apply(this, args)
    shouldTrack = true
    return res
  } 
})

function handlerFn(isShallow = false, isReadonly = false) {
  return {
    get(target, key, receiver) {
      // 代理对象可通过raw属性访问原始对象
      if (key === 'raw') {
        return target
      }

      // 数组查找方法自定义处理
      // 使用代理对象访问不到, 需要自定义
      /**
       * const obj = {}
       * const newObj = reactive([obj])
       * newObj.includes(obj) // false
       * newObj.indexOf(obj) // -1
       * newObj.lastIndexOf(obj) // -1
       *
       * 
      */
      if (Array.isArray(target) && arrInstruments.hasOwnProperty(key)) {
        return Reflect.get(arrInstruments, key, receiver)
      }

      // 非只读才收集依赖
      if (!isReadonly) {
        // 收集依赖
        track(target, key)
      }

      const res = Reflect.get(target, key, receiver)
      // 如果是浅响应，直接返回
      if (isShallow) {
        return res
      }
      // 如果是对象，递归代理
      if (typeof res === 'object' && res !== null) {
        return reactive(res)
      }
      return res
    },
    set(target, key, newValue, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 获取旧值
      const oldValue = target[key]
      // 只有添加属性时才触发与ITERATE_KEY相关的副作用函数
      const type = Array.isArray(target) 
      ? 
      // 判断当前设置的key是否小于数组长度，是则是SET，否则是ADD
      Number(key) < target.length ? 'SET' : 'ADD'
      :
      Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newValue, receiver)
      // receiver就是target的代理对象
      if (target === receiver.raw) {
        // 只有新旧值不相等，且新旧值都不是NaN时，才触发依赖
        if (oldValue!== newValue && (oldValue === oldValue || newValue === newValue)) {
          // 触发依赖
          trigger(target, key, type, newValue)
        }
      }
      return res;
    },
    // 拦截对象的 in 操作符
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    // 拦截对象的for in 操作符
    ownKeys(target) {
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    // 拦截对象的delete操作符
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (hadKey && result) {
        trigger(target, key, 'DELETE')
      }
      return result;
    } 
  }
}

/ 收集依赖
function track(target, key) {
  if (!activeEffect || !shouldTrack) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

// 触发副作用函数执行
function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  // 获取ITERATE_KEY对应的副作用函数
  const iteraterDeps = depsMap.get(ITERATE_KEY)
  // Set结构， 遍历时 delete add 同一项 会死循环，用新Set处理
  // 分支切换时，副作用函数执行前先删除所有依赖，执行后又会重新添加依赖，此时Set还在遍历
  // 解决方法： 使用新的Set结构，在遍历新的Set时，修改原Set
  const newDeps = new Set()
  // 将key对应的副作用函数添加到newDeps中
  deps && deps.forEach(fn => {
    // 避免无限循环 data.name = data.name + 'test', 同时设置和读取
    if (fn !== activeEffect) {
      newDeps.add(fn)
    }
  })

  // 当key为ITERATE_KEY时，需要将所有依赖添加到newDeps中
  if (type === 'ADD' || type === 'DELETE') {
    iteraterDeps && iteraterDeps.forEach(fn => {
      if (fn !== activeEffect) {
        newDeps.add(fn)
      }
    })
  }
  
  // 当修改数组的length属性时，需要将 index 大于等于新length的副作用函数添加到newDeps中
  // arr.length = 0 下面副作用函数应该重新执行
  /***
   * effect(() => {
   *  console.log (arr[0])
   * })
   */
  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((deps, key) => {
      if (key >= newVal) {
        deps.forEach(fn => {
          if (fn!== activeEffect) {
           newDeps.add(fn)
          }
        })
      }
    })
  }

  // 当设置数组时，长度大于数组length时，需要将length对应的副作用函数添加到newDeps中
  // arr = [1, 2]
  // arr[3] = 10  key > arr.length
  if (type === 'ADD' && Array.isArray(target)) {
    const lengthDeps = depsMap.get('length')
    lengthDeps && lengthDeps.forEach(fn => {
     if (fn!== activeEffect) {
      newDeps.add(fn)
     }
    })
  }

  newDeps.forEach(fn => {
    // 调度执行
    if (fn.options.scheduler) {
      fn.options.scheduler(fn)
    } else {
      fn()
    }
  })
}
```

### 代理Map和Set

本质就是重写Map和Set的原型方法，手动调用track和trigger


### 原始值的响应式

#### ref实现

``` js
function ref(value) {
  const wrapper = {
    value,
  }

  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })

  return reactive(wrapper)
}
```

#### 解决响应式丢失问题

``` js
// 解决响应式丢失
function toRefs(obj) {
  const ret = {}
  for (let key in obj) {
    ret[key] = toRef(obj, key)
  }
}

function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    set value(newValue) {
      obj[key] = newValue
    }
  }

  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })

  return wrapper
}

```

#### 自动脱ref

``` js
// 自动脱ref
function proxyRefs(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return res.__v_isRef? res.value : res
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key]
      if (oldValue.__v_isRef) {
        oldValue.value = newValue
        return true
      }
      return Reflect.set(target, key, newValue, receiver)
    }
  })
}
```

## 渲染器

``` js
// 渲染器
const platApis = {
  // 创建元素
  createElement: (tag) => {
    return document.createElement(tag)
  },
  // 卸载元素
  unmount: (vnode) => {
    const el = vnode.el
    const parent = el.parentNode
    if (parent) {
      parent.removeChild(el)
    }
  },
  // 设置元素文本
  setElementText: (el, text) => {
    el.textContent = text
  },
  // 插入元素
  inset: (el, parent, anchor) => {
    // debugger;
    parent.insertBefore (el, anchor)
  },
  // 创建文本节点
  createText(text) {
    return document.createTextNode(text)
  }
}
function renderer(platApis) {

  const { unmount, createElement, setElementText, inset, createText } = platApis || {}

  // 判断是否是对象
  function isObject(obj) {
    return obj !== null && Object.prototype.toString.call(obj) === '[object Object]'
  }

  // dom对象上有的属性通过el[key] = value 设置
  function shouldSetDomProperty(key, el) {
    return key in el
  }

  // 处理事件绑定与解绑
  function patchEventProps(el, key, newVal, oldVal) {

    const eventName = key.slice(2).toLowerCase()

    // 将事件处理函数缓存到一个对象，并重写绑定事件，提升更新时性能
    // 不然每次都要判断旧的事件函数是否存在，存在则移除，再绑定新的事件函数
    const invokers = el._evi || (el._evi = {})
    let existInvoker = invokers[key]

    if (newVal) {
      if (!existInvoker) {
        // 不存在缓存的事件函数
        existInvoker = el._evi[key] = (e) => {
          // 解决子组件点击事件修改响应式数据，触发父组件事件根据响应式数据绑定，导致冒泡到父组件
          // 方案 屏蔽事件执行时间小于时间绑定时间的事件函数
          const timeStamp = e.timeStamp
          if (timeStamp < existInvoker.attached) return;
          const value = existInvoker.value
          if (Array.isArray(value)) {
            value.forEach(fn => fn(e))
          } else {
            value(e)
          }
        }

        existInvoker.value = newVal
        // 记录事件绑定时间
        existInvoker.attached = performance.now()
        el.addEventListener(eventName, existInvoker) 
      } else {
        existInvoker.value = newVal
      }
    } else {
      if (existInvoker) {
        el.removeEventListener(eventName, existInvoker)
      }
    }
  }

  // 处理props
  function patchProps(el, key, value, oldVal) {
    // 处理特殊属性 form
    if (['form'].includes(key)) {
      el.setAttribute(key, value)
    } else if (key === 'class') {
      // 简单处理，可能是数组、对象
      el.className = value
    } else if (key === 'style') {
      // 简单处理，可能是数组
      if (isObject(value)) {
        for (let key in value) {
          el.style[key] = value[key]
        }
      }
      
    }
    else if (key.startsWith('on')) {
      // 处理事件
      patchEventProps(el, key, value, oldVal)
    } else if (shouldSetDomProperty(key, el)) {
      let bolValue = value

      // 处理disabled等布尔值属性
      if (typeof el[key] === 'boolean') {
        if (value === '') {
          bolValue = true
        }
      }
      el[key] = bolValue
    } else {
      el.setAttribute(key, value)
    }
  }

  // 挂载元素
  function mountedElement(vnode, container, anchor) {
   const tag = vnode.type
   const el = createElement(tag)

   vnode.el = el

   const { props, children } = vnode

   // 处理props
   if (isObject(props)) {
    for (const key in props) {
      patchProps(el, key, props[key])
    }
   }

   // 处理children
   if (children) {
    if (typeof children === 'string') {
      setElementText(el, children)
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        patch(child, null, el, anchor)
      })
    }
   }

   // 将当前元素挂载到容器中
   inset(el, container, anchor)
  }

  // 暴力更新新旧一组子节点
  function violence(n1, n2, el) {
    n2.forEach(child => unmount(child))
    n1.forEach(child => patch(child, null, el))
  }

  // 简单Diff 算法
  function simpleDiff(n1, n2, el) {
    for (let i = 0 ; i < n1.length; i++) {
      const child1 = n1[i]
      // 是否找到可复用节点
      let find = false
      // 记录寻找过程中的最大索引
      // 小于最大索引的节点需要移动
      let lastIndex = 0
      for (let j = 0 ; j < n2.length; j++) {
        const child2 = n2[j]
        if (child1.key === child2.key) {
          console.log ('find key', child1.key)
          patch(child1, child2, el)
          find = true
          // 需要移动
          if (j < lastIndex) {
            // 怎么移动？找到当前新节点的上一个节点的真实DOM的下一个兄弟节点，插入到它前面
            const prevChild = n1[i - 1]
            // 没有上一个节点，说明是第一个节点，不需要移动
            if (prevChild) {
              const anchor = prevChild.el.nextSibling
              inset(child1.el, el, anchor)
            } 
          } else {
            lastIndex = j
          }
          break;
        }
      }

      // 说明是新节点，需要挂载
      if (!find) {
        // 挂载的具体位置
        // 寻找新节点的上一个节点的真实DOM的下一个兄弟节点，没有用元素的第一个子节点        
        const prevChild = n1[i - 1]
        const anchor = prevChild ? prevChild.el.nextSibling : el.firstChild
        patch(child1, null, el, anchor)
      }
    }

    // 移除多余的旧节点
    for (let i = 0 ; i < n2.length; i++) {
      const oldChild = n2[i]
      const has = n1.find(child => child.key === oldChild.key)
      if (!has) {
        unmount(oldChild)
      }
    }

  }

  // 双端Diff算法
  function doubleDiff(n1, n2, el) {
    // 定义双端指针分别指向新旧两组子节点的头和尾
    let s1 = 0,
        s2 = 0,
        e1 = n1.length - 1,
        e2 = n2.length - 1;
    // 定义初始新旧头和尾节点
    let s1Node = n1[s1],
        e1Node = n1[e1],
        s2Node = n2[s2],
        e2Node = n2[e2];
    // 开启循环
    while(s1 <= e1 && s2 <= e2) {
      if (!e2Node) {
        e2Node = n2[--e2]
      } else if (!s2Node) {
        s2Node = n2[++s2]
      }
      // 新旧头节点可复用 
      else if (s1Node.key === s2Node.key) {
        patch(s1Node, s2Node, el)
        s1Node = n1[++s1]
        s2Node = n2[++s2]
      } 
      // 新旧尾节点可复用
      else if (e1Node.key === e2Node.key) {
        patch(e1Node, e2Node, el)
        e1Node = n1[--e1]
        e2Node = n2[--e2]
      }
      // 旧的头节点和新的尾节点可复用
      else if (s2Node.key === e1Node.key) {
        patch(e1Node, s2Node, el)
        // 说明尾部的新节点在旧节点中的头部，这时需要移动DOM, 将旧节点的头节点移动到尾部
        inset(s2Node.el, el, e2Node.el.nextSibling)
        e1Node = n1[--e1]
        s2Node = n2[++s2]
      }
      // 旧的尾节点和新的头节点可复用
      else if (e2Node.key === s1Node.key) {
        patch(s1Node, e2Node, el)
        // 说明头部的新节点在旧节点中的尾部，这时需要移动DOM, 将旧节点的尾节点移动到头部
        inset(e2Node.el, el, s1Node.el)
        s1Node = n1[++s1]
        e2Node = n2[--e2]
      } else {
        // 以上四种情况都不满足，说明新节点和旧节点都没有可复用的节点
        // 拿新节点中第一个节点在旧节点中查找是否有可复用节点
        const curOldNodeIndex = n2.find(child => child.key === s1Node.key)
        if (curOldNodeIndex > 0) {
          // 找到了，说明新节点在头部，这时需要移动DOM, 将当前旧节点移动到旧的头节点之前
          patch(s1Node, n2[curOldNodeIndex], el)
          inset(n2[curOldNodeIndex].el, el, s2Node.el)
          n2[curOldNodeIndex] = undefined
        } else {
          // 没有找到说明是新节点需要挂载
          patch(s1Node, null, el, s2Node.el)
        }
        s1Node = n1[++s1]
      }
    }

    // 挂载新元素
    if (s1 <= e1 && s2 >= e2) {
      for (let i = s1; i <= e1; i++) {
        const anchor = n1[e1 + 1] ? n1[e1 + 1].el : null
        patch(n1[i], null, el, anchor)
      }
    }

    // 移除旧元素
    if (s1 >= e1 && s2 <= e2) {
      for (let i = s2; i <= e2; i++) {
        unmount(n2[i])
      }
    }
  }

  // 最长递增子序列
  function lis(arr) {
    const p = arr.slice()
    const result = [0]
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0 ; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1]
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i)
          continue;
        }
        u = 0;
        v = result.length - 1;
        while(u < v) {
          c = ((u + v) / 2) | 0;
          if (arr[result[c]] < arrI) {
            u = c +1;
          } else {
            v = c;
          }
        }
      }

      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i;
      }
    }

    u = result.length;
    v = result[u - 1];
    while(u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result
  }

  // 快速Diff算法
  function quickDiff(n1, n2, el) {

    // 处理相同的前置节点
    let j = 0;

    let newNode = n1[j];
    let oldNode = n2[j];
    // debugger;

    while(newNode && newNode?.key === oldNode?.key) {
      patch(newNode, oldNode, el)
      j++
      oldNode = n2[j]
      newNode = n1[j]
    }

    // 处理相同的后置节点
    let e1 = n1.length - 1,
        e2 = n2.length - 1;

    if (j > e1 && j > e2 ) return ;

    newNode = n1[e1];
    oldNode = n2[e2];

    while(newNode && newNode?.key === oldNode?.key) {
      patch(newNode, oldNode, el)
      newNode = newNode[--e1]
      oldNode = oldNode[--e2]
    }
    debugger;

    // 挂载新节点
    if (j <= e1 && j > e2) {
      for (let i = j; i <= e1; i++) {
        const anchor = n1[i - 1] ? n1[i-1].el : null
        patch(n1[i], null, el, anchor)
      }
    }
    // 卸载旧节点
    else if ( j > e1 && j <= e2) {
      while(j <= e2) {
        unmount(n2[j++])
      }
    } 
    else {
      // 非理想情况
      // 构建一个剩余未处理的新子节点数组，存放在旧节点中的索引，使用他计算出一个最长递增子序列，用于辅助完成DOM的移动
      let count = e1 - j + 1
      let source = new Array(count).fill(-1)
      
      let s1 = j,
          s2 = j;
      // 可以使用map优化
      // for (let i = s2; i <= e2; i++) {
      //   const oldNode = n2[i]
      //   for (let k = s1; k <= e1; k++) {
      //     const newNode = n1[k]
      //     if (newNode.key === oldNode.key) {
      //       patch(newNode, oldNode, el)
      //       source[k - j] = i
      //     } else {
      //       unmount(n2[i])
      //     }
      //   }
      // }

      const newNodeMapIndex = {}
      for (let i = s1; i <= e1; i++) {
        const newNode = n1[i]
        newNodeMapIndex[newNode.key] = i
      }

      let move = false,
          pos = 0,
          // 更新过的节点数量
          patchCount = 0;

      for (let i = s2; i <= e2; i++) {
        const k = newNodeMapIndex[n2[i].key]
        // 更新后的数量小于等于需要更新的数量才需要更新
        if (patchCount <= count) {
          // 新旧节点有复用的key
          if (typeof k !== 'undefined') {
            patch(n1[k], n2[i], el)
            source[k - j] = i
            // 需要移动
            if (k < pos) {
              move = true
            } else {
              pos = k
            }
          } else {
            unmount(n2[i])
          }
        } else {
          unmount(n2[i])
        }
      }

      if (move) {
        // seq 为 source的最长递增子序列所对应的索引
        // 意义在于在剩余节点中进行编号，当索引在递增子序列中存在说明不需要移动
        const seq = lis(source)

        let s = seq.length - 1,
            // 最后一个元素下标
            i = count - 1;

        while( i >= 0) {
          if (source[i] === -1) {
            // 是新节点，需要挂载
            const newPos = i + s1
            const newNode = n1[newPos]
            const nextPos = newPos + 1
            const nextNode = n1[nextPos]
            const anchor = nextPos < n1.length ? nextNode.el : null
            patch(newNode, null, el, anchor)
          }
          else if (i !== seq[s]) {
            // 需要DOM移动
            const newPos = i + s1
            const newNode = n1[newPos]
            const nextPos = newPos + 1
            const nextNode = n1[nextPos]
            const anchor = nextPos < n1.length ? nextNode.el : null
            inset(newNode.el, el, anchor)
          } else {
            s --
          }
          i --
        }
      }
    }
    
  }

  // 更新子节点
  function patchChildren(n1, n2, el) {
    const child1 = n1.children
    const child2 = n2.children

    /**
     * 总共有9种情况
     * 1. 新节点是文本节点，旧节点可能是文本节点或一组节点或没有节点
     * 2. 新节点是一组节点，旧节点可能是文本节点或一组节点或没有节点
     * 3. 新节点没有， 旧节点可能是文本节点或一组节点或没有节点
    */
    if (typeof child1 === 'string') {
      if (Array.isArray(child2)) {
        child2.forEach(child => {
          unmount(child)
        })
      } else {
        if (child1 !== child2) {
          setElementText(el, child1)
        }
      }
      
    } else if (Array.isArray(child1)) {
      if (Array.isArray(child2)) {
        // 这是新旧节点都是一组节点
        /**
         * 暴力做法
         * 1. 遍历旧节点逐一卸载
         * 2. 遍历新节点逐一挂载
        */
        // violence(child1, child2, el)       
        // 使用Diff算法进行优化，减少DOM操作次数或DOM移动次数
        // 简单Diff算法，减少DOM操作次数
        /**
         * 1. 遍历新节点，在旧节点中查找是否有可复用节点（通过key）
         * 2. 如果有可复用节点，更新节点, 记录找到，判断是否需要移动DOM, 如何移动
         *    - 判断移动 记录遍历中的最大索引，小于最大索引的节点需要移动
         *    - 如何移动 找到当前新节点的上一个节点的真实DOM的下一个兄弟节点，插入到它前面，没有为第一个子节点
         * 3. 没有没有找到可复用节点，挂载新节点（描点为当前节点的上一个节点对应的真实DOM的下一个兄弟节点，没有为第一个子节点）
         * 4. 遍历旧节点，在新节点中查找是否有可复用节点（通过key）
         *    如果没有找到可复用节点，卸载旧节点
        */
        // simpleDiff(child1, child2, el)
        // 双端Diff算法, 减少DOM移动次数
        /**
         * 1. 定义四个指针分别指向新旧节点的头尾, 定义四个节点指向新旧节点的头尾
         * 2. 当新的头指针小于等于新的尾指针，旧的头指针小于等于旧的尾指针，开启循环
         * 3. 在4个节点中查找可复用的节点，找到后更新节点，看是否需要移动DOM，移动DOM
         * 4. 未找到可复用节点，拿新头节点在旧的一组节点中查找是否有可复用的节点
         *    - 有，更新节点 ， 移动DOM，移动到旧节点头部之前
         *    - 没有，挂载新节点（描点为旧节点的头节点）
         * 5. 如果有剩余新节点，遍历挂载
         * 5. 如果有剩余旧节点，遍历卸载
        */
        // doubleDiff(child1, child2, el)
        // 快速Diff算法，性能最好
        /**
         * 1. 处理相同的前置节点
         * 2. 处理相同的后置节点
         * 3. 如果有剩余新节点，遍历挂载
         * 4. 如果有剩余旧节点，遍历卸载
         * 5. 否则，处理非理想情况
         *    - 使用剩余节点构造出一个最长递增子序列，用于辅助完成DOM的移动
        */
        quickDiff(child1, child2, el)
      } else {
        setElementText(el, '')
        child1.forEach(child => {
          patch(child, null, el)
        })
      }
    } else {
      if (Array.isArray(child2)) {
        child2.forEach(child => {
          unmount(child)
        })
      } else {
        setElementText(el, '')
      }
    }
  }

  // 更新节点
  // n1: 新的虚拟节点 n2: 旧的虚拟节点
  function patchElement(n1, n2, container) {

    const el = n1.el = n2.el;

    // 处理props
    const oldProps = n2.props || {}
    const newProps = n1.props || {}

    // 更新props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, newProps[key], oldProps[key])
      }
    }

    // 删除新节点中没有的props
    for (const key in oldProps) {
      if (!key in newProps) {
        patchProps(el, key, undefined, oldProps[key])
      }
    }

    // 处理children
    patchChildren(n1, n2, el)
  }

  // 解析props 返回props和attr
  function resolveProps(propsOptions, propsData) {
    let attrs = {

    }

    let props = {

    }

    // 遍历组件传递的props
    for (let key in propsData) {
      // 如果组件传递的props在组件自身的props选项中定义或事件，则为props,否则为attrs
      if (key in propsOptions || key.startsWith('on')
      ) {
        props[key] = propsData[key]
      } else {
        attrs[key] = propsData[key]
      }
    }

    return [props, attrs]


  }

  // 判断子节点的props是否有改变
  function hasPropsChange(newProps, oldProps) {
    const newKeys = Object.keys(newProps).length
    // 数量不等说明改变了
    if (newKeys.length !== Object.keys(oldProps).length) return true

    // 有不相等的属性说明改变了
    for (let i = 0; i < newKeys; i++) {
      const key = newKeys[i]
      if (newProps[key] !== oldProps[key]) return true
    }
    return false
  }

  // 存储当前的组件实例
  let currentInstance = null;
  // 设置当前组件实例
  function setCurrentInstance (instance) {
    currentInstance = instance
  }

  function onMounted(fn) {
    if (currentInstance) {
      currentInstance.mount.push(fn)
    } else {
      console.log ('onMounted called setup ')
    }
  }

  // 挂载组件
  function mountedComponent(n1, container, anchor) {
    const { render, data, props: propsOptions, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated, setup } = n1.type ;
    // 组件状态与自更新
    const state = reactive(data())

    // 父组件自更新，导致子组件props改变，触发子组件更新
    const [props, attrs] = resolveProps(propsOptions, n1.props)

    beforeCreate && beforeCreate()
    // 创建组件实例
    const instance = {
      state,
      isMounted: false,
      props: shallowReactive(props),
      subTree: null,
      _attrs: attrs,
      mount: []
    }

    // emit
    function emit(event, ...args) {
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
      const handler = instance.props[eventName]
      if (handler) {
        handler(...args)
      } else {
        console.log ('event no exsit')
      }
    } 

    const slots = n1.children || {}

    // setup函数实现
    const setupContext = {
      attrs,
      emit,
      slots
    }
    setCurrentInstance(instance)
    const setupResult = setup(shallowReactive(props), setupContext)
    setCurrentInstance(null)

    let setupState = null
    if (isObject(setupResult)) {
      setupState = setupResult
    } else if (typeof setupResult === 'function') {
      if (render) {
        console.log ('Error: options render will ignore')
      }
      render = setupResult
    }  else {
      console.log ('Error: setup must return object or function')
    }

    n1.component = instance
    // 实例上下文，在生命周期和渲染函数中可以通过this访问到state/props
    const renderContext = newProxy(instance, {
      get(target, key) {
        if (key === '$slots') return slots;
        const { state, props } = target
        if (state && key in state) {
          return state[key]
        }
        if (key in props) {
          return props[key]
        }

        if (setupState && key in setupState) {
          return setupState[key]
        }

        console.log ('NO key')

      },
      set(target, key, newVal) {
        const { state, props } = target;

        if (state && key in state) {
          state[key] = newVal
        } else if ( key in props) {
          props[key] = newVal
        } else if (setupState && key in setupState) {
          setupState[key] = newVal
        }
        else {
          console.log ('Error No key')
        }
      }
    })
    created && created.call(renderContext)

    // state改变会自动重新渲染
    effect(() => {
      const subTree = render.call(renderContext, state);
      // 组件状态改变会触发自更新
      if (!instance.isMounted) {
        beforeMount && beforeMount.call(renderContext)
        patch(subTree, null, container, anchor)
        instance.isMounted = true;
        mounted && mounted.call(renderContext)
        // setup的mounted
        instance.mount && instance.mount.forEach(hook => hook.call(renderContext))

      } else {
        beforeUpdate && beforeUpdate.call(renderContext)
        // 更新
        patch(subTree, instance.subTree, container, anchor)
        updated && updated.call(renderContext)
      }

      instance.subTree = subTree;
      
    }, {
      // 处理
      scheduler: flushJob
    })
  }

  // 更新组件，被动更新，父组件状态变化，导致子组件更新
  function patchComponent(n1, n2, anchor) {
    // 此时需要判断子组件的props是否有更新，有则更新子组件props从而更新子组件
    const instance = n1.component = n2.component;

    const { props } = instance;

    if (hasPropsChange(n1.props, n2.props)) {
      const [newProps] = resolveProps(n1.type.props, n1.props)
      for (let k in newProps) {
        props[k] = newProps[k]
      }
      // 删除不存在的key
      for (let k in props) {
        if (!k in newProps) delete props[k]
      }
    }
  }

  const TEXT_NODE = Symbol('text')
  const FRAGMENT = Symbol()

  // n1: 新的虚拟节点 n2: 旧的虚拟节点
  // container: 挂载容器
  // anchor: 在anchor节点之前插入新节点
  function patch(n1, n2, container, anchor) {
    // 新旧节点的type不同，说明不能复用，直接卸载旧节点，重新挂载新节点
    if (n1 && n2 && n1.type !== n2.type) {
      unmount(n2)
      n2 = null;
    }

    const { type } = n1

    // 处理普通标签节点
    if (typeof type === 'string') {
      if (!n2) {
        mountedElement(n1, container, anchor)
      } else {
        patchElement(n1, n2, container)
      }
    }
    // 处理组件渲染
    else if (isObject(type)) {
      if (!n2) {
        mountedComponent(n1, container, anchor)
      } else {
        patchComponent(n1, n2, anchor)
      }
    }
    // 处理文本节点
    else if (type === TEXT_NODE) {
      if (!n2) {
        const el = n1.el = createText(n1.children)
        inset(el, container)
      } else {
        const el = n1.el = n2.el;
        if (n1.children !== n2.children) {
          setElementText(el, n1.children)
        }
      }
    }
    // 处理Fragment
    else if (type === FRAGMENT) {
      if (!n2) {
        n1.children.forEach(child => patch(child, null, container))
      } else {
        patchChildren(n1, n2, container)
      }
    }
  }

  // 渲染函数 将虚拟节点渲染为真实Dom
  function render(vnode, container) {
    // debugger;
    if (vnode) {
      patch(vnode, container._vnode, container)
    } else {
      if (container._vnode) {
        unmount(container._vnode)
      }
    }
    container._vnode = vnode
  }

  return {
    render
  }
}
```

## 编译器

模版 -> parser(词法分析和语法分析) ->生成 模版AST -> transformer（转换成） -> jsAST -> 代码生成 -> 渲染函数（render）




