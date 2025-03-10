# Promise 实现

## 1. 简单promise

使用发布订阅模式解决excutor有异步调用问题

``` js
const _status = {
  pending: 'PENDING',
  fulfilled: 'FULFILLED',
  rejected: 'REJECTED'
}

function MyPromise (excutor) {
  this.status = _status['pending']
  this.value = ''
  this.reason = ''
  this.onFulfilledCallback = []
  this.onRejectedCallback = []

  // 注意：resolve，reject使用箭头函数，避免this丢失
  const resolve = (value) => {
    if (this.status === _status['pending']) {
      this.status = _status['fulfilled']
      this.value = value

      // 发布成功的列表
      if(this.onFulfilledCallback.length) this.onFulfilledCallback.forEach(fn => fn())
    }
  }

  const reject = (reason) => {
    if(this.status === _status['pending'] ) {
      this.status = _status['rejected']
      this.reason = reason

      // 发布失败的列表
      if(this.onRejectedCallback.length) this.onRejectedCallback.forEach(fn => fn())
    }
  }

  excutor(resolve, reject)
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.status === _status['fulfilled']) {
    return onFulfilled(this.value)
  }

  if (this.status === _status['rejected']) {
    return onRejected(this.reason)
  }

  // 处理异步问题
  // 使用发布订阅模式
  // 此时状态为pending

  // 订阅成功的回调
  this.onFulfilledCallback.push(() => {
    onFulfilled(this.value)
  })
  // 订阅失败的回调
  this.onRejectedCallback.push(() => {
    onRejected(this.reason)
  })
}

const p = new MyPromise((resolve, reject) => {
  resolve('success')
})

p.then(res => {
  console.log (res, 'res===')
})

const p1 = new MyPromise((resolve) => {
  setTimeout(() => resolve('async success'), 2000)
})

p1.then(res => console.log (res, 'res2'))
```

## 2. promise链式调用

then后返回一个新的promise，并处理返回的值

``` js
const _status = {
  pending: 'PENDING',
  fulfilled: 'FULFILLED',
  rejected: 'REJECTED'
}

function MyPromise (excutor) {
  this.status = _status['pending']
  this.value = ''
  this.reason = ''
  this.onFulfilledCallback = []
  this.onRejectedCallback = []

  // 注意：resolve，reject使用箭头函数，避免this丢失
  const resolve = (value) => {
    if (this.status === _status['pending']) {
      this.status = _status['fulfilled']
      this.value = value

      // 发布成功的列表
      if(this.onFulfilledCallback.length) this.onFulfilledCallback.forEach(fn => fn())
    }
  }

  const reject = (reason) => {
    if(this.status === _status['pending'] ) {
      this.status = _status['rejected']
      this.reason = reason

      // 发布失败的列表
      if(this.onRejectedCallback.length) this.onRejectedCallback.forEach(fn => fn())
    }
  }

  try {
    excutor(resolve, reject)
  } catch(e) {
    reject(e)
  }
}

// 处理then返回值
function resolvePromise(promise2, x, resolve, reject) {

  // promise2与x是同一个引用返回typeError
  if(promise2 === x) return reject(new TypeError('called stack over'))

  // 定义flag，防止重复执行（执行了resolve,再执行reject）
  let flag = false
  // 判断x的类型
  // 是对象或者函数可能是一个promise，不是代表是普通值，直接resolve
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then
      // x.then是函数代表是promise
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (flag) return 
          flag = true
          // 需要递归执行resolvePromise，解决深度嵌套
          resolvePromise(x, y, resolve, reject)
        }, (r) => {
          if (flag) return 
          flag = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch(e) {
      if (flag) return 
      flag = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 给回调函数重新赋值，解决链式调用穿透问题(p.then().then().then().then(res=> res))
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
  onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {throw reason}
  // 链式调用的本质就是返回一个新的promise
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === _status['fulfilled']) {
      setTimeout(() => {
        try{
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    } else if (this.status === _status['rejected']) {
      setTimeout(() => {
        try{
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    } else {
      // 处理异步问题
      // 使用发布订阅模式
      // 此时状态为pending
    
      // 订阅成功的回调
      this.onFulfilledCallback.push(() => {
        try{
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
      // 订阅失败的回调
      this.onRejectedCallback.push(() => {
        try{
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    }
  })

  return promise2

}

MyPromise.prototype.catch = function (catchCallBack) {
  this.then(null, catchCallBack)
}

// 返回相同的promise
// const p = new MyPromise((resolve, reject) => {
//   resolve('success')
// })

// let p1 = p.then(res => {
//   console.log (res, 'res===')
//   return p1
// })
// p1.then(res => {
//   console.log (res, 'then-')
// }, (error) => console.log (error, 'error'))

const p = new MyPromise((resolve, reject) => {
  resolve('success')
})

// p.then(res => res)
// .then(res => {
//   console.log (res, 'res====')
// }, (r) => {
//   console.log (r, 'reject')
// })
p.then((res) => {
  return new MyPromise((resolve, reject) => {
    // resolve(res)
    // reject(res)
    // setTimeout(() => resolve(res + ' 2000'), 2000)
    // resolve(new MyPromise((resolve, reject) => {
    //   resolve(res + ' more promise ')
    // }))
    setTimeout(() => {
      resolve(new MyPromise((resolve, reject) => {
        resolve(res + ' more promise ')
      }))
    }, 2000)
  })
}).then().then((res) => {
  console.log (res, 'res')
}).catch(e => console.log (e, 'e'))
```

## 3. promise静态方法及周边

``` js
const _status = {
  pending: 'PENDING',
  fulfilled: 'FULFILLED',
  rejected: 'REJECTED'
}

function isPromise (x) {
  return ((typeof x === 'object' && x !== null) || typeof x === 'function') && typeof x.then === 'function'
}

function isIterable (x) {
  return (typeof x === 'object' && x !== null) && typeof x[Symbol.iterator] === 'function'
}

function MyPromise (excutor) {
  this.status = _status['pending']
  this.value = ''
  this.reason = ''
  this.onFulfilledCallback = []
  this.onRejectedCallback = []

  // 注意：resolve，reject使用箭头函数，避免this丢失
  const resolve = (value) => {
    // 如果value是promise需要单独处理
    // resolve(new Promise((resolve, reject) => {}))
    if (isPromise(value)) {
      value.then(value => {
        resolve(value)
      }, reason => {
        reject(reason)
      })
      return 
    }
    if (this.status === _status['pending']) {
      this.status = _status['fulfilled']
      this.value = value

      // 发布成功的列表
      if(this.onFulfilledCallback.length) this.onFulfilledCallback.forEach(fn => fn())
    }
  }

  const reject = (reason) => {
    if(this.status === _status['pending'] ) {
      this.status = _status['rejected']
      this.reason = reason

      // 发布失败的列表
      if(this.onRejectedCallback.length) this.onRejectedCallback.forEach(fn => fn())
    }
  }

  try {
    excutor(resolve, reject)
  } catch(e) {
    reject(e)
  }
}

// 处理then返回值
function resolvePromise(promise2, x, resolve, reject) {

  // promise2与x是同一个引用返回typeError
  if(promise2 === x) return reject(new TypeError('called stack over'))

  // 定义flag，防止重复执行（执行了resolve,再执行reject）
  let flag = false
  // 判断x的类型
  // 是对象或者函数可能是一个promise，不是代表是普通值，直接resolve
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then
      // x.then是函数代表是promise
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (flag) return 
          flag = true
          // 需要递归执行resolvePromise，解决深度嵌套
          resolvePromise(x, y, resolve, reject)
        }, (r) => {
          if (flag) return 
          flag = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch(e) {
      if (flag) return 
      flag = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 给回调函数重新赋值，解决链式调用穿透问题(p.then().then().then().then(res=> res))
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
  onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {throw reason}
  // 链式调用的本质就是返回一个新的promise
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === _status['fulfilled']) {
      setTimeout(() => {
        try{
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    } else if (this.status === _status['rejected']) {
      setTimeout(() => {
        try{
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    } else {
      // 处理异步问题
      // 使用发布订阅模式
      // 此时状态为pending
    
      // 订阅成功的回调
      this.onFulfilledCallback.push(() => {
        setTimeout(() => {
        try{
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
        })
      })
      // 订阅失败的回调
      this.onRejectedCallback.push(() => {
        setTimeout(() => {
        try{
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
        })
      })
    }
  })

  return promise2

}

MyPromise.prototype.catch = function (catchCallBack) {
  this.then(null, catchCallBack)
}

// 无论成功或失败都要走,使用promise.resolve
MyPromise.prototype.finally = function (callBack) {
  this.then((value) => {
    MyPromise.resolve(callBack()).then(() => value)
  },
  (reason) => {
    MyPromise.resolve(callBack()).then(() => { throw reason })
  })
}

//静态方法
MyPromise.resolve = function (value) {
  return new MyPromise((resolve, reject) => {
    resolve(value)
  })
}

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}

// 列表中的所有的promise成功后才会返回成功，普通值直接返回
MyPromise.all = function (asyncList) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(asyncList)) return reject(new TypeError('You Must give a Array'))
    if (asyncList.length === 0) return resolve([])
    let resArr = [],
        idx = 0;
    asyncList.map((promise, index) => {
      if (isPromise(promise)) {
        promise.then((value) => {
          resolvePromiseList(value, index, resolve)
        }, (reason) => {
          reject(reason)
        })
      } else {
        resolvePromiseList(promise, index, resolve)
      }
    }) 
    
    function resolvePromiseList (x, index, resolve) {
      resArr[index] = x
      // 如果++idx等于asyncList.length说明已经执行完了，需要resolve最后的结果
      // 不能使用resArr.length === asyncList.length是因为异步执行时同步任务先执行后导致前端的项为空 [emty, emty, 1]
      if(++idx === asyncList.length) {
        resolve(resArr)
      }
    }
  })
}

// 不管成功或失败都会返回
MyPromise.allSettled = function (asyncList) {
  return new MyPromise((resolve, reject) => {
    if (!isIterable(asyncList)) return reject(new TypeError('You must provide a iterable object'))
    if (asyncList.length === 0) return resolve([])

    let resArr = [],
        idx = 0;

    asyncList.map((promise, index) => {
      if (isPromise(promise)) {
        promise.then((value) => {
          resolvePromiseList({
            status: 'fulfilled',
            value
          }, index, resolve)
        }, (reason) => {
          resolvePromiseList({
            status: 'rejected',
            value: reason
          }, index, resolve)
        })
      } else {
        resolvePromiseList({
          status: 'fulfilled',
          value: promise
        }, index, resolve)
      }
    })

    function resolvePromiseList(x, index, resolve) {
      resArr[index] = x
      if (++idx === asyncList.length) {
        resolve(resArr)
      }
    }
  })
}

// 谁先执行完就resolve谁
MyPromise.race = function (asyncList) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(asyncList)) return reject(new TypeError('You Must give a Array'))
    if (asyncList.length === 0) return resolve([])
    asyncList.map((promise) => {
      if (isPromise(promise)) {
        promise.then(resolve, reject)
      } else {
        resolve(promise)
      }
    })
  })
}

const p1 = new MyPromise((resolve, reject) => {
  reject('err 500')
})
const p2 = new MyPromise(resolve => {
  setTimeout(() => {
    resolve('async 200')
  })
})

const promiseList = [
  2,
  p2,
  p1,
]

MyPromise.all(promiseList).then(res => {
  console.log (res, 'res')
}, (err) => {
  console.log (err, 'err')
})

MyPromise.allSettled(promiseList).then(res => {
  console.log (res, 'res')
}, (err) => {
  console.log (err, 'err')
})

MyPromise.race(promiseList).then(res  => {
  console.log (res, 'res==')
}, (err) => {
  console.log (err, 'err===')
})
```

## 4. promises 将回调的函数转成promise可以链式调用

``` js
function promises (fn) {
  if (typeof fn !== 'function') return 
  return function (...args) {
    return new MyPromise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }
}

function promisesAll(obj) {
  if (typeof obj !== 'object') return
  Object.keys(obj).map((name) => {
    if (typeof obj[name] === 'function') {
      obj[name + 'Async'] = promises(obj[name])
    }
  })
  return obj
}

const fs = require('fs')
fs.readFile('./index.js', 'utf-8', (err, data) => {
  if (err) {
    return err
  }

  return data
})

const asyncReadFile = promises(fs.readFile)
asyncReadFile('./index.js', 'utf-8').then(res => {
  console.log (res)
}).catch(e => console.log (e))


const newFs = promisesAll(fs)
newFs.readFileAsync('./index.js', 'utf-8')
.then(res => console.log (res), err => console.log (err))

```