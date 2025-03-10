# 浏览器

进程：CPU开启一个任务调度的单位

每个浏览器Tab都会单独开启一个进程
浏览器有一个主进程（用户界面）

每个Tab各自有独立的渲染进程（浏览器内核Renderer,渲染引擎）、网络进程（网络请求）、GPU进程（动画与3D绘制）、插件进程（devtool）

每个进程里包含多个线程运行


渲染进程：GUI渲染线程（渲染页面）、JS引擎线程
        GUI渲染与JS引擎线程运行互斥（JS引擎任务空闲时GUI渲染更新）

        GUI渲染线程：
                解析HTML、CSS
                构建DOM、Render树
                初始布局与绘制
                重绘与回流（当dom或css变化）
        JS引擎线程：
               JS内核线程
               一个主线程与多个辅助线程配合
               一个浏览器只有一个JS引擎（解析JS脚本，运行JS代码）

        事件：

        事件触发线程：事件环EventLoop线程
        事件线程：用户交互事件、setTimeout、Ajax

        宏任务与微任务：
        创建线程的目的是为了实现异步的执行条件
        宏任务：宿主提供的异步方法和任务（script脚本、setTimeout、UI渲染、dom事件、ajax）
        微任务：语言标准ECMA262提供的API运行（Promise、MutationObserver）


## 事件环EventLoop

                宏任务队列
              （Script、setTimeout的回调函数、dom事件的回调函数）
          /                        \
                                    
  JS引擎线程
    调用栈                         GUI渲染

           \                    /

                微任务队列
               Promise.then的回调函数

执行步骤：
1. Js引擎将Script宏任务取到调用栈中执行
   同步的代码直接执行，
   遇到异步的微任务执行后将微任务的回调函数添加到微任务队列，
   遇到异步宏任务执行后将宏任务的回调函数添加到宏任务队列，
2. 脚本执行完成后
3. 清空微任务队列（将所有的微任务取出并执行）
4. GUI页面渲染
5. 取出宏任务队列中的一个任务依次执行1->2->3->4

同步代码 -> 异步微任务代码 -> 渲染 -> 异步的宏任务代码

**练习题：**

1. GUI渲染

``` js
/***
 * 调用栈
 * script 
 * 1
 * body = 'red'
 * 4
 * 2
 * body = 'green'
 * GUI渲染
 * 3
 * body = 'yellow'
 * 
 * 
 * 宏任务
 * 宏任务队列
 *   setTimeout1
 *   setTimeout1 cb
 * 
 * 
 * 微任务 
 * 微任务队列
 *   promise1
 *   promise1 then
 */

console.log(1)
document.body.style.background = 'red';

Promise.resolve().then(() => {
  console.log (2)
  document.body.style.background = 'green'
})

setTimeout(() => {
  console.log (3)
  document.body.style.background = 'yellow'
})

console.log (4)

// 1 4 2 3
```

2. new Promise()
``` js
/**
 * 调用栈
 * script
 * 1
 * promise1 
 * 2
 * 8
 * 4
 * 3
 * 5
 * 6
 * 7
 * 
 * 
 * 
 * 宏任务
 * 宏任务队列
 * setTimeout1
 * setTImeout1 cb -> X : 3
 * 
 * setTimeout2
 * setTimeout2 cb -> X : 5
 * 
 * 微任务
 * 微任务队列
 * promise1
 * promise1 then -> X : 4
 * 
 * promise2
 * promise2 then -> X : 7
*/
console.log (1)

new Promise((resolve) => {
  console.log (2)
  setTimeout(() => {
    console.log (3)
  })
  resolve(4)
}).then(res => {
  console.log (res)
})

setTimeout(() => {
  console.log (5)
  new Promise((resolve) => {
    console.log (6)
    resolve()
  }).then(() => {
    console.log (7)
  })
})

console.log(8)

// 1 2 8 4 3 5 6 7
```

3. async和await 
``` js
/**
 * 调用栈
 * script
 * 1
 * 2
 * 3
 * 7
 * 13
 * 6
 * 9
 * 20
 * 4
 * 8
 * 11
 * 12
 * 
 * 宏任务队列
 * 
 * setTimeout1 -> 20 X
 * setTimeout2 -> 8 X
 * setTimeout3 -> 11 X
 * setTimeout4 -> 12
 * 
 * 微任务队列
 * 
 * promise1 -> 6 X
 * promise2 -> 9 X 
 * promise3 -> 4 X
 * 
 * 
 * 
 * 
*/
console.log (1)
let res = function () {
  console.log (2)
  new Promise((resolve) => {
    console.log (3)
    setTimeout(() => {
      console.log (20)
      new Promise((resolve) => {
        resolve()
      }).then(() => {
        console.log (4)
      })
    })
    resolve(5)
  })
}

async function test1 () {
  /**
   * 下面的代码等同于
   * let res2 = res().then(res => {
   *   console.log(6)
   * })
  */
  let res2 = await res()
  console.log (6)
}

test1()

new Promise((resolve, reject) => {
  console.log (7)
  setTimeout(() => {
    console.log (8)
  })
  reject(9)
}).then(() => {
  console.log (10)
}, (err) => {
  console.log (err)
})

setTimeout(() => {
  console.log (11)
})

setTimeout(() => {
  console.log (12)
}, 100)

console.log (13)

```

4. 用户点击事件，用户触发按钮，会依次执行回调函数；手动触发相当于直接执行了两个函数
``` js
const oBtn = document.getElementById('btn')
oBtn.addEventListener('click', function () {
  console.log (1)
  new Promise((resolve) => {
    resolve()
  }).then(() => {
    console.log ('m1')
  })
})
oBtn.addEventListener('click', function () {
  console.log (2)
  new Promise((resolve) => {
    resolve()
  }).then(() => {
    console.log ('m2')
  })
})

// 手动调用，相当于直接执行了两个函数
/**
 * 相当于
 * function h1() {
 *   console.log (1)
 *   new Promise((resolve) => {
 *    resolve()
 *   }).then(() => {
 *     console.log ('m1')
 *   })
 * }
 * * function h2() {
 *   console.log (2)
 *   new Promise((resolve) => {
 *    resolve()
 *   }).then(() => {
 *     console.log ('m2')
 *   })
 * }
 * h1()
 * h2()
*/
oBtn.click(); // 1 2 m1 m2

// 用户触发按钮，会依次执行回调函数
// 结果 1 m1 2 m2
```

5. setInterval定时器，未清空前执行一次都会再添加到宏任务队列
``` js
/**
 * 执行栈
 * start
 * promise1
 * promise2
 * setInterval
 * setTimeout1
 * promise3
 * promise4
 * setInterval
 * setTimeout2
 * promise5
 * promise6
 * 
 * 
 * 
 * 宏任务队列
 *   setInterval cb X
 *   setTimeout1 cb X
 *   setInterval cb X
 *   setTimeout2 cb X
 *   setInterval
 * 微任务队列
 *   promise1 cb X
 *   promise2 cb X
 *   promise3 cb X
 *   promise4 cb X
 *   promise5 cb X
 *   promise6 cb
 *   promise7 cb
 *   promise8 cb
 * 
 */

console.log ('start')
const interval = setInterval(() => {
  console.log ('setInterval')
},0)

setTimeout(() => {
  console.log ('setTimeout 1')
  Promise.resolve()
  .then(() => {
    console.log ('promise 3')
  })
  .then(() => {
    console.log ('promise 4')
  })
  .then(() => {
    setTimeout(() => {
      console.log ('setTimeout 2')
      Promise.resolve()
      .then(() => {
        console.log ('promise 5')
      })
      .then(() => {
        console.log ('promise 6')
      })
      .then(() => {
        clearInterval(interval)
      })
    }, 0)
  })
}, 0)

Promise.resolve()
.then(() => {
  console.log ('promise 1')
})
.then(() => {
  console.log ('promise 2')
})
```

6. 头条
``` js
/**
 * 执行栈
 * script start
 * a1 start
 * async2
 * promise1
 * script end
 * a1 end
 * promise2
 * setTimeout
 * 
 * 
 * 宏任务
 * setTimeout1 cb X
 * 
 * 微任务
 * promise1 cb X
 * promise2 cb X
*/
async function async1() {
  console.log ('a1 start')
  /**
   * async2().then(() => {
   *   console.log ('a1 end')
   * })
  */
  await async2();
  console.log ('a1 end')
}

async function async2() {
  console.log ('async2')
}

console.log ('script start')
setTimeout(function () {
  console.log ('setTimeout')
}, 0)
async1()
new Promise((resolve) => {
  console.log ('promise1')
  resolve()
})
.then(() => {
  console.log ('promise2')
})
console.log ('script end')
```
           

## 输入url全流程
 
**整体流程**

用户输入 、 URL请求过程 、 准备渲染进程 、 提交文档 、  渲染阶段

1. 用户输入

用户输入查询关键词，地址栏会判断关键字是搜索内容还是请求URL，是搜索内容的会使用浏览器默认的搜索引擎来合成来搜索关键字的URL；
回车之前浏览器还给了当前页面一次执行beforeunload事件的机会，允许页面在退出之前执行一些数据清理操作，取消导航；
同意继续导航后，进入加载状态，此时页面显示的还是之前页面等待提交文档阶段，页面内容才会被替换

2. URL请求过程

浏览器进程通过进程间通信把URL请求发送到网络进程，发起真正的请求流程

  1. 首先网络进程会查找本地是否缓存了该资源，有缓存直接返回资源给浏览器进程，没有进入网络请求流程
  2. 网络请求流程
    1. DNS解析，获取请求域名对应的服务器IP地址，如果是https还需建立TLS连接 
    2. 利用IP地址和服务器建立TCP连接，连接建立后浏览器构建请求行、请求头等信息，并把该域名相关的cookie等数据添加到请求头，向服务器发送构建的请求信息
    3. 服务器收到请求信息后，会根据请求信息生成响应数据（响应行、响应头、响应体）等信息，并发给网络进程，网络进程收到响应行和响应头后开始解析内容
      1. 重定向：当返回的状态码是301或者302网络进程会从响应头的Location字段重定向到其他URL，重走一遍URL请求流程
      2. 响应状态为200成功后，浏览器会根据响应头中的ContentType的值来决定响应体内容
      如是下载类型，该请求会被提交给浏览器下载管理，请求结束
      如是Html，继续导航

3. 准备渲染进程

浏览器为每个页面分配一个渲染进程，打开新的页面都会使用单独的渲染进程（同一个站点不同页面会复用渲染进程）

4. 提交文档

浏览器进程将网络进程收到的html数据提交给渲染进程
  1. 首先当浏览器进程收到网络进程的响应数据后，向渲染进程发起提交文档消息
  2. 渲染进程收到提交文档消息后，会和网络进程建立传输数据的管道
  3. 数据传输完成后，渲染进程会返回确认提交消息给浏览器进程
  4. 浏览器进程收到确定提交消息后，更新浏览器界面状态（安全状态、地址栏url、前进后退历史状态，更新web页面）

5. 渲染阶段

文档提交后，渲染进程开始页面解析和子资源加载


## 渲染流程

**有详细内容**
1. 构建DOM树
2. 样式计算
3. 构建布局树
4. 分层树（具有层叠上下文属性的元素（需要剪裁的地方） 会被提升为单独的一层）
5. 图层绘制（根据分层树拆分绘制步骤生成绘制列表）
6. 分块和光栅化（图层绘制列表准备好后，主线程提交给合成线程，合成线程将图层划分为图块，根据可视区域通过光栅化（快速光栅化使用GPU）优先生成位图，）
7. 合成（合成线程生成绘制图块的命令将命令提交给浏览器进程，浏览器进程根据图块命令将页面绘制到内存中，最后将内存显示到屏幕上）

**整体**
1. 渲染进程将 HTML 内容转换为能够读懂的 DOM 树结构。
2. 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式
3. 创建布局树，并计算元素的布局信息。
4. 对布局树进行分层，并生成分层树。
5. 为每个图层生成绘制列表，并将其提交到合成线程。
6. 合成线程将图层分成图块，并在光栅化线程池中将图块转换成位图。
7. 合成线程发送绘制图块命令 DrawQuad 给浏览器进程。
8. 浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。



