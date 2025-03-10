# 总结

## 一、JS篇

### 1.1、作用域和作用域链

#### 1.1.1、作用域（存储变量的规则）

作用域是当前的执行上下文，值和表达式在其中“可见”或可被访问。如果一个变量或表达式不在当前的作用域中，那么它是不可用的。作用域也可以堆叠成层次结构，子作用域可以访问父作用域，反过来则不行。

#### 1.1.2、JavaScript 的作用域分以下四种：

1. 全局作用域：脚本模式运行所有代码的默认作用域
2. 模块作用域：模块模式中运行代码的作用域
3. 函数作用域：由函数创建的作用域
4. 块级作用域：用一对花括号（一个代码块）创建出来的作用域（let,const）

#### 1.1.3、作用域链

``` js

function bar () {
  console.log (name)
}

function foo () {
  var name = 'foo'
  console.log (name)
  bar()
}
var name = 'bar'
foo()

// foo bar

function foo () {
  var name = 'foo'
  console.log (name)
  function bar() {
    console.log (name)
  }
  bar()
}
var name = 'bar'
foo()

// foo foo

```
1. 编译阶段，创建全局执行期上下文（name: undefined）压入调用栈
2. 执行foo，编译创建foo执行期上下文（）压入调用栈
3. 执行foo到bar，创建bar执行期上下文，压入调用栈
每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer。
bar 函数和 foo 函数的 outer 都是指向全局上下文的，
**这也就意味着如果在 bar 函数或者 foo 函数中使用了外部变量，那么 JavaScript 引擎会去全局执行上下文中查找。我们把这个查找的链条就称为作用域链。其作用域链是由词法作用域决定的**


1. 词法作用域就是指作用域是由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。
2. 词法作用域是代码编译阶段就决定好的，和函数是怎么调用的没有关系。


### 1.2、闭包

你以后也可以通过 Scope 来查看实际代码作用域链的情况，

``` js

function foo() {
    var myName = "极客时间"
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName:function(){
            console.log(test1)
            return myName
        },
        setName:function(newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName("极客邦")
bar.getName()
console.log(bar.getName())
```

***在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。比如外部函数是 foo，那么这些变量的集合就称为 foo 函数的闭包。***

**注意：**

如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量。

通常，如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭；但如果这个闭包以后不再使用的话，就会造成内存泄漏。如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。

**闭包解决了什么问题？**

1. 功能集成(私有化)，可对外提供接口供外部使用(一个程序的多个接口)
``` js
let a = 10
let b = 10
function add (a, b) {
  return a + b
}
function minus(a, b) {
  return a - b
}
if (a > 10) return add(a, b)
return minus(a, b)

// 对上面的代码进行封装
function computed(opt) {
  return function (a, b) {
    if (a >10) return opt.add(a, b)
    return opt.minus(a,b)
  }
}

const result = computed({
  add(a, b) {
    return a + b
  },
  mimus(a, b) {
    return a - b
  }
})
const c = result(a, b)
```

2. 函数内部访问外部函数的变量

``` js
let arr = []
for(var i = 0; i <10; i++) {
  arr[i] = function () {
    console.log (i)
  }
}

arr.forEach(fn => fn())  // 10个10

// 解决方法
for(let i = 0; i <10; i++) {
  arr[i] = function () {
    console.log (i)
  }
}

for(let i = 0; i <10; i++) {
  (function(i){
    arr[i] = function () {
      console.log (i)
    }
  })(i)
}
```

3. 可以对外部函数进行二次封装，以达到按条件进行执行的目的（节流）

``` js
function throttle(fn, delay) {
  let beginTime = new Date().getTime()
  return function (...args) {
    let curTime = new Date().getTime()
    let diffTime = curTime - beginTime
    if (diffTime > delay) {
      fn.apply(this,args)
      beginTime = curTime
    }
  }
}
```


### 1.3、栈溢出（可能引发内存泄漏）

#### 1.3.1、调用栈 

调用栈是一种用来管理执行上下文的数据结构，符合后进先出的规则。不过还有一点你要注意，调用栈是有大小的，当入栈的执行上下文超过一定数目，JavaScript 引擎就会报错，我们把这种错误叫做栈溢出。

#### 1.3.2、产生的方式

1. 递归没有终止条件
2. 全局变量用完未重置
3. 事件处理函数未解绑

#### 1.3.3、怎样排查

1. 断点，看call Stack中的调用关系
2. console.trace()

#### 1.3.4、怎样解决

1. 递归变为for循环
2. 重置全局变量
3. 解绑事件处理函数

#### 1.3.5、总结

1. 每调用一个函数，JavaScript 引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后 JavaScript 引擎开始执行函数代码。
2. 如果在一个函数 A 中调用了另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶。
3. 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈。
4. 当分配的调用栈空间被占满时，会引发“堆栈溢出”问题。


### 1.4、原型和原型链

#### 1.4.1、原型（原型只能系统构造不能自己定义（可以修改））

原型prototype其实是一个function对象的一个属性，本质是一个对象。
原型prototype是定义构造函数构造出来的每个对象的公共祖先
所有被该构造函数构造出来的对象都能继承原型上的属性和方法
通过对象访问对象的属性或方法时，构造函数自己有的属性和方法就取自己的，没有就到原型上找

#### 1.4.2、__proto__ 、 constructor 、prototype之间的关系

**解释**

1. __proto__属于每个实例化对象 的原型的容器 装prototype的 （键名）
2. constructor构造器指向构造函数本身可以通过在原型里更改
3. prototype原型对象

**关系**

1. 每一个构造函数里面都会有一个原型对象，通过构造函数的 prototype 指向原型对象
2. prototype原型对象里面又有 constructor 指回构造函数
3. 通过构造函数可以创建一个实例对象，使用new可以产生一个实例对象，构造函数可以指向实例对象
4. 在实例对象中有__proto__对象原型，指向原型对象prototype
5. 实例对象通过原型对象prototype的constructor指向构造函数。 

#### 1.4.3、JS成员查找机制（原型链）

1. 当访问一个对象的属性(包括方法)时，首先查找这个对象自身有没有该属性  
2. 如果没有就查找它的原型(也就是_proto__指向的prototype原型对象)
3. 如果还没有就查找原型对象的原型(Object的原型对象)  
4. 依次类推一直找到Object为止(null)  
5. _proto__对象原型的意思就在于为对象成员查找机制提供一个方向。 

#### 1.4.4、用字面量的方式定义对象

1. `const obj = {}`, constructor指向Object
2. `const obj = new Object()`, constructor指向Object
3. `funciton Obj() {}; const obj = new Obj()`, constructor指向Obj
4. `const objPrototype = {}; const obj = Object.create(objPrototype)`, 以一个现有对象作为原型，创建一个新对象, constructor指向Object

Object.create()提供了自定义原型的功能,可以把一个对象作为另一个对象的原型

#### 1.4.5、new做了什么？

1. 实例化对象
2. 调用构造函数的初始属性和方法
3. 指定实例对象的原型

#### 1.4.6、所有的对象都继承于Object.prototype吗？

不是，通过`Object.create()`创建出来的对象没有原型

#### 1.4.7、`document.write()`打印时隐式转换为字符串打印，当打印由`Object.create`创建处理的对象时，会报错，需要重写toString方法

```js
const foo = Object.create(null)
foo.toString = function () {
  return 'foo'
}
document.write(foo)
```

#### 1.4.8、继承

1. 原型链继承
2. call apply实现继承
3. 公共原型继承
4. 圣杯模式（企业级解决方案）

**原型链继承**
```js
function Foo (name) {
  this.name = name
}
Foo.prototype = {
  getName() {
    return this.name
  }
}

const foo = new Foo('foo')

function Bar () {
  this.name = 'bar'
}

Bar.prototype = foo
const bar = new Bar()
console.log (bar.getName()) // bar
```

**call、apply实现继承**
不能访问原型上的方法和属性 只是通过借用别人的属性和方法
``` js
function Foo (name) {
  this.name = name
}
Foo.prototype = {
  getName() {
    return this.name
  }
}

function Bar(name, age) {
  Foo.call(this, name)
  this.age = age
}

const bar = new Bar('bar', 19)
console.log (bar.name) // 'bar'
console.log (bar.getName()) // bar.getName is not a function
```

**公共原型继承**
改变Bar中的原型Foo中的原型也会被改变
```js
function Foo (name) {
  this.name = name
}
Foo.prototype = {
  getName() {
    return this.name
  }
}

function Bar (name) {
  this.name = name
}

Bar.prototype = Foo.prototype
Bar.prototype.age = 11
console.log (Foo.prototype.age) // 11
const bar = new Bar('bar')
```

**圣杯模式**
```js
/**
 * Target: 需要继承的构造函数
 * Origin: 继承的构造函数
*/
function _extend(Target, Origin) {
  function Buffer () {}
  Buffer.prototype = Origin.prototype
  Target.prototype = new Buffer()
  Target.prototype.constructor = Target
  Target.prototype.super_class = Origin
}
```

### 1.5、垃圾回收

**栈：**JavaScript 引擎会通过向下移动 指针 来销毁该函数保存在栈中的执行上下文。
**堆：**分代回收
在 V8 中会把堆分为**新生代**和**老生代**两个区域，新生代中存放的是生存时间短的对象，老生代中存放的生存时间久的对象
对于这两块区域，V8 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收
**副垃圾回收器：**主要负责新生代的垃圾回收
**主垃圾回收器：**主要负责老生代的垃圾回收。

***新生代中用 Scavenge 算法来处理***
所谓 Scavenge 算法
是把新生代空间对半划分为两个区域，一半是对象区域，一半是空闲区域
新加入的对象都会存放到对象区域，当对象区域快被写满时，就需要执行一次垃圾清理操作。
在垃圾回收过程中，首先要对对象区域中的垃圾做标记；标记完成之后，就进入垃圾清理阶段，副垃圾回收器会把这些存活的对象复制到空闲区域中，同时它还会把这些对象有序地排列起来，所以这个复制过程，也就相当于完成了内存整理操作，复制后空闲区域就没有内存碎片了。

完成复制后，对象区域与空闲区域进行角色翻转，也就是原来的对象区域变成空闲区域，原来的空闲区域变成了对象区域。这样就完成了垃圾对象的回收操作，同时这种角色翻转的操作还能让新生代中的这两块区域无限重复使用下去。

**对象晋级策略：**也就是经过两次垃圾回收依然还存活的对象，会被移动到老生区中。

***主垃圾回收器是采用标记 - 清除（Mark-Sweep）的算法进行垃圾回收的。***
下面我们来看看该算法是如何工作的

1. 首先是标记过程阶段。标记阶段就是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为活动对象，没有到达的元素就可以判断为垃圾数据。
2. 接下来就是垃圾的清除过程。它和副垃圾回收器的垃圾清除过程完全不同，你可以理解这个过程是清除掉红色标记数据的过程

不过对一块内存多次执行标记 - 清除算法后，会产生大量不连续的内存碎片

**标记 - 整理算法**
后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存

**全停顿**
使用 ***增量标记算法*** V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成

使用增量标记算法，可以把一个完整的垃圾回收任务拆分为很多小的任务，这些小的任务执行时间比较短，可以穿插在其他的 JavaScript 任务中间执行，这样当执行上述动画效果时，就不会让用户因为垃圾回收任务而感受到页面的卡顿了。


### 1.6、V8引擎

之所以存在编译器和解释器，是因为机器不能直接理解我们所写的代码，所以在执行程序之前，需要将我们所写的代码“翻译”成机器能读懂的机器语言。按语言的执行流程，可以把语言划分为编译型语言和解释型语言。

#### 1.6.1、编译器
编译型语言在程序执行之前，需要经过编译器的编译过程，并且编译之后会直接保留机器能读懂的二进制文件，这样每次运行程序时，都可以直接运行该二进制文件，而不需要再次重新编译了。比如 C/C++、GO 等都是编译型语言。

在编译型语言的编译过程中，编译器首先会依次对源代码进行词法分析、语法分析，生成抽象语法树（AST），然后是优化代码，最后再生成处理器能够理解的机器码。如果编译成功，将会生成一个可执行的文件。但如果编译过程发生了语法或者其他的错误，那么编译器就会抛出异常，最后的二进制文件也不会生成成功。

#### 1.6.2、解释器

而由解释型语言编写的程序，在每次运行时都需要通过解释器对程序进行动态解释和执行。比如 Python、JavaScript 等都属于解释型语言。

在解释型语言的解释过程中，同样解释器也会对源代码进行词法分析、语法分析，并生成抽象语法树（AST），不过它会再基于抽象语法树生成字节码，最后再根据字节码来执行程序、输出结果。

#### 1.6.3、v8执行一段js代码过程

1. 将源代码进行词法分析、语法分析，并生成抽象语法树（AST），根据ast生成该段代码的执行上下文
2. 解释器根据AST生成字节码（较少内存占用）

字节码就是介于 AST 和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行。
3. 解释执行字节码

如果发现有热点代码（HotSpot），比如一段代码被重复执行多次，这种就称为热点代码，那么后台的编译器 TurboFan 就会把该段热点的字节码编译为高效的机器码，然后当再次执行这段被优化的代码时，只需要执行编译后的机器码就可以了，这样就大大提升了代码的执行效率。

#### 1.6.4、即时编译（JIT）

其实字节码配合解释器和编译器是最近一段时间很火的技术，比如 Java 和 Python 的虚拟机也都是基于这种技术实现的，我们把这种技术称为即时编译（JIT）

具体到 V8，就是指解释器 Ignition 在解释执行字节码的同时，收集代码信息，当它发现某一部分代码变热了之后，TurboFan 编译器便闪亮登场，把热点的字节码转换为机器码，并把转换后的机器码保存起来，以备下次使用。


### 1.7、怎样对js代码进行优化？

1. 提升单次脚本的执行速度，避免 JavaScript 的长任务霸占主线程，这样可以使得页面快速响应交互；
2. 避免大的内联脚本，因为在解析 HTML 的过程中，解析和编译也会占用主线程；
3. 减少 JavaScript 文件的容量，因为更小的文件会提升下载速度，并且占用更低的内存


### 1.8、为什么typeof null 为 object？ 

不同的对象在底层都表示为二进制，在javascript中二进制前三位都为0会被判断为object类型，
null的二进制表示是全0，所以执行typeof时返回'object'


### 1.9、undefined挂载在哪里？

undefined是window对象下的一个属性

### 1.10、Promise实现

1. 简单promise

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

2. promise链式调用

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

3. promise静态方法及周边

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

4. promises 将回调的函数转成promise可以链式调用

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
### ES6有哪些新特性？

1. let const 
2. 解构赋值
3. 数组方法扩展
（扩展运算符, Array.from(将类数组或可遍历的对象转为真正的数组), Array.of(将一组值转为数组), find/findIndex, fill(使用给定值填充数组), includes, flat, flatMap, keys, values, entries）
4. 对象方法扩展
(Object.is, Object.assign, keys, values, entries, getOwnPropertyDescriptors, getPrototypeOf, setPrototypeOf)
5. 字符串方法扩展
(includes, startsWidth, endsWidth, repeat)
6. 函数扩展
（参数默认值， rest参数， 严格模式， 箭头函数）
7. Symbol
8. Set/Map
9. Proxy
10. Reflect
（ 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上）
11. Promise 
12. Iterater(for of)
13. Generator
14. async/await
15. class
16. 函数式编程（柯里化、组合函数）



## 二、浏览器篇

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


### 事件环EventLoop

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
           

### 2.1、输入url全流程
 
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


### 2.2、渲染流程

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


### 2.3、消息队列和事件循环

**为什么使用事件循环机制**
线程运行时能接受并处理新的任务

**消息队列**

1. IO线程（其他线程中的任务有专门的IO线程接收）中产生的新任务添加进消息队列尾部
2. 渲染主线程会循环地从消息队列头部中读取任务，执行任务
3. 消息队列机制并不是太灵活，为了适应效率和实时性，引入了微任务

**系统调用栈**

每个任务在执行过程中都有自己的调用栈，
同步回调就是在当前主函数的上下文中执行回调函数
异步回调有两种处理方式
1. 第一种是把异步函数做成一个任务，添加到信息队列尾部
2. 第二种是把异步函数添加到微任务队列中，这样就可以在当前任务的末尾处执行微任务了。

**微任务（promise,MutationObserver 监控某个 DOM 节点）**
1. 微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。

2. 我们知道当 JavaScript 执行一段脚本的时候，V8 会为其创建一个全局执行上下文，在创建全局执行上下文的同时，V8 引擎也会在内部创建一个微任务队列，也就是说每个宏任务都关联了一个微任务队列

3. 在当前宏任务中的 JavaScript 快执行完成时，也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务。WHATWG 把执行微任务的时间点称为检查点

***总结***

浏览器页面是通过事件循环机制来驱动的，每个渲染进程都有一个消息队列，页面主线程按照顺序来执行消息队列中的事件（js事件、解析dom事件、计算布局事件、用户输入事件等），如果有新的事件产生，新事件会追加到消息队列的尾部，可以说消息队列和主线程循环机制保证了页面有条不紊的运行；
每个事件都是一个宏任务，事件执行时会创建自己的调用栈（调用栈中会保存全局执行期上下文，在创建全局执行上下文的同时，V8 引擎也会在内部创建一个微任务队列，也就是说每个宏任务都关联了一个微任务队列），遇到同步回调就是在当前主函数的上下文中执行回调函数，遇到异步的回调添加到微任务队列中（在当前宏任务中的 JavaScript 快执行完成时，也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务），遇到setTimeout会添加到延迟队列，处理完同步和异步的回调后，会根据发起时间和延迟时间计算出到期的任务，然后依次执行这些到期的任务。等到期的任务执行完成之后，再继续下一个循环过程



## 三、框架篇

### 3.1、Vue和React的区别

**Vue3原理：**
                            ——————————————————————————
          形成订阅发布关系     |  WatchEffect            |
                            |                         |
事件触发 -------> 自变量-------  render      prevDom                  
                            |    |          |         |
                            |        patch            |
                            ———————————————————————————

``` vue
<script setup>
  import {ref} from 'vue'
  const count = ref(0)
</script>

<template>
  <div>
    <h1 @click="count++">{{count}}</h1>
    <p>hello</p>
  </div>
</template>
```
Vue3会为每个组件都建立如上图的watchEffect, watchEffect的回调函数会在watchEffect首次执行以及watchEffect依赖的自变量变化后执行如下步骤：
1. 调用组件的render函数，生成组件对象的VNode(模板代码编译后生成render函数)
   （render函数执行后，内部的自变量变化，会被该effect订阅）
2. 步骤1完成后，render函数的返回值为本次更新的Vnode,它会和上一次更新的Vnode进行patch,执行Vdom相关操作，找到本次自变量变化导致的元素变化，并最终执行对应的Dom操作
   当点击事件导致count发生变化时，Vue3将执行订阅count变化的effect回调函数，重复上面两个步骤，完成UI渲染

**总结：**
1. 自变量变化对应effect回调函数执行
2. effect回调函数执行对应组件UI更新


**AOT**
上述模板在编译后生成的Vdom如下, 当执行patch时，只需要遍历dynamicChildren而不需要遍历整个children,通过减少运行时vdom需要对比的节点，运行时性能得到提高
``` js
const vnode = {
  tag: 'div',
  children: [
    {
      tag: 'h1',
      children: ctx.count,
      patchFlag: 1
    },
    {
      tag: 'p',
      children: 'hello'
    }
  ],
  dynamicChildren: [
    {
      tag: 'h1',
      children: ctx.count,
      patchFlag: 1
    },
  ]
}
```


**React原理：**

触发事件 ----->  reconcile  -------> commit

1. 触发事件，改变自变量，开启更新流程
2. 执行vdom相关操作，在react中被称为reconcile
3. 根据步骤2中计算出的需要变化的UI，执行对应UI的操作，在react中称为commit

***制约快速响应的因素：***

1. CPU瓶颈（当执行大计算量的操作或者设备性能不足时，页面掉帧导致卡顿，在react中对应vdom相关操作）
2. IO瓶颈（进行IO操作后，需要等待，等待过程不能快速响应）
   为不同IO操作赋予优先级统一调度，任务进行中有更高优先级任务，立即中断当前任务，执行更高优先级任务
   （需要react设计调度器，调度算法，可中断的vdom）

解决方式：时间切片

相同点：

1. 只关注视图层（怎么把数据渲染到视图中）
2. 单向数据流（父组件中数据按照什么方向流动）
  父组件传递state（可变的值）给子组件当作props（不可变的值，通过修改父组件的state更新props）渲染视图
3. 基于状态的声明式渲染
4. 组件化的层次架构

不同点：

1. Vue使用模板语法描述UI(从UI出发，扩展UI，描述逻辑)，出发点是扩展HTML，可以从AOT中受益（对模板进行分析，标记静态部分和动态部分，使其patch时跳过静态部分）
   React使用jsx描述UI(从逻辑出发，扩展逻辑，描述UI), 出发点是扩展Es

2. Vue官方提供了Vuex/Vue-router（需要的时候就集成：渐进式）,  用户可以选择集成
   React官方没有提供依靠第三方，Redux/ReactRouter都是单独的库

3. 数据绑定
   React是单向数据绑定（input内容变化后只能通过事件(onChange)更改state更新视图，视图更改后去改变state这是做不到的）

   Vue是双向数据绑定（input中内容变化后通过事件更改data视图更新，视图变化后data更新(v-model指令)）

4. React比较灵活，设计性强(组件就是一个类或者函数，用jsx或react元素)，
   Vue强规范，必须按照官方提供的书写组件和模块的方式（.vue需要编译成js），提供了很多api，大多数都用提供的api,react需要写很多的逻辑

5. React是应用级框架（当state变化后，会从根节点逐层遍历，寻找需要变更的UI）
   Vue是组件级框架（当state变化后，会从该组件逐层遍历，patch需要变更的UI）

6. Vue运行时加编译时
   React是运行时
  
7. 解决减少运行时代码执行流程问题的方向不同
   react: 时间切片（将vdom的执行过程拆分成多个独立的宏任务，将每个宏任务的时间限制在一定范围）
   vue: AOT



### 3.2、React篇

#### 3.2.1、React18有哪些更新

1. setState自动批处理

在react17中，只有react事件会进行批处理，原生js事件、promise，setTimeout、setInterval不会
react18，将所有事件都进行批处理，即多次setState会被合并为1次执行，提高了性能，在数据层，将多个状态更新合并成一次处理（在视图层，将多次渲染合并成一次渲染）

2. 引入了新的root API，支持new concurrent renderer(并发模式的渲染)

``` js
//React 17
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

const root = document.getElementById("root")
ReactDOM.render(<App/>,root)

// 卸载组件
ReactDOM.unmountComponentAtNode(root)  

// React 18
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
const root = document.getElementById("root")
ReactDOM.createRoot(root).render(<App/>)

// 卸载组件
root.unmount()  

```

3. 去掉了对IE浏览器的支持，react18引入的新特性全部基于现代浏览器，如需支持需要退回到react17版本
4. flushSync
批量更新是一个破坏性的更新，如果想退出批量更新，可以使用flushSync

``` jsx
import React,{useState} from "react"
import {flushSync} from "react-dom"

const App=()=>{
  const [count,setCount]=useState(0)
  const [count2,setCount2]=useState(0)

  return (
    <div className="App">
      <button onClick=(()=>{
        // 第一次更新
        flushSync(()=>{
          setCount(count=>count+1)
        })
        // 第二次更新
        flushSync(()=>{
          setCount2(count2=>count2+1)
        })
      })>点击</button>
      <span>count:{count}</span>
      <span>count2:{count2}</span>	
    </div>	
  )
}
export default App
```

5. react组件返回值更新
在react17中，返回空组件只能返回null，显式返回undefined会报错
在react18中，支持null和undefined返回

6. strict mode更新
当你使用严格模式时，React会对每个组件返回两次渲染，以便你观察一些意想不到的结果,在react17中去掉了一次渲染的控制台日志，以便让日志容易阅读。react18取消了这个限制，第二次渲染会以浅灰色出现在控制台日志

7. Suspense不再需要fallback捕获
8. 支持useId
在服务器和客户端生成相同的唯一一个id，避免hydrating的不兼容
9. useSyncExternalStore
用于解决外部数据撕裂问题
10. useInsertionEffect

这个hooks只建议在css in js库中使用，这个hooks执行时机在DOM生成之后，useLayoutEffect执行之前，它的工作原理大致与useLayoutEffect相同，此时无法访问DOM节点的引用，一般用于提前注入脚本

11. Concurrent Mode
并发模式不是一个功能，而是一个底层设计。
它可以帮助应用保持响应，根据用户的设备性能和网速进行调整，它通过渲染可中断来修复阻塞渲染机制。在concurrent模式中，React可以同时更新多个状态
区别就是使同步不可中断更新变成了异步可中断更新
useDeferredValue和startTransition用来标记一次非紧急更新


#### 3.2.2、React的设计思想

组件化 / 数据驱动视图 / 虚拟DOM


1. 架构
   Scheduler（调度器）：调度任务的优先级，优先级高的任务先进入Reconciler
   Reconciler（协调器）：vdom的实现，负责根据自变量变化计算出UI的变化（将递归变成了可中断的循环，timeSlice）
   Renderer（渲染器）：负责将UI变化渲染到宿主环境中（根据reconciler中为vdom标记的各种flags执行对应的操作）

2. 特性
   Sync 同步模式
   Async Mode 异步模式 （异步可中断）
   Concurrent Mode 并发模式 （使多个更新的工作流程可以并发执行）
   Concurrent Feature 并发特性

3. Fiber架构


#### 3.2.3、JSX是什么，他和JS有什么区别

JSX是Meta(原Facebook)提出的一种类XML语法的ECMASCRIPT语法糖（指某种对语言功能没有影响，但是为方便开发者使用的语法，通常可以增加程序可读性），允许你在html中写js, 它不能被浏览器直接识别，需要通过webpack、babel之类的编译工具转换为JS执行

``` js
const element = <h1>Hello Jsx !</h1>

```
该语句经过bable编译后变成如下结果

``` js
// react 17之前
var element = React.createElement("h1", null, 'Hello Jsx!')

// react 17之后
var _jsxRuntime = require('react/jsx-runtime')
var element = _jsxRuntime.jsx("h1", { children: "Hello Jsx!" })
```
在框架运行creatElement或_jsxRuntime.jsx后会得到如下结构
``` js
{
  "type": "h1",
  "key": null,
  "ref": null,
  "props": {
    "children": "Hello Jsx!"
  },
  "_owner": null,
  "_store": {}
}
```
**为什么选择JSX**
前端工程师更熟悉HTML,由于JSX是ES的语法糖，因此它能够灵活的与其他ES语法组合使用,这种灵活性使jsx可以轻松描述复杂的UI,如果与逻辑配合，即可轻松描述UI的变化。
1. 可以在if或for中使用jsx
2. 可以将jsx赋值给变量
3. 可以将jsx当作参数传入，以及从函数中返回jsx
``` js
function App ({isLoading}) {
  if (isLoading) {
    return <h1>loading</h1>
  }
  return <h1>hello jsx!</h1>
}
```

**JSX与JS的区别：**

JS可以被打包工具直接编译，不需要额外转换，jsx需要通过babel编译，它是React.createElement的语法糖，使用jsx等价于React.createElement
jsx是js的语法扩展，允许在html中写JS；JS是原生写法，需要通过script标签引入


**为什么在文件中没有使用react，也要在文件顶部import React from “react”**

只要使用了jsx，就需要引用react，因为jsx本质就是React.createElement


#### 3.2.4、简述React的生命周期

1. 挂载
constructor 初始化阶段，可以进行state和props的初始化
static getDerivedStateFromProps 静态方法，不能获取this
render 创建虚拟DOM的阶段
componentDidMount 第一次渲染后调用，挂载到页面生成真实DOM，可以访问DOM，进行异步请求和定时器、消息订阅

2. 更新
当组件的props或state变化会触发更新
static getDerivedStateFromProps
shouldComponentUpdate 返回一个布尔值，默认返回true，可以通过这个生命周期钩子进行性能优化，确认不需要更新组件时调用

render 更新虚拟DOM

getSnapShotBeforeUpdate 获取更新前的状态

componentDidUpdate 在组件完成更新后调用，更新挂载后生成真实DOM

3. 卸载
componentWillUnmount 组件从DOM中被移除的时候调用，通常在这个阶段清除副作用，比如定时器、事件监听等
错误捕获
static getDerivedStateFromError 在errorBoundary中使用
componentDidCatch
render是class组件中唯一必须实现的方法

#### 3.2.5、React事件机制

1. 什么是合成事件
React基于浏览器的事件机制实现了一套自身的事件机制，它符合W3C规范，包括事件触发、事件冒泡、事件捕获、事件合成和事件派发等
2. React事件的设计动机(作用)：

在底层磨平不同浏览器的差异，React实现了统一的事件机制，我们不再需要处理浏览器事件机制方面的兼容问题，在上层面向开发者暴露稳定、统一的、与原生事件相同的事件接口
React把握了事件机制的主动权，实现了对所有事件的中心化管控
React引入事件池避免垃圾回收，在事件池中获取或释放事件对象，避免频繁的创建和销毁

3. React事件机制和原生DOM事件流有什么区别
虽然合成事件不是原生DOM事件，但它包含了原生DOM事件的引用，可以通过e.nativeEvent访问


#### 3.2.6、常用组件
#### 3.2.7、Redux工作原理
#### 3.2.8、React-Router工作原理
#### 3.2.9、为什么前端需要路由
**为什么需要前端路由**

早期：一个页面对应一个路由，路由跳转导致页面刷新，用户体验差
ajax的出现使得不刷新页面也可以更新页面内容，出现了SPA（单页应用）。SPA不能记住用户操作，只有一个页面对URL做映射，SEO不友好
前端路由帮助我们在仅有一个页面时记住用户进行了哪些操作

**前端路由解决了什么问题**

当用户刷新页面，浏览器会根据当前URL对资源进行重定向(发起请求)
单页面对服务端来说就是一套资源，怎么做到不同的URL映射不同的视图内容
拦截用户的刷新操作，避免不必要的资源请求；感知URL的变化

**前端通用路由解决方案**

hash模式
改变URL以#分割的路径字符串，让页面感知路由变化的一种模式,通过hashchange事件触发

history模式
通过浏览器的history api实现,通过popState事件触发

#### 3.2.10、数据如何在React组件中流动
#### 3.2.11、ReactHooks
#### 3.2.12、SetState是同步还是异步的

setState是一个异步方法，但是在setTimeout/setInterval等定时器里逃脱了React对它的掌控，变成了同步方法
实现机制类似于vue的$nextTick和浏览器的事件循环机制，每个setState都会被react加入到任务队列，多次对同一个state使用setState只会返回最后一次的结果，因为它不是立刻就更新，而是先放在队列中，等时机成熟在执行批量更新。React18以后，使用了createRoot api后，所有setState都是异步批量执行的

#### 3.2.13、fiber架构

它是vdom在react中的实现，原理是使用双缓存机制（将数据保存再缓存区再替换）更新vDom，从而更新UI
fiber架构中同时存在两个fiber树，一颗是真实UI对应的fiber树，一棵是正在内存中构建的fiber树

**工作原理：**

***首次mount时fiberTree构建过程如下：***
1. 创建fiberRootNode，负责管理该应用的全局事项
   （CurrentFiberTree与WipFiberTree之间的切换、应用中任务的过期时间、应用的任务调度信息）
   
2. 创建fiberNode，也称hostRootFiber,代表根节点的vdom
3. 从hostRootFiber开始，以DFS（深度优先搜索）的顺序生成fiberNode
4. 在遍历过程中，为fiberNode标记‘代表不同副作用的flags’,以便后续在render中使用

当render执行完成后，代表WipFiberTree对应的UI已经渲染，此时fiberRootNode的current指向WipHostRootFiber完成双缓存的切换

***触发update时***，生成一个新的WipFiberTree, 与mount的流程类似，当render流程结束后，fiberRootNode的current会再次切换，这就是**Fiber的工作原理**

**什么是fiber，fiber解决了什么问题**
在React16以前，React更新是通过树的深度优先遍历完成的，遍历是不能中断的，当树的层级深就会产生栈的层级过深，页面渲染速度变慢的问题，为了解决这个问题引入了fiber，React fiber就是虚拟DOM，它是一个链表结构，返回了return、children、siblings，分别代表父fiber，子fiber和兄弟fiber，随时可中断
Fiber是纤程，比线程更精细，表示对渲染线程实现更精细的控制
**应用目的**
实现增量渲染，增量渲染指的是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里。增量渲染是为了实现任务的可中断、可恢复，并按优先级处理任务，从而达到更顺滑的用户体验
Fiber的可中断、可恢复怎么实现的
fiber是协程，是比线程更小的单元，可以被人为中断和恢复，当react更新时间超过1帧时，会产生视觉卡顿的效果，因此我们可以通过fiber把浏览器渲染过程分段执行，每执行一会就让出主线程控制权，执行优先级更高的任务
fiber是一个链表结构，它有三个指针，分别记录了当前节点的下一个兄弟节点，子节点，父节点。当遍历中断时，它是可以恢复的，只需要保留当前节点的索引，就能根据索引找到对应的节点


#### 3.2.14、高阶组件

1. 功能模块的抽象，提升复用性
2. 控制渲染流程，权限控制
3. 处理生命周期，检测组件性能

**属性代理：**

1. 抽象props
``` jsx
function Hoc (Comp) {
  const newProps = {
    type: 'Hoc'
  }

  return (props) => <Comp {...props} {...newProps} /> 
}
```

2. 控制渲染逻辑

``` jsx
function Hoc (Comp) {
  if (props.name == 'k') {
    return <Comp />
  }
  return <div>1</div>
}
```

**反向继承**
传入一个组件，计算渲染时间
``` js
function Hoc (Comp) {
  return class extends Comp {
    constructor(props) {
      super(props)
      start,
      end
    }

    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount()
      }
      start = +new Date()
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }
      end = +new Date()

      log(end - start)
    }

    render() {
      return super.render()
    }
  }
}
```

### 3.3、Vue篇

#### 3.3.1、Diff原理

##### 3.3.1.1、渲染器原理

**原理：**
将vNode渲染为真实DOM(挂载)

**渲染器与响应式数据结合：**

副作用执行完成后会与响应式数据建立联系，当修改数据时，副作用函数重新执行，完成渲染

``` js
const count = ref(1)
function render(str, container) {
  container.innerHTML = str
}

effect(() => {
  render(`<h1>{{count.value}}</h1>`, document.getElementById('app'))
})

count.value ++

```

**渲染流程：**
1. mount:第一次渲染时，只是挂载
2. patch:第二次渲染时，对比新旧节点的变化，找到变更的节点，更新变更节点

***渲染流程图：***

![渲染流程图](/public/imgs/renderer.png "渲染流程图")

**js属性原理**

1. 设置domProperty的初始值，`el.setAttribute(key, value)`，当value发生变化时，只有通过el.key获取新的value


##### 3.3.1.2、Diff原理

**diff解决的问题：**减少Dom操作的性能开销

**原理：**
1. 通过key找到可复用的节点
2. 找到需要移动的元素（新旧节点的顺序发生变化）
3. 如何移动元素（移动的是真实dom）
4. 添加新元素
5. 移除不存在的元素

**简单diff算法：**

1. 通过key找到可复用的节点
   （遍历新子节点数组，在旧子节点中通过key寻找可复用节点，执行patch，更新child，此时旧dom已经更新，需要移动位置减少dom操作）
2. 找到需要移动的元素（新旧节点的顺序发生变化）
   （获取将新节点的第一个元素在旧节点中的索引，赋值为最小索引，如果后面有比当前索引还小的元素即当前元素需要移动）
3. 如何移动元素（移动的是真实dom）
   （获取当前节点的前一个节点，如果不存在，说明当前节点是第一个节点，不需要移动，存在时，获取前一个节点的真实dom的兄弟节点作为锚点，将当前元素插入到锚点之前）
4. 添加新元素
   （通过设置flag，当旧的子节点遍历完成，还未找到可复用节点，此时说明需要添加，获取前一个节点，如果存在将其真实dom的兄弟节点作为锚点， 不存在将el.firstChild作为锚点，执行patch(null, n2Child, el, anchor)挂载节点）
5. 移除不存在的元素
   （上述操作完成后，遍历旧子节，在新子节点中寻找是否有当前节点，没有就执行卸载unmount(n2Child)）

**双端diff算法：**

相对简单diff算法的优势是：减少dom移动的次数

1. 定义四个指针分别指向新旧子节点的头节点和尾节点，定义四个节点分别指向头尾节点
2. 当新旧节点头指针小于尾指针，开启循环
   - 旧头节点是否存在，不存在直接指针下移
   - 旧尾节点是否存在，不存在指针上移
   - 新旧头节点是否可复用，如可复用，执行patch更新，向下移动指针
   - 新旧尾节点是否可复用，如可复用，执行patch更新，向上移动指针
   - 旧头节点与新尾节点是否可复用，如可复用，执行patch更新，将旧头节点的真实dom移动到尾节点的真实dom后，旧头节点向下移动指针，新尾节点向上移动指针
   - 旧尾节点与新头节点是否可复用，如可复用，执行patch更新，将旧尾节点的真实dom移动到头节点的真实dom前，旧尾节点向上移动指针，新头节点向下移动指针
   
   还未找到可复用节点
   - 将新的头节点在旧节点中寻找是否有可复用节点
     - 有：找到旧节点中的可复用节点，执行patch，将可复用节点的真实dom移动到头节点前，将可复用节点赋值为undefined
     - 无：挂载新头节点，新头节点指针下移 
   - 新头节点指针下移
3. 添加元素
  （当旧头指针大于旧尾指针并且新头指针小于等于新尾指针，从新头指针遍历到新尾指针，执行挂载，挂载锚点为尾指针加1对应的真实dom）
4. 删除元素
  （当新头指针大于新尾指针并且旧头指针小于等于旧尾指针，从旧头指针遍历到旧尾指针，执行卸载）

**快速diff算法：**

性能最优
它借鉴了文本diff预处理思路，先处理新旧两组子节点中相同的前置节点和后置节点， 当前置节点和后置节点全部处理完后，如果无法简单的通过挂载新节点和卸载旧节点来完成更新，则需要根据节点的索引关系，构造出一个最长递增子序列，最长递增子序列所指向的节点即为不需要移动的节点


``` js
// 抽离dom相关API，作为配置项，以便跨平台渲染
const domApiOptions = {
  // 创建元素
  createElement(tag) {
    return document.createElement(tag)
  }

  // 设置文本内容
  setTextContent(text, el) {
    el.textContent = text
  }

  // 将元素插入到指定元素
  inset(el, parent, anchor = null) {
    parent.insetBefore(el, anchor)
  }

  // 为dom元素设置属性和绑定事件
  patchProps(el, key, preValue, nextValue) {

    function shouldSetAsProperty (el, key, value) {
      if (key === 'form' && el.tagName === 'INPUT') return flase
      return key in el
    }

    // 处理事件
    if(/^on/.test(key)) {
      const invoikes = el._evi || ({el._evi = {}})
      let invoike = invoikes[key]
      const name = key.slice(2).toLowserCase()
      if (nextValue) {
        if (!invoike) {
          invoike = el._evi[key] = (e) => {
            // 解决事件冒泡
            // 不执行，当执行时间小于时间绑定时间的事件处理函数
            if (e.timeStamp < invoike.attached) return
            // 同一事件绑定多个处理函数
            if (Array.isArray(invoike.value)) {
              invoike.value.forEach(fn => fn(e))
            } else {
              invoike.value(e)
            }
          }
          invoike.value = nextValue

          // 存储事件被绑定时间
          invoike.attached = performance.now()
          el.addEventListener(name, invoike)
        } else {
         invoike = nextValue 
        }
      } else if (invoike) {
        el.removeEventListener(name, invoike)
      }
      
    }
    // class 和style做类似处理
    else if (key === 'class') {
      el.className = nextValue
    } 
    // 判断el上是否有该属性，有先用domProperty设置，有些属性是只读的，只能通过setAttribute设置（form的id等）
    else if(shouldSetAsProperty(el, key, nextValue)) {
      // 判断value的类型，处理布尔值
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      // 使用setAttribute
      el.setAttribute(key, nextValue)
    }
    
  }

  // 卸载旧节点 
  unmount(vNode) {
    // 通过挂载时在创建元素时设置_el属性映射真实dom
    const parent = vNode._el.parent
    if (parent) {
      parent.removeChild(vNode._el)
    }
  }
}
// 创建渲染器
function createRender(domApiOptions) {

  // 解构apiOption
  const { createElement, setTextContent, inset, patchProps, unmount } = domApiOptions

  // diff
  function diff(n1, n2, el) {
    // 简短粗暴
    simple(n1, n2, el)

    // 简单diff算法
    simpleDiff(n1, n2, el)

    // 双端diff算法(相较简单diff算法，dom移动的次数较少)
    doubleDiff(n1, n2, el)

    // 快速diff
    quickDiff(n1, n2, el)
  }

  function quickDiff(n1, n2, el) {
    const c1 = n1.children
    const c2 = n2.children

    let j = 0
    let s1 = c1[j]
    let s2 = c2[j]

    // 寻找前置节点中可复用的节点
    while(s1.key === s2.key) {
      patch(s1, s2, el)
      j++
      s1=c1[j]
      s2=c2[j]
    }

    // 寻找后置节点中可复用的节点
    let e1 = c1.length -1
    let e2 = c2.length -1
    let en1 = c1[e1]
    let en2 = c2[e2]

    while(en1.key === en2.key) {
      patch(en1, en2, el)
      e1--
      e2--
      en1 = c1[e1]
      en2 = c2[e2]
    }

    // 添加节点
    if(j > e1 && j <= e2) {
      for(let i = j; i <= e2; i++) {
        const anchorIndex = e2 + 1
        const anchor = anchorIndex > c2.length ? c2[anchorIndex].el : null
        patch(null, c2[i], el, anchor)
      }
    }
    // 删除节点
    else if (j > e2 && j <= e1) {
      while(j <= e1) {
        unmount(c1[j++])
      }
    }
    // 判断是否需要进行移动
    else {
      // 构建剩余节点的新数组，记录新节点在旧节点中索引，以便计算最长递增子序列，未在子序列中的节点需要移动
      const count = e2 - j + 1
      const source = new Array(count)
      source.fill(-1)

      let oS = j
      let nS = j
      let move = false
      let pos = 0
      // 已经更新过的节点
      let attach = 0
      // 遍历剩余新节点，添加索引表
      const map = {}
      for(let i = nS; i <= e2; i++) {
        const newChild = c2[i]
        map[newChild.key] = i
      }
      // 遍历剩余旧节点，寻找新节点中是否有可复用的节点，并移动
      for(let k = oS; k <= e1; k++) {
        const oldChild = c1[k]
        // 如果已更新过的节点小于剩余节点才需要更新, 否则需要卸载
        if (attach <= count) {
          const hasKey = map[oldChild.key]
          if (typeof hasKey !== undefined) {
            // 找到了
            const newChild = c2[hasKey]
            patch(oldChild, newChild, el)
            attach ++
            // 填充数组
            source[hasKey - nS] = k 

            // 判断节点是否可以移动
            if(k < pos) {
              // 需要移动
              move = true
            } else {
              post = k
            }
          } else {
            unmount(oldChild)
          }
        } else {
          unmount(oldChild)
        } 
      }

      // 移动节点
      if(move) {
        // 计算最长递增子序列
        const seq = list(source)
         
        // 定义指向子序列尾
        let s = seq.length - 1
        // 指向新的一组子节点的最后一个元素
        let i = count - 1

        while (i>=0) {
          // 索引为-1是新增节点
          if (source[i] === -1) {
            // 该节点在新节点中的位置
            const pos = i + nS
            const curNode = c2[pos]
            const nextPos = pos + 1
            const anchor = nextPos > c2.length ? null : c2[nextPos].el
            patch(null, curNode, el, anchor)
          }
          if (i !== seq[s]) {
            // 需要移动
            // 该节点在新节点中的位置
            const pos = i + nS
            const curNode = c2[pos]
            const nextPos = pos + 1
            const anchor = nextPos > c2.length ? null : c2[nextPos].el
            inset(curNode.el, el, anchor)
          } else {
            s--
          }
        }
      }
    }

  }

  function doubleDiff(n1, n2, el) {
    const c1 = n1.children
    const c2 = n2.children

    // 定义首位4个索引，分别指向新旧子节点的头和尾
    let s1 = 0,
        s2 = 0,
        e1 = c1.length - 1,
        e2 = c2.length - 1;

    // 定义4个索引指向的当前节点
    let s1n = c1[s1],
        e1n = c1[e1],
        s2n = c2[s2],
        e2n = c2[e2];

    // 开启循环
    while(s1 <= e1 && s2 <= e2) {
      // 没有头部节点或尾部节点，跳过
      if (!s1n) {
        s1n = c1[s1++]
      } else if (!e1n) {
        e1n = c1[e1--]
      }
      else if (s1n.key === s2n.key) {
        patch(s1n, s2n, el)
        s1n = c1[s1++]
        s2n = c2[s2++]
      } else if (e1n.key === e2n.key) {
        patch(e1n, e2n, el)
        e1n = c1[e1--]
        e2n = c2[e2--]
      } else if (s1n.key === e2n.key) {
        patch(s1n, e2n, el)
        // 当前节点在旧节点的开头，更新后在尾部，需要将旧的dom移动到尾部
        const anchor = e1n.el.nextSlibing
        inset(s1n.el, el, anchor)
        s1n = c1[s1++]
        e2n = c2[e2--]
      } else if (e1n.key === s2n.key) {
        patch(e1n, s2n, el)
        // 当前节点在旧节点的末尾，更新后在头部，需要将旧的dom移动到头节点前
        const anchor = s1n.el
        inset(e1n.el, el, anchor)
        e1n = c1[e1--]
        s2n = c2[s2++]
      } else {
        // 都没有找到可复用的节点，将新节点的第一个节点去旧节点中寻找是否有可复用节点
        const hasS2n = c1.findIndex(c => c.key === s2.key)
        if (hasS2n > 0) {
          let curNode = c1[hasS2n]
          patch(curNode, s1n, el)
          // 移到头节点前
          inset(curNode.el, el, s1n.el)
          // 清空当前节点
          c1[hasS2n] = undefined
        } else {
          // 没有找到，说明是新节点需要挂载
          patch(null, s1n, el, s1n.el)
        }
        s2n = c2[s2++]

      }
    }

    // 新增
    if (s1 > e1 && s2 <= e2) {
      for(let i = s2 ; i <= e2; i++) {
        const anchor = c2[e2 + 1] ? c2[e2+1].el : null
        patch(null, c2[i], el, anchor)
      }
    }

    // 删除
    if (s2 > e2 && s1 <= e1) {
      for(let i = s1; i<= e1; i++) {
        unmount(c1[i])
      }
    }
  }

  function simpleDiff(n1, n2, el) {
    const c1 = n1.children
    const c2 = n2.children

    let minIndex = 0
    

    for(let i = 0; i < c2.length; i++) {
      const c2Item = c2[i]
      let flag = false
      
      // 通过key寻找可复用的dom
      for(let j = 0; j < c1.length; j++) {
        const c1Item = c1[j]
        // 找到了
        if (c2Item.key === c1Item.key) {
          flag = true
          // 更新节点
          patch(c1Item, c2Item, el)
          // 是否需要移动
          if  (j < minIndex) {
            // 需要移动
            // 找到当前节点的上一个节点
            const prevNode = c2[j-1]
            // 不存在说明当前节点是第一个节点不需要处理
            if (prevNode) {
              const anchor = prevNode.el.nextSlibing
              inset(c2Item.el, el, anchor)
            }
          }else {
            // 将当前索引赋值给最小索引
            minIndex = j
          }
          break;
        } 
      }

      // 添加新元素
      if(!flag) {
        // 找到当前节点的上一个节点
        const prevNode = c2[j-1]
        let anchor = null
        // 不存在说明当前节点是第一个节点
        if (prevNode) {
          anchor = prevNode.el.nextSlibing
        } else {
          anchor = el.firstChild
        }

        patch(null, c2Item, el, anchor)
      }
    }

    // 删除旧节点
    // 遍历旧节点，在新节点中寻找是否有相同key的元素，没有就删除
    for(let k = 0; k < c1.length; k++) {
      const c1Item = c1[k]
      const has = c2.find(c => c.key === c1Item.key)
      if (!has) {
        unmount(c1Item)
      }
    }
  }

  function simple(n1, n2, el) {
    n1.children.forEach(child => unmount(child))
    n2.children.forEach(child => mountElement(null, child, el))
  }

  // 新旧节点type相同，执行patch
  patchElement(n1, n2, root) {
    const el = n2._el = n1._el
    // 更新props
    const n1Props = n1.props
    const n2Props = n2.props

    // 更新新属性
    for(let key in n2Props) {
      if (n2Props[key] !== n1Props[key]) {
        patchProps(el, key, n1Props[key], n2Props[key])
      }
    }

    // 删除旧属性
    for (let key in n1Props) {
      if (!(key in n2Props)) {
        patchProps(el, key, n1Props[key], null)
      }
    }

    //更新子节点
    patchChildren(n1, n2, el)
  }

  // 跟新子节点
  patchChildren(n1, n2, el) {
    const n1Child = n1.children
    const n2Child = n2.children
    //新子节点为文本节点
    if (typeof n2Child === 'string') {
      // 老子节点为元素节点
      if (Array.isArray(n1Child)) {
        return n1Child.forEach(child => unmount(child))
      }

      // 老子节点为文本节点或没有节点
      setTextContent(n2Child, el) 
    } 
    // 新子节点为元素节点
    else if (Array.isArray(n2Child)) {
      // 老子节点为元素节点
      if (Array.isArray(n1Child)) {
        return diff(n1, n2, el)
      }

      // 老子节点为文本节点或没有节点
      setTextContent('', el) 
      // 挂载新子节点
      n2Child.forEach(child => mountElement(null, child, el))
    }
    // 新子节点没有
    else {
       // 老子节点为元素节点
      if (Array.isArray(n1Child)) {
        return n1Child.forEach(child => unmount(child))
      }
      // 老子节点为文本节点
      if (typeof n1Child === 'string') {
       return setTextContent('', el) 
      }
      
    }
  }
  

  // 挂载节点
  function mountElement(node, container, anchor) {
    // 通过node.type创建真实dom, 并通过_el绑定真实dom，卸载时直接获取真实dom
    const el = node._el = createElement(node.type)

    // 根据node.children执行子node的挂载

    // node.children是string, 子节点是文本节点
    if (typeof node.children === 'string') {
      setTextContent(node.children, el)
    } else if (Array.isArray(node.children)) {
      // 元素节点或多个节点
      node.children.forEach(child => patch(null, child, el))
    }

     // 处理属性
    if (node.props) {
      for (let key in node.props) {
        patchProps(el, key, null, node.props[key])
      }
    }

    // 将元素添加到容器中
    inset(el, container, anchor)
  }

  // patch不仅可以打补丁，还可以挂载
  function patch(oldNode, newNode, container, anchor) {
    // 如果旧节点存在，需要判断新旧节点的type是否相同
    // 不同，需要先将旧节点卸载，再挂载新节点，
    // 相同，执行真正的patch
    if (oldNode && oldNode.type !== newNode.type) {
      unmount(oldNode)
      oldNode = null
    }
   
    // 还需判断节点类型
    const { type } = newNode.type
    // 普通标签
    if (typeof type === 'string') {
      // 没有旧节点，执行挂载
      if (!oldNode) {
        return mountElement(newNode, container, anchor)
      }

      // 执行patch
      patchElement(oldNode, newNode, container)
    } 
    // 组件
    else if (typeof type === 'object') {
      

    } 
    // Fragment
    else if (type === FRAGMENT) {
      if (!oldNode) {
        return newNode.children.forEach(child => mountElement(child, container))
      }
      patchChildren(oldNode, newNode, container)
    }
    // 文本或注释节点
    else if (type === TEXT) {
      if (!oldNode) {
        const el = oldNode._el = createTextNode(oldNode.children)
        inset(el, container)
        return 
      }
      const el = n2.el = n1.el
      el.nodeValue = n2.children
    }
    
  }
  function render(vNode, container) {
    if (vNode) {
      // 有新节点进入patch流程
      patch(container._vnode, vNode, container)
    } else {
      // 没有新节点判断是否有旧节点，有旧节点需要清空
      if (container._vnode) {
        unmount(container._vnode)
      }
      // 将旧节点存到container上
      container._vnode = vNode
    }
  }

  return {
    render
  }
}

const renderer = createRender(domApiOptions)
// 第一次执行render
renderer.render(oldVnode, document.getElementById('app'))

// 第二次执行render
renderer.render(newVnode, document.getElementById("app"))

// 第三次执行render
renderer.render(null, document.getElementById("app"))

```

### 3.3.2、Vue3的原理

#### 3.3.2.1、如何声明式的描述UI

1. 使用模板语法
`<div id="app">hello</div>`

2. 使用虚拟Dom(vue3中的h函数就是简化使用虚拟dom描述UI，返回值就是vdom)
``` js
const vdom = {
  tag: 'div',
  props: {
    id: 'app'
  },
  children: 'hello'
}
```

#### 3.3.2.2、渲染函数
一个组件要渲染的内容是通过渲染函数来描述的，vuejs会根据组件的render函数的返回值拿到虚拟dom

#### 3.3.2.3、怎样将虚拟DOM渲染成真实的DOM

通过渲染器，执行渲染器中的render方法

#### 3.3.2.4、组件的本质

组件就是一组dom元素的封装，可以通过虚拟DOM描述（组件可以是一个函数或对象）

``` js
// 函数组件
const Component = () => ({
  tag: 'div',
  props: {
    id: 'app'
  }
})

// 对象组件
const Component = {
  render() {
    return {
      tag: 'div',
      props: {
        id: 'app'
      }
    }
  }
}
```

#### 3.3.2.5、模板是如何工作的

编译器会把模板内容编译为渲染函数render，并添加到script标签块的组件上


#### 3.3.3、响应式原理

建立数据与副作用函数的之间的关系，当数据变化时重新执行副作用函数
（收集依赖）

``` js
let activeEffect = null
let bunk = new WeakMap()
// 使用栈处理嵌套effect，能正确触发响应
let stackEffect = []

// 定义副作用函数，解决硬编码副作用函数
function effect(fn, options) {
  // 分支切换会导致遗留副作用，需要在执行之前在关联的依赖中删除
  const effectFn = () => {
    cleanUp(effectFn)
    activeEffect = effectFn
    stackEffect.push(effectFn)
    const res = fn()
    stackEffect.pop()
    activeEffect = stackEffect[stackEffect.length - 1]
    return res
  }
  // 收集依赖
  effectFn.deps = []
  effectFn.options = options
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}

// 清除副作用函数
function cleanUp(fn) {
  for(let i = 0; i <= fn.deps.length; i++) {
    const deps = fn.deps[i]
    deps.delete(fn)
  }
  fn.deps.length = 0
}

const obj = { name: 'vue' }

const data = new Proxy(obj, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
  }
})

// 建立当前数据与副作用函数的依赖
function track(target, key) {
  if (!activeEffect) return 
  let depsMap = bunk.get(target)
  if (!depsMap) {
    bunk.set(target, (depsMap = newMap()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  // 将所有依赖添加到副作用的dep中，执行之前清除
  activeEffect.deps.push(deps)
}

// 执行当前数据所依赖的全部副作用
function trigger(target, key) {
  let depsMap = bunk.get(target)
  if (!depsMap) return 
  let deps = depsMap.get(key)
  // 避免多次添加删除dep，无限循环
  const newDep = new Set()
  // 避免无限递归
  deps && deps.forEach(fn => {
    if (fn!==activeEffect) {
      newDep.add(fn)
    }
  })
  if(newDep && Array.isArray(newDep)) {
    newDep.forEach(fn =>{
      // 调度器
      if (fn.options && fn.options.schedu) {
        fn.options.schedu(fn)
      } else {
        fn()
      }
    })
  }
}

```


使用调度器，不关注过程，只关注结果
``` js
let jobQueue = new Set()
let isFlush = false
let p = Promise.resolve()

function flushJob () {
  if (isFlush) return
  isFlush = true 
  p.then(() => {
    jobQueue.forEach(fn => fn())
  })
  .finilly(() => {
    isFlush = false
  })
}

effect(() => {
  console.log (obj.foo)
}, {
  schedu(fn) => {
    jobQueue.add(fn)
    flushJob()
  }
})
```


##### 3.3.3.1、为什么使用Reflect

改变this指向，更好的建立响应式关系

``` js

// reflect 
const zoom = {
  foo: 1,
  get bar() {
    return this.foo

  }
}

const trap1 = {
  get(target, key, receiver) {
    track(target, key)
    // receiver 代表上下文，此处代表代理对象
    return Reflect.get(target, key, receiver)
    //return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
  }
}
const zoomP = new Proxy(zoom, trap1)

effect(() => {
  // 会读取foo，应该与foo建立响应式，但此处相当于zoom.foo，this指向zoom, 所以不会建立响应关系，应该使用Reflect
  console.log (zoomP.bar, 'zoom')
})

setTimeout(() => {
  zoomP.foo++
}, 1000)
```

##### 3.3.3.2、怎样代理对象

1. get -> (get)
2. key in obj -> (has)
3. for (let key in obj) -> (ownKeys)
4. delete obj.key -> (deleteProperty)

``` js
// 代理对象的基础操作
let sk = Symbol()
function trigger1(target, key, type) {
  const depMap = bunk.get(target)
  if (!depMap) return 
  const deps = depMap.get(key)
  const newDeps = new Set()
  if (deps && deps.size) {
    deps.forEach(fn => {
      if (fn !== activeEffect) {
        newDeps.add(fn)
      }
    })
  }

  if(['ADD', 'DELETE'].includes(type)) {
    // 添加ownKeys相关副作用
    const ownDeps = depMap.get(sk)
    if (ownDeps) {
      ownDeps.forEach(fn => {
        if (fn !== activeEffect) {
          newDeps.add(fn)
        }
      })
    }
  }
  
  if (newDeps && newDeps.size) {
    newDeps.forEach(fn => {
      // 当前副作用函数中是否存在调度器
      if (fn.options && fn.options.schduler) {
        
        fn.options.schduler(fn)
      } else {
        fn()
      }
    })
  }
}
const objectTrap = {
  get(target, key, receiver) {
    // 处理对象自身没有的属性，原型上有，会触发两次trigger
    if(key === 'raw') return target
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  // key in obj
  has(target, key) {
    track(target, key)
    return Reflect.has(target, key)
  },
  // for in
  ownKeys(target) {
    // 建立与sk相关的依赖，set时执行相关依赖
    track(target, sk)
    return Reflect.ownKeys(target)
  },
  set(target, key, newVal, receiver) {
    const oldVal = target[key]
    // 执行与ownKeys绑定的sk相关的副作用函数，只是新增属性时才执行
    const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : "ADD"
    const res = Reflect.set(target, key, newVal, receiver,)
    /**
     * 合理的触发响应
     * 1. 当新旧值相同时，不触发响应（NaN）
     * 2. 对象自身没有的属性，原型上有，会触发两次trigger（判断receiver是不是原始对象的代理对象）
     * */ 
    if(target === receiver.raw  && ( oldVal !== newVal && (oldVal === oldVal || newVal === newVal) )) {
      trigger1(target, key, type)
    }
    return res
  },
  // 删除对象属性
  deleteProperty(target, key) {
    const hasKey = Object.prototype.hasOwnProperty.call(target, key)
    const res = Reflect.deleteProperty(target, key)
    if (hasKey && res) {
      trigger1(target, key, 'DELETE')
    }
    return res
  }
}

const o1 = {foo: 1, bar: 2, baz: 3}
const op = new Proxy(o1, objectTrap)

effect(() => {
  console.log ('foo' in op, 'in')
})

setTimeout(() => {
  delete op.foo
})

effect(() => {
  for (let key in op) {
    console.log (key, 'for in Key')
  }
})

setTimeout(() => {
  op.bar = 5
  op.age = 'add'
}, 600)
```

##### 3.3.3.3、怎样代理数组
1. 通过下标访问数组，可以间接修改数组的length， 通过设置length可以间接修改大于等于当前length的数据，应该触发响应
2. for in / for of , 当数组length改变后会间接影响
3. 查找方法（includes/indexOf/lastIndexOf）,当是引用值时需要在代理对象和原始对象上查找
4. 改变length的方法(push/pop/shift/unshift/splice)，调用这些方法会间接修改length.多次调用后会造成死循环，需要在执行时屏蔽追踪

``` js
const insummer = {

}

trackFlag = true

;['includes', 'indexOf', 'lastIndexOf'].forEach(func => {
  const originFunc = Array.prototype[func]
  insummer[func] = function (...args) {
    let res = originFunc.apply(this, args)
    console.log (res , 'res===')
    if (!res || res === -1) {
      console.log (this.raw, 'raw')
      res = originFunc.apply(this.raw, args)
    }
    console.log (res, 'newRes')
    return res
  }
})

;['pop', 'push', 'shift', 'unshift', 'splice'].forEach(func => {
  const originFunc = Array.prototype[func]
  insummer[func] = function (...args) {
    
    trackFlag = false
    let res = originFunc.apply(this, args)
    trackFlag = true
    return res
  }
})

function triggerArr(target, key, type, newVal) {
  const depsMap = bunk.get(target)
  if (!depsMap) return 

  const deps = depsMap.get(key)

  const newDeps = new Set()

  deps && deps.forEach(fn => {
    if (fn !== activeEffect) newDeps.add(fn)
  })

  if (type === 'ADD' || type === 'DELETE') {
    const oDeps = depsMap.get(sk) 
    if (oDeps) {
      oDeps.forEach(fn => {
        if (fn !== activeEffect) newDeps.add(fn)
      })
    }
  }

  if (type === 'ADD' && Array.isArray(target)) {
    const deps = depsMap.get('length')
    deps.forEach(fn => {
      if (fn !== activeEffect) {
        newDeps.add(fn)
      }
    })
  }

  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((effects, key) => {
      if(key >= newVal) {
        effects.forEach(fn => {
          if (fn !== activeEffect) newDeps.add(fn)
        })
      }
    }) 
  }
  console.log (newDeps, 'deps')

  newDeps.forEach(fn => {
    if (fn.options && fn.options.schduler) {
      fn.options.schduler(fn)
    } else {
      fn()
    }
  })
}

const reactiveMap = new Map()
function createReactive(obj) {
  const cacheObj = reactiveMap.get(obj)
  if (cacheObj) {
    return cacheObj
  }

  const newObj = reactive(obj)
  reactiveMap.set(obj, newObj)

  return newObj
}

function reactive(obj) {
  return new Proxy(obj, arrTrap)
}
const arrTrap = {
  set(target, key,newVal, receiver ) {
    const oldVal = target[key]

    // 通过下标访问数组影响length，当type是add时需要触发与length相关的副作用
    const type = Array.isArray(target) 
    ? Number(key) < target.length ? "SET" : "ADD"
    : Object.prototype.hasOwnProperty.call(target, key) ? "SET" : "ADD"

    const res = Reflect.set(target, key, newVal, receiver)

    if (target === receiver.raw && (newVal !== oldVal && (newVal === newVal || oldVal === oldVal))) {
      triggerArr(target, key, type, newVal)
    }

    return res
  },
  ownKeys(target) {
    // 数组迭代，关联的length
    const type = Array.isArray(target) ? 'length' : sk
    track(target, type)
    return Reflect.ownKeys(target)
  },
  get(target, key, receiver) {
    if(key === 'raw') return target
    // for of 迭代器是symbol类型，停止追踪
    if (typeof key !== 'symbol') {
      track(target, key)
    }

    // 处理数组的查找方法
    if(Array.isArray(target) && insummer.hasOwnProperty(key)) {
      console.log (insummer, 'insummer')
      return Reflect.get(insummer, key, receiver)
    }

    if (typeof target[key] === 'object' && target[key] !== null) {
      return createReactive(target[key])
    }
    
    return Reflect.get(target,key, receiver)
  }
}

const arr = [2, 3, 4,5 ]
const newArr = createReactive(arr)
console.log (newArr, 'newArr')

effect(() => {
  console.log (newArr[1], 'arr')
})

setTimeout(() => {
  newArr[1] = 111
}, 1000)



setTimeout(() => {
  newArr.length = 0
}, 2000)


effect(() => {
  console.log (newArr.length, 'arr length')
})

setTimeout(() => {
  newArr[4] = 111
}, 3000)

setTimeout(() => {
  newArr.pop()
}, 4000)

const testObj = {}
const arr1 = [testObj]
const newArr1 = createReactive(arr1)

effect(() => {
  console.log (newArr1.includes(newArr1[0]), 'arrIncludes')
})

```

##### 3.3.3.4、原始值的响应式Ref原理

``` js

// 原始值的响应式
function ref(val) {
  const wrapper = {
    value: val
  }

  // 定义特殊的标识
  Object.defineProperty(wrapper, '_v_isRef', {
    value: true
  })

  return createReactive(wrapper)
}

// 响应式丢失
const count = createReactive({name: 'test'})
// 使用扩展运算符导致响应式丢失
const newCount = {...count}
// 解决方式，将它转为ref形式
function toRef(obj, key) {
  const wrapper = {
    get value () {
      return obj[key]
    },
    set value (newVal) {
      return obj[key] = newVal
    }
  }
  Object.defineProperty(wrapper, '_v_isRef', {
    value: true
  })
  return wrapper
}

// 批量解决
function toRefs(obj) {
  const ret = {

  }

  for(let key in obj) {
    ret[key] = toRef(obj, key)
  }

  return ret
}

// 自动脱ref
function toProxyRef(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      if (target._v_isRef) {
        return value.value
      }
      return value
    },
    set(target, key, newVal, receiver) {
      const val = target[key]
      if (target._v_isRef) {
        return Reflect.set(val, 'value', newVal, receiver)
      }

      return Reflect.set(target, key, newVal, receiver)
    }
  })
}
```


#### 3.3.4、Computed原理

根据响应式数据计算新的数据，并缓存
``` js
function computed (getter) {
  let value,
      dity = true;
  const effectFn = effect(getter, {
    
    schedu: () => {
      // 增加调度器，解决effect嵌套computed导致不会重新计算问题
      trigger(obj, 'value')
      // 解决修改数据后不会重新计算
      dity = true
    },
    lazy: true})
  const obj = {
    get value() {
      if (dity) {
        value = effectFn()
        dity = false
      }
      // 解决effect嵌套computed导致不会重新计算问题
      track(obj, 'value')
      return value
    }
  }
  return obj
}
```

#### 3.3.5、Watch原理

``` js
function reverser(value, seen = new Set()) {
  if(!value || typeof value != 'object' || seen.has(value)) return 
  seen.add(value)
  for(let key in value) {
    reverser(value[key], seen)
  }
  return value
}

function watch(source, cb, options) {
  let getter 
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => reverser(source)
  }

  let newVal,
      oldVal;

  // 处理过期的副作用, 异步请求时存在竞态问题，不知道谁先执行完成，应该按顺序得到结果，清楚过期的结果
  let clean = null
  const onInvalidate = (fn) => {
    clean = fn
  }

  const job = () => {
    newVal = effectFn()
    // 如有过期的副作用，先执行清除
    if(clean) {
      clean()
    }
    cb(newVal, oldVal, onInvalidate)
    oldVal = newVal
  }

  const effectFn = effect(getter, {
    lazy: true,
    schduler(){
      if (options && options.flush) {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })
  // 立即执行
  if (options && options.immediate) {
    job()
  } else {
    oldVal = effectFn()
  }
}

watch(() => data.name, async (nV, oV, onInvalidate) => {
  console.log (nV, oV, 'w')

  // 过期副作用
  let expired = false
  onInvalidate(() => {
    expired = true
  })
  let data = null
  const res =  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(nV + 'success')
    }, 2000)
  })
  if (!expired) {
    data = res
  }

  console.log (data, 'data')
})

setTimeout(() => {
  data.name = 'Hello Watch'
}, 1000)
}
```

#### 3.3.6、Vue首屏优化

1. 路由懒加载
2. 将Vue、VueX、Element、Axios等第三方包使用cdn加载，配置webpack的extenals

```js

// 在html中引入
<script src="https://cdn.bootcdn.net/ajax/libs/axios/1.5.0/axios.js"></script>
// 在vue.config.js中配置
module.exports = {
  externals: {
    // 键名是在项目中引入的包名，键值是cdn引入后挂载到window上的属性名（打开js，对应第一个参数中）
    'axios': 'axios',
    'element-ui': 'ELEMENT',
    'vue': 'Vue',
    'vuex': 'Vuex'
  }
}

```


## 四、性能优化篇

### 4.1、性能优化的方式

1. 减少http请求
2. 使用http2(解析速度快、多路复用、首部压缩、紧急请求设置优化级，服务器推送)
3. 使用服务端渲染
   1. 客户端渲染: 获取 HTML 文件，根据需要下载 JavaScript 文件，运行文件，生成 DOM，再渲染。
   2. 服务端渲染：服务端返回 HTML 文件，客户端只需解析 HTML。
4. 静态资源使用CDN加速
5. 将css放在文件头部，js放在底部
   1. JS 加载和执行会阻塞 HTML 解析，阻止 CSSOM 构建
   2. CSS 执行会阻塞渲染，阻止 JS 执行
6. 使用iconfont替换图片图标
7. 善用缓存
8. 压缩文件（html,css, js）
9. 图片优化（懒加载、降低图片质量、尽量使用Css代替图片、使用webp图片）
10. 使用webpack按需加载代码，提取第三方库缓存

11. 减少重排重绘
12. 使用事件委托
13. 注意程序局限性
14. 善用设计模式
15. 降低css选择器的复杂性
16. 使用flex布局
17. 使用防抖节流
 


## 五、HTML篇

### 5.1、html5新特性
1. 绘图 canvas
2. 用于媒介回放的 video 和 audio 元素
3. 本地离线存储 localStorage 、sessionStorage
4. 语义化更好的内容元素，如：header、article、nav、section、footer等
5. 表单控件 calendar、date、time、email、url、search 等
6. 新的技术 webworker、websocket
7. 新的文档属性 document.visibilityState

### 5.2、Cookie、Session、Token区别

Cookie、Session 和 Token 通常都是用来保存用户登录信息的技术，但三者有很大的区别，简单来说 Cookie 适用于简单的状态管理，Session 适用于需要保护用户敏感信息的场景，而 Token 适用于状态无关的身份验证和授权。

1. 存储位置不同：Cookie 存储在客户端，即浏览器中的文本文件，通过在 HTTP 头中传递给服务器来进行通信；Session 是服务器端的存储方式，通常存储在服务器的内存或数据库中；Token 也是存储在客户端，但是通常以加密的方式存储在客户端的 localStorage 或 sessionStorage 中。
2. 数据安全性不同：Cookie 存储在客户端，可能会被窃取或篡改，因此对敏感信息的存储需要进行加密处理；Session 存储在服务器端，通过一个 Session ID 在客户端和服务器之间进行关联，可以避免敏感数据直接暴露；Token 通常使用加密算法生成，有效期较短且单向不可逆，可以提供较高的安全性。
3. 跨域支持不同：为了防止安全事故，因此 Cookie 是不支持跨域传输的，也就是不同域名下的 Cookie 是不能相互访问的；而 Session 机制通常是通过 Cookie 来保存 Session ID 的，因此 Session ID 默认情况下也是不支持跨域的；但 Token 可以轻松实现跨域，因为 Token 是存储在客户端的 localStorage 或者作为请求头的一部分发送到服务器的，所以不同的域名 Token 信息传输通常是不受影响的。
4. 状态管理不同：Cookie 是应用程序通过在客户端存储临时数据，用于实现状态管理的一种机制；Session 是服务器端记录用户状态的方式，服务器会为每个会话分配一个唯一的 Session ID，并将其与用户状态相关联；Token 是一种用于认证和授权的一种机制，通常表示用户的身份信息和权限信息。


### 5.3、Cookie、LocalStorage、SessionStorage的区别

1. 生命周期：
cookie：可设置失效时间，没有设置的话，默认是关闭浏览器后失效
localStorage：除非被手动清除，否则将会永久保存。
sessionStorage： 仅在当前网页会话下有效，关闭页面或浏览器后就会被清除。

2. 存放数据大小：
cookie：4KB左右
localStorage和sessionStorage：可以保存5MB的信息。

3. http请求：
cookie：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题
localStorage和sessionStorage：仅在客户端（即浏览器）中保存，不参与和服务器的通信

4. 易用性：
cookie：需要程序员自己封装，源生的Cookie接口不友好
localStorage和sessionStorage：源生接口可以接受，亦可再次封装来对Object和Array有更好的支持

5. 应用场景
cookie存储登录信息
localStorage跨页面缓存数据
sessionStorage存储临时数据

## 六、CSS篇 

### 6.1、盒子模型

1. 默认：box-sizing: content-box; 标准盒模型，在浏览器中渲染的实际宽度为width + padding + border

2. border-box; IE怪异盒子，在浏览器中渲染的实际宽度为width


### 6.2、BFC / IFC 块级格式化上下文

**解决的问题：**

清除浮动/解决margin合并/高度坍塌等问题

**触发条件**

1. float: left/ right 
2. position: absolute/ fixed 
3. 块级元素：overflow不为visible 
4. display: flex inline-box


### 6.3、垂直水平居中

1. 块级元素line-height = height

2. 绝对定位 + margin

``` css
div {
  width:  200;
  height: 200;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -200 0 0 -200;
}
```

3. 绝对定位 + transform

``` css
div {
  width:  200;
  height: 200;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
}
```

4. 绝对定位 + margin: auto

``` css
div {
  width:  200;
  height: 200;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

5. flex布局

``` css
div {
  width:  200;
  height: 200;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
```

### 6.4、1px问题

1px问题 当ui给定盒子为1px的时候，在一些移动设备上会很粗 
设备像素比 = 物理像素 / css像素 
pc端设备像素比为1，不会出现此问题 
在iphone7时css像素为375,物理像素为750 设备像素比 = 750 / 375 = 2 当设置1px时 css像素 = 1 / 2 = 0.5px, 
有些浏览器解析0.5会把他解析为1px 所以 物理像素 = 2 * 1 = 2px变粗了 如果你的设备像素比 越大 意味着你的手机屏幕越高清,意味着这个bug在你手机上越明显 

**解决方式**

缩放 / 伪类 / 图片



## 七、手写篇

### 7.1、编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

`var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];`
 
答案：

``` js
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b)

```

### 7.2、计算++i , i++
```js
let k = 2

//       2    3       3(先赋值给j后k+1)        5  13
let j = k + (++k) + (k++)  + (++k)   // 13
```

### 7.3、paseInt计算

``` js
let a = [0, 1, 2].map(parseInt)
console.log (a) // 0, NaN, NaN
```

### 7.4、数组去重

``` js
const arr = [2, 3, 4, 22, 2, 3]
const arr1 = arr.filter((item, index, arr) => {
  return arr.indexOf(item) === index
})
console.log (arr1, 'arr1')
const arr2 = Array.from([...new Set(arr)])
console.log (arr2, 'arr2')
```

### 7.5、斐波那契数列

``` js
// 0 1 1 2 3 5 8 13 21 34
function generatorList (n) {
  let res = [] 
  let i = 0
  while(i < n) {
    if (i <= 1) {
      res.push(i)
    } else {
      res.push(res[i - 1] + res[i-2])
    }
    i++ 
  }
  return res
}

const list = generatorList(10)
console.log (list, 'list')

function fib(n) {
  if (n < 2) return n
  return fib(n-1) + fib(n-2)
}

console.log (fib(10))
```

### 7.6、冒泡排序

``` js
function dbSort(arr) {
  for(let i = 0; i < arr.length ; i ++) {
    for(let j = 0; j < arr.length - i; j ++) {
      if (arr[j+1] < arr[j]) {
        let temp = arr[j+1]
        arr[j+1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}

console.log (dbSort([2,4, 7,1, 3, 8, 10, 9]))
```

## 八、架构篇

### 8.1、如何进行框架技术选型

1. 根据不同的项目需求选择合适的技术框架（有SEO需求，服务端渲染，无单页面应用，支持跨平台Taro等）
2. 社区生态是否繁荣（即对于日常业务开发遇到的需求，能否快速在社区中找到成熟的解决方案）
3. 团队人员对此框架的熟练度（避免因团队成员不熟导致开始时间较长或者遇到紧急情况需要增加人员等因素使项目延期）
4. 公司内部有自研框架脚手架尽量使用公司自研（避免出现兼容等问题）

## 九、开放性问题

### 9.1、学习了源码有什么感受

1. 深入了解了底层实现机制
2. 能更清晰的运用框架
3. 拓宽了技术视野

### 9.2、为什么使用node作为中间层

1. 代理：在开发环境下，我们可以利用代理来，解决最常见的跨域问题；在线上环境下，我们可以利用代理，转发请求到多个服务端。'
2. 缓存：缓存其实是更靠近前端的需求，用户的动作触发数据的更新，node中间层可以直接处理一部分缓存需求。
3. 限流：node中间层，可以针对接口或者路由做响应的限流。
4. 日志：相比其他服务端语言，node中间层的日志记录，能更方便快捷的定位问题（是在浏览器端还是服务端）。
5. 监控：擅长高并发的请求处理，做监控也是合适的选项。
6. 鉴权：有一个中间层去鉴权，也是一种单一职责的实现。
7. 路由：前端更需要掌握页面路由的权限和逻辑。
8. 服务端渲染：node中间层的解决方案更灵活，比如SSR、模板直出、利用一些JS库做预渲染等等。
9. 数据处理

### 9.3、大数据渲染页面卡顿，怎样解决

1. 分页
2. 根据可视范围依次加载


## 十、网络篇

### 10.1、get和post的区别

1. POST请求相对安全，GET请求相对不安全
2. GET请求可以缓存，POST请求不能缓存
3. GET请求有长度限制，POST请求没有长度限制
4. GET只能传输字符串，POST可以传输多种类型数据
5. GET请求入参在URL上，POST请求入参在Request body上
6. POST有可能产生两个数据包，GET只会发送一个数据包
7. 刷新和回退的时候GET请求无害，POST数据会被重新提交

### 10.2、http每个版本的区别

http0.9

1. 仅支持get请求
2. 仅能请求访问html格式的资源

http1.0

1. 增加post和head请求方式
2. 支持多种数据格式的请求与访问
3. 支持cache缓存功能
4. 新增状态码、多字符集支持、内容编码等
早期的http1.0不支持长链接支持串行链接
后期的http1.0支持长链接（Connection:keep-alive）


http1.1

1. 增加持久链接（默认开启Connection:keep-alive）
2. 增加管道机制（支持多个请求同时发送）
3. 增加put/patch/options/delete等请求方式
4. 增加Host
5. 增加100状态码（Continue）,支持只发送头信息
6. 增加身份认证机制
7. 支持传送内容的一部分和文件断点续传
8. 新增24个错误状态码

http2.0

1. 增加双工模式（客户端同时发送多个请求，服务端同时处理多个请求）
2. 服务器推送（服务器会把客户端需要的资源一起推送给客户端，合适加载静态资源）
3. 头信息压缩
而之所以叫2.0，是在于新增的二进制分帧层。在二进制分帧层上， HTTP 2.0 会将所有传输的信息分割为更小的消息和帧，并对它们采用二进制格式的编码 ，其中HTTP1.x的首部信息会被封装到Headers帧，而我们的request body则封装到Data帧里面。

HTTP 2.0 通信都在一个连接上完成，这个连接可以承载任意数量的双向数据流。相应地，每个数据流以消息的形式发送，而消息由一或多个帧组成，这些帧可以乱序发送，然后再根据每个帧首部的流标识符重新组装。

二进制协议：头信息和数据体使用二进制进行传输
多工：先发送已经处理好的部分，再响应其他请求，最后再解决没有处理的部分

### 10.3、缓存

控制强制缓存的字段分别是:
Expires(不用)
Cache-Control: max-age=xxx

控制协商缓存的字段分别有：
 
Last-Modified / If-Modified-Since 
Etag / If-None-Match（优先级高）


Last-Modified：服务器响应请求时，返回该资源文件在服务器最后被修改的时间
If-Modified-Since：
是客户端再次发起该请求时，携带上次请求返回的Last-Modified值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有If-Modified-Since字段，则会根据If-Modified-Since的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于If-Modified-Since的字段值，则重新返回资源，状态码为200；否则则返回304，代表资源无更新，可继续使用缓存文件


Etag：是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)
If-None-Match：
是客户端再次发起该请求时，携带上次请求返回的唯一标识Etag值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有If-None-Match，则会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200


## 十一、面试

### 注意点

1. 着装，个人形象
2. 谈吐
专业表述
技巧：说话简单
准备开放问题

**为什么选择前端：**

成就感，交互性强，能力容易让人感知

面试仪态

眼神不要闪烁


不要插嘴

平常心
会答的答全面，不会的答相关的问题，确实不会的反问面试官积极的回答

开放性问题：

**自我介绍**

你好，我是XXX，毕业于XXX软件工程专业，曾就职于人民网、猪八戒网、希尔安药业，担任的岗位都是前端开发工程师；未来也希望在这个继续深耕；我熟练前端框架React、Vue，具备跨终端开发能力，能够根据项目需求选择合适的技术栈进行开发。

在前几份份工作期间，我参与了多个前端项目的开发。负责前端技术选型、项目搭建、公共组件的开发，与设计师和后端开发人员紧密合作，确保项目的顺利进行。也曾作为前端项目负责人带领团队成员和其他部门成员共同完成项目。

多年的工作经历让我积累一定的工作经验和行业相关知识，自己也成长了不少，我注重代码质量和可维护性，善于使用工具和技术来提高开发效率。我也关注前端领域的最新动态，不断学习和探索新技术，保持自己的技术竞争力。

今天面试贵公司的岗位是前端开发工程师，我认为是一个挑战自我和发展自我的宝贵机会，希望有机会到贵公司任职，谢谢！


## 十二、HR

### 12.1、你还有什么问题想问

1. 团队的规模和氛围
2. 有没有入职培训
3. 岗位的晋升通道是什么
4. 公司在未来3到5年业务发展的重点是什么

之前呢，我确实有很多问题想提，但是刚才跟您的这一番沟通交流之后，您已经完全的解答了我所有的疑惑， 非常感谢，我也期待着我有机会能够入职

### 12.2、为什么能胜任这个岗位

1. 性格比较沉稳，做事比较仔细
2. 专业能力强（深入学习了技术原理）
3. 团队协作能力强（带领部门成员与其他部门成员共同完成项目）

### 12.3、为什么选择我们公司

1. 公司相对于互联网企业较稳定
2. 我非常看好公司电商业务线
3. 我的技能和贵公司招聘的岗位比较匹配

### 12.4、职业规划

我是一个稳定性很强的人，我觉得贵公司经过多年的发展，稳步的方式跟我是非常匹配的，
所以我的职业规划是做好我的本职工作，积累3到5年，提升自己工作经验和技术深度的同时多学习管理方面的知识，然后随着公司同步发展

### 12.5、优点

1. 对前端开发很感兴趣，不断学习和探索前端方面的新技术
2. 执行力强，领导安排的任务立即执行
3. 做事有条理，遇到问题时会对问题进行拆分，然后逐一解决

### 12.6、缺点

1. 工作经验还不是很足，因为我想成为这个行业的佼佼者，还需要不断学习
2. 在面对一些选择时，会询问身边的人
3. 在很多人面前说话会比较紧张，这点我也在不断努力克服

### 12.7、最有成就感的一件事

智能报税系统




 






