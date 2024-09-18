# 重学JavaScript

## 浏览器

### 五大主流浏览器 内核
              
1. IE          trident
2. Chrome      webkit blink
3. Safari      webkit
4. Firfox      gecko
5. Opera       presto

### 浏览器的历史和Js的诞生

1. 1990年，蒂姆伯纳斯.李（超文本分享咨询的人）开发了一个world wide web ,后面移植到C后产生第一个浏览器libwww/nexus, 只允许别人浏览他人编写的网站

2. :tada:1993年，美国伊利诺大学NCSA组织中的马克安德森开发了MOSIAC浏览器（图形化浏览器），可以显示图片

3. 1994年，马克安德森和吉姆克拉克开发了MOSIAC communication corporation 后改名为Netscape communication corporation, 同年网景公司开发了netscape navigator火到2003年

4. :tada:1996年，微软收购spy glass开发出了IE1.0 ， internet exploror 1.0(实际上就是MOSIAC内核)；同年发布IE3，出现了脚本语言Jscript；同年网景公司的Brendan eich在netscape navigator的基础上开发出了liveScript(js的前生)，Java火起来了，但liveScript不温不火，和SUN商量合作推广宣传产品，将liveScript起名为Javascript

5. 2001年，IE6、XP诞生，浏览器从渲染引擎中剥离出Js引擎

6. 2003年，Mozilla公司开发firefox(根据netscape navigator开发)

7. 2008年，Google基于webkit blink gears（离线浏览）开发出chrome，有了V8引擎

**v8引擎优点：**

 - 1. 直接翻译机器码
 - 2. 可独立于浏览器运行（nodeJS）

8. 2009年，甲骨文Oracle收购SUN，js所有权给甲骨文


## 编程语言

1. 编译型

将源码通过编译器编译成机器语言生成可执行文件

2. 解释型

将源码通过解释器解释一行执行一行

不需要根据不同平台进行移植

## 脚本语言（前后端）

一定有脚本引擎（js引擎），通过脚本语言的解释器解析执行

客户端: javascript / (jscript只支持ie / vbscript微软) / actionscript(flash)
后端: php / c# / asp.net(官方网站最多，仅仅展示)


## JavaScript

解释型语言

1. :heart:ECMAscript(最难)
   语法、变量、关键字、保留字、值、原始类型、引用类型、运算、对象、继承、函数、闭包、原型

2. DOM: document object model W3C规范
3. BOM: browser object model  没有规范


### 线程

单线程：同一时间，只能运行一个程序
多线程：同时可以运行多个程序

**Js引擎是单线程，可以通过轮转时间片模拟多线程**

**轮转时间片：**
短时间之内轮流执行多个任务片段

1. 任务1， 任务2
2. 切分任务1，任务2
3. 随机排列这些任务片段，组成队列
4. 按照这个队列的顺序将任务片段送进JS进程
5. JS线程执行一个又一个的任务片段

切分后中间的时间间隔很短，看不到卡顿。

### :pink_heart:ECMAScript

#### 变量

存储数据的容器，由两部分组成; 声明变量，变量赋值

``` js
var a ;
a = 2;

var b = 3;
```

**命名规范**
1. 不能以数字开头
2. 能字符_$开头
3. 字母_$数字
4. 不用关键字/保留字
5. 语义化
6. 小驼峰
7. 使用英文，不使用拼音

优先级：运算 > 赋值
``` js
var x  = 3;
var y = 4;
var z = x + y;
console.log(z)
```

#### 数据类型

1. 原始值

Number（包含浮点数） / String / Boolean / undefined（未被定义） / null


2. 引用值

object / array / function / date / RegExp


**值的存储：**

> [!CAUTION]
不管原始值还是引用值，当拷贝a赋值给b后（修改其中一个，原始值互不影响，引用值都会改变），重新赋值a互不影响


1. 原始值存到栈内存中(数据永久存在不可改，删除只是覆盖原来的空间)

栈：后进先出

每声明并赋值一个变量都是新开一个空间去存储，重新赋值时是新开了一个空间去存储新值

``` js
var a = 3;
// 将a的值拷贝到b中
var b = a;
console.log (b) // 3

// 重新赋值时是新开了一个空间去存储新值， 原来的值还是保持在内存中
// 并不会影响 b, 因为b是单独的一个空间
a = 1;
console.log (b) // 3
```
**空间占用变化情况例子：**
1. 声明a
![a](/public/imgs/value-normal-1.png) 

2. 声明b并赋值为a
![b](/public/imgs/value-normal-2.png) 

3. 重新赋值a

![newA](/public/imgs/value-normal.png) 


2. 引用值

值存在堆内存中，值的指针（地址）存在栈内存

:::tip
拷贝一个引用值a后赋值给b，修改其中一个，两个值都会修改(解决方法：[对象克隆](./clone-obj))，重新赋值a，互不影响
:::

``` js
var arr1 = [1, 2, 3]
// arr2指向arr1值的地址，修改其中一个两个都会改变，当重新赋值时互不影响
var arr2 = arr1 // 指向同一个推内存

arr1.push(4) // arr1 arr2都会修改
console.log (arr1, arr2)// [1, 2, 3, 4]

// 重新赋值arr1，新开辟一个空间存储新的值
arr1 = [1, 2]
console.log (arr1, arr2) // [1, 2]  [1, 2, 3, 4]
```

**空间占用变化情况例子：**

1. 声明arr1
![arr1](/public/imgs/value-obj-1.png)

2. 声明arr2并赋值为arr1
![arr2](/public/imgs/value-obj-2.png)

3. 重新赋值arr1
![newArr1](/public/imgs/value-obj-3.png)



#### 基本语法
1. 语句以分号结尾，除for/if/ 单一声明多个变量
``` js
var a = 1;
var b = 2,
    c = 1;
```
2. 符号前后加空格

通用错误会截断后面代码块执行

```js
console.log (a) // ReferenceError a is not defined
console.log ('test')
```

#### 运算

##### 普通运算

+ - * / % () ++ --

``` js
var a = 1,
    b = 2,
    d = 3,
    c = ( a + b ) + c;
```
优先级：括号 > 普通运算 > 赋值

1. + , 其中有一个字符串就是字符串拼接
任何数据类型的值 + 字符串都是字符串

``` js
var a = 1;
var c = 'str' + 1 // str1
var d = 'str' + undefined // strundefined
var e = 'str' + null // strnull
var f = 'str' + NaN // strNaN
var g = 'str' + ( 1 + 1 ) // str2
```

2. -

``` js
var a = 'str' - 1 // NaN
var b = true - 1 // 0
var c = false - 1 // -1
var d = null - 1 // -1
var e = undefined - 1 // NaN
```

3. / 

NaN: 不是一个数字
NaN: 数字类型
``` js
var a = 0 / 0 // NaN
var b = 1 / NaN // NaN

var c = 1 / 0  // infinity: 数字类型
var d = -1 / 0 // -infinity: 数字类型
```

4. % 取余

``` js
console.log ( 0 % 6 ) // 0
```

**交换值：**

``` js
var a = 1,
    b = 2;
// 交换a,b
var c = a ;
a = b;
b = c;

// 运算
a = a + b; // 3
b = a - b; // 3 - 2 = 1
a = a - b; // 1
```

5. ++ / --
a++: 先赋值，后加加
++a: 先加加，后赋值

``` js
var c = 1
console.log (c++) // 1
console.log (c) // 2

var d = 2
console.log (++d) // 3

var a = 5,
    b ;
b = --a + a--;
console.log (b, a) // 8 3

e = --a + a++
console.log (b, a) // 8 5
```

**逗号运算，始终会返回逗号后面的值**

``` js
var test = (6, 5)
console.log (test) // 5


var test1 = (9+2, 11 -3, 9 + 9)
console.log (test1) // 18
```

##### 比较运算

\> <  >= <= == === != !===

``` js
console.log (10 > 5) // true
console.log (10 > '6') // true

// 字符串用ASCII码（字符串相对应的十进制代码）的大小相比
// 多个字符的，从左到右依次对比直到比较出ASCII码的大小为止
console.log ('a' > 'b') // true
console.log ('4.5' > '11') // true

// 相等不看数据类型
console.log (1 == '1') // true
// 全等需要看数据类型是否相等
console.log (1 === '1') // false


// NaN与包括自己在内任何东西都不相等
console.log (NaN == NaN) // false
```

#### 条件语句

if / else / else if / switch 

&&: 并且（两边都满足） 

||: 或 （两边有一边满足即可）

:::tip
条件有互斥性一定要用else if, 提升性能；需要考虑边界。
:::

1. if / else if / else
``` js
var score = 80;

if (score >= 90 <= 100) {
   console.log ('优秀')
} else if (score >= 60 && score < 90) {
   console.log ('良好')
} else if (score < 60) {
   console.log ('差')
} else {
   console.log ('异常')
}

```

2. switch

``` js
var city = '重庆'
switch(city) {
   case '北京':
     console.log ('BJ')
     break;
   case '上海':
     console.log ('SH')
     break;
   default:
      console.log ('CQ')
      break;
}
```

:::tip
一般来说值是有范围的或者条件是多个的用if, 定值有多个用switch
:::

##### 逻辑运算

与 && 或|| 非！

**假值：**
undefined null NaN "" 0 false, 除此之外都是真

1. &&

遇到真就往后走，遇到假或走到最后就返回当前的值

``` js
var a = 1 && 2 // 2
var b = 1 && 2 && undefined && 3 // undefined
```

2. ||
遇到假就往后走，遇到真或走到最后就返回当前的值

``` js
var a = 0 || null || 1 || 0 // 1
```

3. !

``` js
var a = !1 // false
```

#### 循环

for / while / do while

``` js
for (var i = 0; i < 10; i++) {
   console.log (i)
}
```
将for循环拆开
1. 声明var i = 0
2. 条件判断 for(;i<10;) { console.log (i) }, 返回false就停止循环
3. i++

最终变成如下语法, 与while相似
``` js
var a = 0
for(; a < 10; ) {
   console.log (a)
   a++
}

while(a < 10) {
   console.log (a)
   a++
}
```

**break: 终止循环**
**continue: 跳过当前循环**

不使用break，return怎样终止循环，将条件变为false
``` js
for (var i = 1; i ; i++) {
   console.log (i)
   if (i > 10) {
      //break;
      i = 0;
   }
}
```

**练习题：**

1. 打印0-100的数，()只能有一句，不能写比较，{}不能出现i++/--

``` js
var i = 100
for (;i--;) {
   console.log (i)
}
```

2. 10的n次方
``` js
var n = 5
var num = 1 
for (var i = 0; i < n; i++) {
   num *= 10
}
```

3. n的阶层
``` js
var n = 5
var num = 1
for (var i = 1; i <= n; i++) {
   num *= i
}
```

4. 翻转数字
``` js
var num = 789; // 输出987
var a = num % 10 // 9
var b = (num - a) % 100 / 10 // 8
var c = (num - a - b * 10) / 100 // 7
console.log ('' + a + b + c) // 987
```

5. 打印最大值
``` js
var a = 1,
    b = 2,
    c =3;
// 打印a b c中的最大值
if (a > b) {
   if (a > c) {
      console.log (a)
   } else {
      console.log (c)
   }
} else {
   if (b > c) {
      console.log (b)
   } else {
      console.log (c)
   }
}
```

6. 打印100以内的质数（1， 100都不是质数），只能被1和它本身整除的数

``` js
var c = 0;
for (var i = 2; i < 100; i++ ) {
   // 从1到当前的数，判断是否能整除
   for (let j = 1; j <= i; j ++) {
      if (i % j === 0) c ++
   }

   if (c === 2) console.log (i)
   c = 0
}
```

7. 斐波那契数列

``` js
var n = 6

var n1 = 1,
    n2 = 1,
    n3 ;
if (n < 0) {
   console.log ('not ')
} else if (n < 2) {
   console.log (1)
} else {
   for (var i = 2 ; i <= n; i++) {
      n3 = n1 + n2;
      n1 = n2;
      n2 = n3
   }
   console.log (n3)
}

```

**do while**

不管条件是否为true都会执行一次

``` js
var i = 0
do {
   console.log (i)
   i++
} while(false)
```

#### 引用值

1. array

``` js
var arr = [1, 2, 3]
arr[1] // 2
for (var i = 0 ; i < arr.length; i++) {
   console.log (arr[i]) // 1, 2, 3
}
```

2. object

``` js
var obj = {
   name: 'obj',
   age: 18,
   job: 'web'
}
obj.name = 'objs'
console.log (obj)
```

**typeof: 判断值的类型**

``` js
console.log (typeof(0)) // number
console.log (typeof('str')) // string
console.log (typeof(true)) // boolean
console.log (typeof(null)) // object
console.log (typeof(undefined)) // undefined

console.log (typeof(1 - 1)) // number
console.log (typeof(1 - '1')) // number
console.log (typeof('1' - '1')) // number

// a未定义
console.log (a) // 报错
console.log (typeof(a)) // undefined
console.log (typeof(typeof(a))) // string
console.log (typeof(typeof(1))) // string
```
:::tip
typeof()返回的是string, 数据类型再typeof返回都是string
:::

#### 显示类型转换 与 隐式类型转换

**显示类型转换**

1. Number()

``` js
// 重点记住
console.log (Number(null)) // 0

console.log (Number('123')) // 123
console.log (Number('true')) // NaN
console.log (Number(true)) // 1
console.log (Number(undefined)) // NaN
console.log (Number('a')) // NaN
console.lo g(Number('1a')) // NaN
```
2. parseInt()
只想将数字转为整型
``` js
console.log (parseInt(true)) // NaN
console.log (parseInt(false)) // NaN
console.log (parseInt(null)) // NaN
console.log (parseInt(undefined)) // NaN
console.log (parseInt(NaN)) // NaN
console.log (parseInt('3.14')) // 3

// parseInt第二个参数，基底
// 以16进制为基底，将10转为10进制
/**
 * 16进制：0-9abcdef
 * 2进制：01
 * 10进制：0-9
 * */ 
console.log (parseInt('10', 16)) // 16

// 重点: 遇到字符串就停止
console.log (parseInt('ab12')) // NaN
console.log (parseInt('12ab')) // 12
console.log (parseInt('1a2b')) // 1
```

3. parseFloat()

``` js
console.log (parseFloat('3.14')) // 3.14
console.log (parseFloat('3.1415926')) // 3.1415926
// 四舍五入保留两位
var num = parseFloat（'3.14159'）
console.log (num.toFixed(2)) // 3.14
```

4. toString()

``` js
console.log (parseInt(100, 2).toString(16))
```
5. Boolean()

``` js
// undefined null NaN "" 0 false
// 其他都为true
console.log (Boolean(undefined)) // false
```

**隐式类型转换**

1. ++
``` js
var a = '123' 
a++ // Number(a) a++
console.log (a) // 124
```

2. +/-/*/
``` js
var a = 'a' + 1 // 'a1'

var b = '3' * 2 // 6
```

3. \> < >= <= !=
```js
// Number(1) > 2
var a = '1' > 2 // false
var b = 1 > '2' // false

var c = 1 != '2' // true

```

4.  ===不进行隐式转换
``` js
var a = 1 === '1' // false
```

5. NaN不等于任何东西
``` js
var a = NaN == NaN // false
var b = NaN === NaN // false
```

6. true: 1 , false: 0
```js
var a = 2 > 1 > 3 // false
var b = 2 > 1 == 1 // true
```

7. undefined 
``` js
var a = undefined > 0 // false
var b = undefined < 0 // false
var c = undefined == 0 // false
```

8. null
``` js
var a = null > 0 // false
var b = null < 0 // false
var c = null == 0 //  false
```

9. undefined / null
```js
var a = undefined == null // true
var b = undefined === null // false
```

10. +/-
```js
var a = '123'
console.log (+a) // 123
console.log (-a) // -123
a = 'abc'
console.log (+a) // NaN
console.log (-a) // NaN
```

11. isNaN: 判断是否是NaN, 会经过Number()隐式转换, 再和NaN对比取布尔值
```js
console.log (isNaN(NaN)) // true
console.log (isNaN(123)) // false
console.log (isNaN('123')) // false

// Number('a') == NaN
console.log (isNaN('a')) // true 

// Number(null) == 0
console.log (isNaN(null)) // false

// Number(undefined) == NaN
console.log (isNaN(undefined)) // true
```

**练习：**

``` js

// 1
if (typeof (a) && (-true) + (+undefined) + '') {
   console.log (1)
} else {
   console.log (2)
}

// 1
if (1 + 5 * '3' === 16) {
   console.log (1)
} else {
   console.log (2)
}

// 1
console.log (!!' ' + !!'' - !!false || '未通过')

```

#### 函数：函数式编程

**高内聚，低耦合：模块的单一责任制**

希望一个模块独立的去完成一个任务，具体的完成情况跟高内聚有关。

高内聚：开发的模块，代码相关度强，紧密性强，模块的独立性强
低耦合：把重复的代码抽离出来，形成单一的模块

耦合：代码的重复性太高了

解耦合： 抽离成函数

**函数写法：**

函数名命名规则与变量命名规则相同


1. 函数声明

``` js
function test(参数) {
   函数的执行语句；
}
```

2. 表达式，字面量

``` js
// 此时函数名会自动会被忽略，函数名只能在内部调用，外部不可见
var test = function test1 () {
   test1()
}
console.log (test.name) // test1
// test1在函数外部不可见
test1() // 报错，test1 not defined
```

3. 匿名函数表达式

``` js
var test = function () {

}
```

**参数：**
形参（存在栈内存中）：声明时没有值，只是占位用，形式上占位
实参（存在堆内存中）：调用时传递的实际参数

形参和实参一一对应, 数量可不相等

```js
function test(a, b) {
   return a + b
}
test(1, 2)

```

**获取实参：arguments**
``` js
function test (a, b) {
   // 伪数组
   console.log (arguments)
   // 第一个
   console.log (arguments[0])
}
```

**获取形参长度：test.length**
``` js
function test (a, b) {
   console.log (test.length) // 2
}
```

**实参中传递了值在函数中可以更改实参的值，没传不能修改**

``` js
function test (a, b) {
   a = 3
   console.log (arguments[0]) // 3
}
test(1, 2)

function test1 (a, b) {
   b =3
   console.log (arguments[1]) // undefined
}
test1(1)
```

**初始化参数，形参默认undefined**

实参和形参谁有就取谁，默认undefined

``` js
function test(a, b) {
   console.log (a, b) // 1, undefined
}
test(1)

// 低版本不兼容 a = 1是es6
function test1(a = 1, b) {
   console.log (a, b) //  1, 2
}
test1(undefined, 2)

// 使用es5 arguments
function test2 (a, b) {
   var a = arguments[0] || 1;
   var b = arguments[1] || 2
   console.log (a, b) // 1, 2
}
test2()

// 使用es5 typeof -> 推荐这种用法
function test3 (a, b) {
   var a = typeof(arguments[0]) !== 'undefined' ? arguments[0] || 1
   var b = typeof(arguments[1]) !== 'undefined' ? arguments[1] || 2
   
   console.log (a, b) // 1, 2
}
test3()
```

**return**
1. 终止函数执行
2. 返回一个值的同时终止函数执行

``` js
function test (name) {
   if (!name) return 
   console.log (name)
   return name
}
```

函数内部可以访问外部的变量，函数外部不能访问内部的变量
``` js
var a = 1
function test() {
   console.log (a)
   var b = 2
}
test()
console.log (b) // 报错
```

:::tip
总结：函数就是一个固定的功能或者是程序段被封装的过程，实现一个固定功能或者程序，在这个封装体中需要一个入口（参数）和一个出口（返回）
:::

##### 递归

找规律，找出口

**找到出口后，往上依次赋值，返回最后结果**

1. 阶层
出口：n1 = 1
规律：n = n * n-1

``` js
/**
 * 从出口条件往上依次赋值
 * fact(5) = 5 * fact(4)
 * fact(4) = 4 * fact(3)
 * fact(3) = 3 * fact(2)
 * fact(2) = 2 * fact(1)
 * fact(1) = 1
 * 这时到了出口，往上依次赋值并返回最后的结果
 * fact(2) = 2 * 1 = 2
 * fact(3) = 3 * 2 = 6
 * fact(4) = 4 * 6 = 24
 * fact(5) = 5 * 24 = 120
 * 返回120
*/
function fact(n) {
   if (n === 1) return 1
   return n * fact(n-1)
}
fact(5) // 120

```

2. 斐波那契数列
规律：n3 = n2 + n1
出口：n <= 0 n <= 2
``` js
function fb (n) {
   if (n <= 0) return 0
   if (n <= 2) return 1
   return fb(n-1) + fb(n-2)
}
```

#### :pink_heart:预编译

##### JS执行流程

1. 通篇的检查语法错误

预编译过程：

2. 解释一行执行一行


##### 变量和函数声明现象

函数声明整体提升，变量只有声明提升，赋值不提升

``` js
test()
function test() {
   console.log ('函数声明提升')
}

// 变量声明提升
console.log (a) // undefined
var a = 10
```

出现如下很难用提升解决的问题：
``` js
console.log  (a) // function

function a () {
   var a = 10;
   console.log (a)
}

var a = 1;

```

##### 暗示全局变量 imply global variable

变量未声明就赋值就是暗示全局变量的现象
在函数内未声明直接赋值挂载到全局变量上

``` js
// 全局的变量挂载到window上的

/**
 * window = {
 *   a: 1,
 *   b: 2
 * }
*/

a = 1
console.log (a) // 1

console.log (window.a ) //1


var b = 2
console.log (window.b) // 2

// 在函数内未声明直接赋值挂载到全局变量上
function test () {
   var a = b = 1
}

test()
console.log (a) // 报错、
console.log (window.a) // undefined
console.log (window.b) // 1

```

##### 函数预编译：函数执行之前进行的步骤，创建函数上下文 AO: activation object

预编译做过的事情，执行时就不做了

1. 寻找形参和变量声明
2. 实参赋值给形参
3. 找函数声明，赋值函数体
4. 执行

``` js
/**
 * 执行前
 * AO = {
 *   a: undefined -> 2 -> function a  
 *   b: undefined
 *   d: function 
 * } 
 * 
 * 执行后
 * AO = {
 *   a: 1
 *   b: function
 *   d: function
 * }
 * 
 **/
 
function test(a) {
   console.log (a) // function
   var a = 1
   console.log (a) // 1
   function a () {}
   var b = function () {}
   console.log (b) // function  
   function d () {} 
}

test(2)

/**
 * AO = {
 *   a: undefined -> 1
 *   b: undefined -> function
 *   c: undefined
 *   d: function 
 * }
 * 
 * 执行
 * AO = {
 *   a: 5
 *   b: 6
 *   c: 0
 *   d: function
 * }
*/
function test1 (a, b) {
   console.log (a) // 1
   c = 0
   var c
   a = 5
   b = 6
   console.log (b) // 6
   function b () {}
   function d () {}
   console.log (b) // 6
}
test1 (1)

```

##### 全局预编译：全局上下文GO: global object

GO === window

1. 找变量
2. 找函数声明并赋值函数体
3. 执行

``` js
/**
 * GO = {
 *  a: undefined -> function
 * } 
 * 
 * 执行
 * GO = {
 *  a: 1
 * }
 */

var a = 1
function a () {
   console.log(a)
}
console.log (a) // 1

/**
 * GO = {
 *  d: undefined
 *  c: function
 * }
 * 
 * 执行
 * GO = {
 *  d: function
 * }
*/

console.log(c, d) // function undefined
function c() {}
var d = function () {}
```

##### 全局和函数

``` js

/**
 * GO = {
 * 
 * }
 * 
 * AO = {
 *  a: undefined
 * }
 * 
 * 执行
 * GO = {
 *  b: 1
 * }
 * AO = {
 *  a: 1
 * } 
 *
 */
function test () {
   var a = b = 1
   console.log (a) // 1
}

```

``` js

/**
 * GO = {
 *  b: undefined
 *  a: function 
 * }
 * 
 * AO = {
 *  a: undefined -> 1 -> function 
 *  b: undefined
 * }
 * 
 * 执行
 * GO = {
 *  b: 3,
 *  a: function
 * }
 * 
 * AO = {
 *  a: 2
 *  b: 5
 * }
 * 
 * 
*/

var b = 3
console.log (a) // function
function a (a) {
   console.log (a) // function
   var a = 2
   console.log(a) // 2
   function a() {
      
   }
   var b = 5
   console.log (b) // 5
}
a(1)
```

``` js

/**
 * GO = {
 *  a: undefined -> 1
 * }
 * 
 * AO = {
 *  a: undefined -> 2 -> 3
 * }
*/

a = 1
function test() {
   console.log (a) /// undefined
   a = 2
   console.log (a) // 2
   var a =3
   console.log (a) // 3
}

test()
var a
```

预编译不看if
``` js

/**
 * GO = {
 *  a: undefined -> a
 *  test: function
 *  c: 3
 * }
 * 
 * AO = {
 *  b: undefined
 * }
*/
function test() {
   console.log (b) // undefined
   if (a) {
      var b = 2
   }
   c = 3
   console.log (c) // 3
}
var a
test()
a = 1
console.log(a) // 1
```

``` js
/**
 * GO = {
 *  test: function
 * } 
 * AO = {
 *  a: undefined -> function a 
 * }
 */
function test() {
   return a
   a = 1
   function a() {

   }
   var a = 2
}

console.log (test()) // function a

```

``` js
/**
 * GO = {
 *  test: function 
 * } 
 * 
 * AO = {
 *  a: undefined -> function a  -> 1 -> 2
 * }
 */
function test() {
   a = 1
   function a () {}
   var a = 2
   return a
}
console.log (test()) // 2
```

``` js
/**
 * GO = {
 *  a: undefined -> 1
 *  test: function
 *  f: 5
 * }
 * 
 * AO = {
 *  e: undefined -> 1 -> function -> 2
 *  a: undefined -> 4
 *  c: undefined
 *  b: undefined
 * }
*/

a = 1
function test (e) {
   function e() {}
   arguments[0] = 2
   console.log (e) // 2
   if (a) {
      var b = 3
   }
   var c
   a = 4
   var a
   console.log (b) // undefined
   f = 5
   console.log (c) // undefined
   console.log (a) // 4
}
var a 
test(1)
console.log (a) // 1
console.log (f) // 5
```

#### :hibiscus:::o::o::o:作用域和作用域链

函数：也是一种对象（引用）类型，有自己的属性（test.name/test.length/test.prototype）,在对象中有些属性是我们无法访问的，JS引擎内部固有的隐式属性，比如[[scope]]

[[scope]]: 
1. 是函数创建时，生成的一个JS内部的隐式属性
2. 是函数存储作用域链的容器
   作用域链中存有AO/GO
   AO是一个即时的存储容器，函数执行完成后，销毁AO


**作用域与作用域链**

1. 全局执行的前一刻创建GO
2. 全局执行时函数被定义，此时函数的环境是上级的环境
3. 函数执行创建AO放在作用域链的顶端（第0位）
   此时查找变量就是从作用域顶端开始往下查找

4. 函数执行完成后销毁AO, 环境恢复到被定义时

**图例：**

1. 全局执行，a函数被定义
![a](/public/imgs/scope-1.png) 

2. 函数a执行前一刻

![a](/public/imgs/scope-2.png) 

3. 函数b定义
![b](/public/imgs/scope-3.png) 

4. 函数b执行前一刻
![b](/public/imgs/scope-4.png) 

5. 函数b执行完
![b](/public/imgs/scope-5.png) 

6. 函数a执行完
![a](/public/imgs/scope-6.png) 


:::tip
函数外部访问不到函数内部的变量，查找变量是从作用域链的顶端开始往下查找，当前函数的作用域链中没有内部函数的作用AO
:::

**手动分析作用域与作用域链**
``` js
function a () {
   function b() {
      var c = 2
   }
   b()
}
a()
```
1. 全局执行前创建GO 
``` js
GO = {
   a: function a() {}
}
```
2. 全局执行，a函数被定义，创建a的作用域a.[[scope]], 存的是上级的作用域
``` js
a.[[scope]] = [
   // GO
   { a: function a() {} }
]
```
3. a函数执行前，创建a的AO,放在作用域顶端
``` js
a.[[scope]] = [
   // a -> AO
   { b: function b() {} }
   // GO
   { a: function a() {} }
   
]
```
4. a函数执行，b被定义，创建b的作用域b.[[scope]], 存的是上级的作用域
```js
b.[[scope]] = {
   // a -> AO
   { b: function b() {} }
   // GO
   { a: function a() {} }
   
}
```
5. b函数执行，创建b的AO,放在作用域顶端
```js
b.[[scope]] = {
   // b -> AO
   { c: 2 }
    // a -> AO
   { b: function b() {} }
   // GO
   { a: function a() {} }
}
```
6. b函数执行完，销毁b的AO
```js
b.[[scope]] = {
   // a -> AO
   { b: function b() {} }
   // GO
   { a: function a() {} }
   
}
```

7. a函数执行完，销毁a的AO, 此时b的scope也被删除
``` js
a.[[scope]] = [
   // GO
   { a: function a() {} }
]
```

#### :sunflower:::o::o::o:闭包

1. 全局执行，test1函数被定义
![test1](/public/imgs/closure-1.png) 

2. test1函数执行前，test2被定义
![test1](/public/imgs/closure-2.png) 

3. test1函数执行结束后，原本AO要销毁，但返回了test2到外部，此时test2的作用域链中存有test1的AO，所以test1的AO未销毁
![test1](/public/imgs/closure-3.png) 

4. test3函数执行，test2的作用域链中增加自己的AO
![test1](/public/imgs/closure-4.png) 

5. test3函数执行完成，test2的AO被销毁，但test1的AO任然存在
![test1](/public/imgs/closure-5.png)

**:runner::o::o::o:闭包定义：**

当内部函数被返回到外部函数并保存时，一定会产生闭包，闭包会产生原来的作用域链不释放，大量的闭包可能会导致内存泄漏或加载过慢

**闭包的基本使用：**

1. 变量存储
``` js
function breadManager(initNum) {
   var breadNum = initNum || 10

   function supplyBread() {
      breadNum += 10
      console.log (breadNum)
   }

   function saleBread() {
      breadNum --
      console.log (breadNum)
   }

   return [supplyBread, saleBread]
}

var breadStore = breadManager()
breadStore[0]() // 20
breadStore[1]() // 19
```
``` js
function breadManager(initNum) {
   var breadNum = initNum || 10

   function supplyBread() {
      breadNum += 10
      console.log (breadNum)
   }

   function saleBread() {
      breadNum --
      console.log (breadNum)
   }

   return {
      supplyBread,
      saleBread
   }
}

var breadStore = breadManager()
breadStore.supplyBread() // 20
breadStore.saleBread() // 19
```

#### 自执行函数（立即执行函数/初始化函数）

**特点：**
1. 自动执行
2. 执行完以后立即释放(普通函数执行完成全局GO不会自动释放，常用于页面加载完成后初始化)

``` js
// w3c推荐的使用方式
(function() {
   console.log ('test')
}())

// 日常使用的方式
(function() {
   console.log ('test1')
})()
```

自执行函数也能传递参数和返回特定值，但函数名自动忽略（本质是表达式执行完被销毁了）
``` js
var test = (function test1(a, b){
   return a + b
}(2, 3))
console.log (test) // 5
```

**一定是表达式才能被执行符号执行，被括号包裹的一定是表达式**

```js
// 报错
function test() {

}() // 语法错误


// 正常打印
var test = function () {
   console.log ('test')
}()

(function(){
   console.log ('test')
})()
```
**将函数声明变成表达式就能自动执行，并且会忽略函数名**

将函数声明变成表达式的方法，在函数前加 + - ！|| &&

``` js
+ function test() {
   console.log ('test')
}() // test

```

**示例：**

1. 函数后紧跟表达式不会报错
``` js
function test() {
   console.log ('test')
}(6) // 不会报错，js引擎将(6)解析为表达式，函数后面是表达式，所以不报错，但函数不执行
```

2. 打印0-9， 由于产生了闭包，导致打印了10个10，解决方式用立即执行函数
``` js
function test() {
   var arr = []
   for (var i = 0; i < 10;i++) {
      arr[i] = function () {
         console.log (i)
      }
   }
   return arr
}

var test1 = test()

for(var i = 0 ; i<test1.length; i++) {
   test1[i]() // 10个10
}

// 解决方法
function test1 () {
   var arr = []
   for (var i = 0; i<10; i++) {
      // 立即执行，每次i都不同
      (function(j){
         arr[j] = function () {
            console.log (j)
         }
      }(i))
   }
   return arr
}
```

3. 逗号运算

``` js
var fn = (function test1() {
   return 1
}, function test2() {
   return '2'
})()

console.log (typeof fn) // string

```

4. 表达式自动忽略函数名
``` js
var a = 10
/**
 * function b() {} 为true,进入if
 * typeof b 为undefined, 此时(function b() {})为表达式自动忽略函数名b
 */
if (function b() {}) {
   a+= typeof b
}
console.log (a) // 10undefined

```

**示例：**
1. 累加器

``` js
function test() {
   var num  = 0;
   return function () {
      console.log (++num)
   }
}
var add = test()
add() // 1
add() // 2

```

2. 学生管理
``` js
function myClass() {
   var students = []

   var operations = {
      join: function (name) {
         students.push(name)
         console.log (students)
      },
      leave: function (name) {
         for(var i = 0; i < students.length;i++) {
            var item = students[i]
            if (item === name) {
               students.splice(i, 1)
            }
         }
         console.log (students)
      },
      leaveIndex: function (name) {
         var idx = students.indexOf(name)
         if (idx !== -1) {
            students.splice(idx, 1)
         }
      }
   }

   return operations;
}

var operation = myClass()
operation.join('test1')
operation.join('test2')
operation.join('test3')
operation.leave('test2')
operation.leaveIndex('test1')
```

#### 对象

删除对象的属性或方法`delete obj.name`

对象方法中获取自己用this

**创建对象的方式**

1. 对象字面量

``` js
var obj = {
   name: 'obj'
}
```

2. 系统自带的构造函数(和对象字面量一样)实例化对象

``` js
var obj = new Object()
obj.name = 'obj1'
```

3. 自定义构造函数实例化对象

通过构造函数每次构造出来的实例都是一个新的对象，修改后不影响其他实例

``` js
function Teacher(opt) {
   this.name = opt.name
   this.play = function () {
      console.log ('play')
   }
}

var teacher = new Teacher({name: 'test'})

```

#### 构造函数

构造函数没有实例化之前，this指向window, 实例化后指向实例对象

``` js
function Car () {
   console.log (this)
}

var car1 = new Car()

```

#### new做了什么

1. 隐式的创建this
2. 隐式的返回this
3. 改变this指向为实例化对象

``` js
/**
 * GO = {
 *   Car: (function)
 *   car1: {
 *     color: 'red',
 *     brand: 'benz'
 *   }
 * }
 * 
 * AO = {
 *   this: {
 *     color: 'red',
 *     brand: 'benz'
 *   }
 * }
 * 
*/
function Car (color, brand) {
   /**
    * this = {
    *   color: red,
    *   brand: benz
    * }
   */
   this.color = color
   this.brand = brand

   // return this
}

var car1 = new Car('red', 'Benz')


// 普通函数实现构造函数
function test() {
   var obj = {
      color: 'red'
   }
   return obj;
}

var test1 = test()
console.log (test1.color) // 'red'
```

#### 构造函数可以手动返回值

返回普通值没有作用
返回对象类型({}/[]/function)会覆盖默认返回的this


### 包装类

原始值没有自己的方法和属性

将原始值传给内置的方法会生成实例

new Number / new String / new Boolean

``` js
var a = 1
console.log (a) // 1
var aa = new Number(1)
console.log (aa) // Number{[[PrimitiveValue]]: 1}

aa.name = 'aa'
var bb = aa + 1
console.log (bb) // 2


// String
var c = new String('cc')

c.name = 'cc'

var d = c + 'dd' // ccdd
```

**示例：**
1. 
``` js
var a = 123
a.len = 3
// new Number(a).len = 3
// 找不到存储的地方，delete
console.log (a.len) // undefined

// 解决方法
var a = new Number(123)
```

2. 为什么字符串可以访问length

``` js
var str = 'str'
console.log (str.length) // 3

// 原理是使用了包装类 new String默认有length属性
new String(str).length

```

3. 字符出不能通过length截断， 数组可以

``` js
var arr = [1, 2, 3]
arr.length = 2
console.log (arr) // [1, 2]

// string
var str = 'str'
str.length = 1
// new String().length  = 1
// delete

// new String(str)
console.log (str) // str


```

4. 
``` js
var name = 'lan'
name += 10
var type = typeof(name)
if (type.length === 6) {
   type.text = 'string'
   // new String().text = 'string'
   // delete
}
console.log (type.text) // undefined

// 一定能输出string
var type = new String(typeof(name))
```

5.
``` js
function Test(a, b, c) {
   var d = 1
   this.a = a
   this.b = b
   this.c = c
   function f() {
      d++
      console.log (d)
   }
   this.g = f

   // return this 隐式返回this形成闭包
}
var test1 = new Test()
test1.g() // 2
test1.g() // 3
var test2 = new Test()
test2.g() // 2

```

6.
``` js
var x = 1,
    y = z = 0;
function add(n) {
   return n = n + 1
}

y = add(x)
function add(n) {
   // n = 1 + 3
   // n =4
   // return n
   return n = n + 3
}
z = add(x)
console.log (x, y, z)// 1 ,4, 4
/**
 * GO = {
 *   x: undefined -> 1
 *   y: undefined -> 0 -> 4
 *   z: undefined -> 0 -> 4
 *   add: undefined -> function {return n = n+3}
 * }
 * AO = {
 *   n: undefined -> 1 ->  4 
 * }
 * 
*/
```

7. 
```js
function foo1(x) {
   console.log (arguments)
   return x
}
foo1(1, 2, 3) // 123

function foo2(x){
  console.log (arguments)
  return x
}(1, 2, 3)

(function foo3(x){
  console.log (arguments)
  return x
}(1, 2, 3))// 123
```

8.
```js
function b(x, y,a) {
   a = 10
   // 形参和实参是映射关系，可以修改
   console.log (arguments[2]) // 10

   arguments[2] = 20
   console.log (arguments[2]) // 20
}
b(1, 2, 3)
```

9. UNICODE码涵盖ASCII码，0-255每个都是1个字节，超出是2个字节
ASCII码表1 0 -127， 表二128-255

获取字符在UNICODE码中的位置
``` js
var str = 'a'
var pos = str.charCodeAt(0)
console.log (pos) // 97
```

10. 写一个函数，接受任意字符串，算出这个字符串的总字节数

``` js
function getBytes (str) {
   var bytes = 0;
   for (var i = 0 ;i <str.length; i++) {
      var pos = str.charCodeAt(i)
      if (pos <= 255) {
         bytes ++
      } else {
         bytes += 2
      }
   }
   return bytes
}

```
``` js
function getBytes (str) {
   var bytes = str.length;
   for (var i = 0 ;i <str.length; i++) {
      var pos = str.charCodeAt(i)
      if (pos > 255) {
         bytes ++
      }
   }
   return bytes
}

```

### 原型

原型prototype其实是function对象下的一个属性，打印结果也是对象


在构造函数中，原型是定义构造函数构造出来得每个对象得公共祖先，所有被该构造函数构造出得对象都能继承原型上的属性和方法

**原型的作用：**
所有在构造函数中固定的属性或方法（每个方法都是一样的）都应该写在原型上（写在构造函数上实例化时,代码耦合）, 属性配置项写在构造函数中

``` JS
function HandPhone(opt) {
   this.color = opt.color;
   this.brand = opt.brand;
   // 一下固定的属性应该写在原型上
   this.screen = '18: 9';
   this.system = 'Andriod';
}

HandPhone.prototype.rom = '64G'
HandPhone.prototype.ram = '6G'
HandPhone.prototype.screen = '18:9'
HandPhone.prototype.system = 'Andriod'
HandPhone.prototype.showPhone = function () {
   console.log (`I have a ${this.color}${this.brand}`)
}

HandPhone.prototype = {
   rom: '64G',
   ram: '6G',
   screen: '18:9',
   system: 'ios',
   showPhone: function () {
      console.log (`I have a ${this.color}${this.brand}`)
   }
}

var hp1 = new HandPhone({
   color: 'red',
   brand: 'xiaomi'
})

var hp2 = new HandPhone({
   color: 'blank',
   brand: 'hua wei'
})

console.log (hp1.rom) // 64g
console.log (hp2.ram) // 6g
```

通过构造出来的实例去新增、删除、修改原型是不行的

**原型上的构造器指向构造函数本身，可以通过原型更改**
``` js
function TelePhone() {}
HandPhone.prototype = {
   constructor: TeltePhone
}
```

**原型是属于实例对象，实例化后才有**
``` js
function Car(name) {
   var this = {
      name: 'cars'
      __proto__: Car.prototype
   }

   this.name = name
}

Car.prototype = {
   name: 'car'
}

const car = new Car('cars')
console.log (car.name) // 'cars'

```

**实例的原型（__proto__）是可以修改的**
``` js
function Car () {}
Car.prototype = {
   name: 'car'
}

var p1 = {
   name: 'car1'
}

var car = new Car()
console.log (car.name) // car

car.__proto__ = p1
console.log (car.name) // car1

```

**例子：**
``` js
Car.prototype.name = 'Benz'
function Car () {}
Car.prototype.name = 'BWM'
var car = new Car()
console.log (car.name) // 'MWM'
```

``` js
Car.prototype.name = 'Benz'
function Car () {}

var car = new Car()
Car.prototype.name = 'BWM'
console.log (car.name) // 'MWM'
```

``` js
Car.prototype.name = 'Benz'
function Car () {}

var car = new Car()
Car.prototype = {
   name: 'BWM'
}

console.log (car.name) // 'Benz'
console.log (car) // {}
```

``` js
Car.prototype.name = 'Benz'
function Car () {}
Car.prototype = {
   name: 'BWM'
}
var car = new Car()

console.log (car.name) // 'BWM'

// car.prototype.constructor -> Car() -> prototype -> name: 'Benz'
```

#### JS插件

window 和 return

``` js
function test () {
   var a = 1
   function add () {
      a++
      console.log (a)
   }
   return add
}

var add = test()
add() // 2
add() // 3
```

``` js
function test () {
   var a = 1
   function add () {
      a++
      console.log (a)
   }
   window.add = add
}

add() // 2
add() // 3
```

``` js
(function test () {
   var a = 1
   function add () {
      a++
      console.log (a)
   }
   window.add = add
})()

add() // 2
add() // 3
```

插件的写法：
``` js
;(function () {
   function Car () {

   }

   Car.prototype = {

   }

   window.Car = Car
})()

var car = new Car();
```