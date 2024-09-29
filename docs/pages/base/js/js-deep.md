# 重学JavaScript

## 浏览器

## 五大主流浏览器 内核
              
1. IE          trident
2. Chrome      webkit blink
3. Safari      webkit
4. Firfox      gecko
5. Opera       presto

## 浏览器的历史和Js的诞生

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


## 线程

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

## :pink_heart:ECMAScript

## 变量

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

## 数据类型

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



## 基本语法
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

## 运算

#### 普通运算

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

#### 比较运算

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

## 条件语句

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

#### 逻辑运算

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

## 循环

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

## 引用值

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

## 显示类型转换 与 隐式类型转换

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

## 函数：函数式编程

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

#### 递归

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

## :pink_heart:预编译

#### JS执行流程

1. 通篇的检查语法错误

预编译过程：

2. 解释一行执行一行


#### 变量和函数声明现象

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

#### 暗示全局变量 imply global variable

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

#### 函数预编译：函数执行之前进行的步骤，创建函数上下文 AO: activation object

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

#### 全局预编译：全局上下文GO: global object

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

#### 全局和函数

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

## :hibiscus:::o::o::o:作用域和作用域链

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

## :sunflower:::o::o::o:闭包

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

## 自执行函数（立即执行函数/初始化函数）

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

## 对象

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

## 构造函数

构造函数没有实例化之前，this指向window, 实例化后指向实例对象

``` js
function Car () {
   console.log (this)
}

var car1 = new Car()

```

## new做了什么

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

## 构造函数可以手动返回值

返回普通值没有作用
返回对象类型({}/[]/function)会覆盖默认返回的this


## 包装类

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

## ::o::o::o:原型

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

## JS插件

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

**计算插件**
``` js
;(function () {
   function Compute(opt) {
      this.x = opt.firstNum || 0
      this.y = opt.secondNum || 0
   }

   Compute.prototype = {
      add: function () {
         return this.x + this.y
      },
      minus: function () {
         return this.x - this.y
      },
      mul: function () {
         return this.x * this.y
      },
      div: function () {
         return this.x / this.y
      }
   }

   window.Compute = Compute;
})()


var compute = new Compute({
   firstNum: 1,
   secondNum: 2
})

var res1 = compute.add() // 3
var res2 = compute.minus() // -1
var res3 = compute.mul() //2
var res4 = compute.div() //0.5
```

## 原型链

``` js
function Professor() {}
Professor.prototype.tSkill = 'JAVA'

var professor = new Professor()

Tearcher.prototype = prefessor;;
function Teacher() {
   this.mSkill = 'JS'
}

var teacher = new Teacher()

Student.prototype = teacher;
function Student() {
   this.pSkill = 'CSS'
}

var student = new Student()

console.log (student)

/**
 * Student{
 *   pSkill: 'CSS',
 *   __proto__: {
 *     mSkill: 'JS',
 *     __proto__: {
 *       __proto__: {
 *         tSkill: 'JAVA',
 *         constructor: Prefessor()
 *         __proto__: {
 *           constructor: Object
 *         }
 *       }
 *     }
 *   }
 * }
 * 
*/

```

沿着__proto__去找原型上的属性，直到原型链的顶端Object.prototype，形成的链就是原型链

**通过后代修改祖先的属性，原则上是不可以的，但属性是引用值是可以修改的，原始值不能修改**
``` js
function Professor() {}
Professor.prototype.tSkill = 'JAVA'

var professor = new Professor()

Tearcher.prototype = prefessor;;
function Teacher() {
   this.mSkill = 'JS'
   this.info = {
      name: 'js',
      age: 1
   }
   this.friends = 100
}

var teacher = new Teacher()

Student.prototype = teacher;
function Student() {
   this.pSkill = 'CSS'
}

var student = new Student()
student.info.car = 'Benz' // 可以修改
student.info.age = 2 // 可以修改
student.friends++  // 不能修改原型，增加自己的属性friends: 101
console.log (student)
/**
 * Student{
 *   pSkill: 'CSS',
 *   friends: 101,
 *   __proto__: {
 *     friends: 100,
 *     mSkill: 'JS',
 *     info: {
 *      name: 'js',
 *      age: 2,
 *      car: 'benz'
 *     },
 *     __proto__: {
 *       __proto__: {
 *         tSkill: 'JAVA',
 *         constructor: Prefessor()
 *         __proto__: {
 *           constructor: Object
 *         }
 *       }
 *     }
 *   }
 * }
 * 
*/

```
后代不能修改祖先原型上的属性（原始值）
``` js
function Person() {
   this.smoke = function () {
      this.weight --
   }
}

Person.prototype = {
   weight: 100
}

var person = new Person()

person.smoke()

console.log (person) // { weight: 99  }
console.log (Person.prototype) // { weight: 100 }

```

实例中自己有的属性就拿自己的，没有就往原型上找
``` js
function Car () {
   this.brand = 'Benz'
}

Car.prototype = {
   brand: 'BWM',
   intro: function () {
      console.log (this.brand)
   }
}

var car = new Car()
/**
 * function Car () {
 *   var _this = {
 *     brand: 'Benz'
 *   }
 * }
*/

car.intro()  // Benz

// Car.prototype也是一个对象
Car.prototype.brand // 'BWM'
Car.prototype.intro() // 'BWM'
```

原型的原型一定是系统自带的Object构造出来的

创建对象的几种方式
1. 对象字面量
``` js
var obj = {}
```
2. 系统自带的Object
``` js
var obj = new Object()
```
3. 自己构造
``` js
function Obj () {

}
var obj = new Obj()
```
4. Object.create(原型对象, null) 创建对象

可自定义原型
``` js
function Obj () {}
Obj.prototype.num = 1
var obj1 = Object.create(Obj.prototype)
var obj2 = new Obj()

// obj1 == obj2
```
实例化obj2
1. 调用构造函数Obj的初始化属性和方法
2. 指定实例对象的原型


**不是所有的对象都继承于Object.prototype**
原型只能系统构造，不是自己定义
```js
var obj = Object.create(null) //没有原型

var obj1 = {
   count: 1
}

obj.__proto__ = obj1
conosole.log (obj.count) // undefined
```

**document.write（）一定会经过隐式类型转换为string**
``` js
var obj = {}
var obj1 = Object.create(null)

// 会调用Object.toString, obj1没有原型，没有toString
document.write(obj) // [object Object]
dodument.write(obj1) // Error 可以自己加toString obj1.toString= function

```

**原型方法的重写**

使用Object.prototype.toString.call(1)打印出来是[object Number],实现不了变成字符串1，所有Number包装类重写toString方法

Number.prototype.toString.call(1)打印出来为'1'


**call / apply改变this指向**
``` js
function Car (brand, color) {
   this.brand = brand;
   this.color = color;
}

var newCar = {}

// { brand: 'Benz', color: 'red' }
Car.call(newCar, 'Benz', 'red') 
Car.apply(newCar, ['Benz', 'red'])
```

## 对象继承

1. 通过原型继承
``` js
function Teacher() {
   this.skill = 'JS'
}

Teacher.prototype = {
   lang: 'US'
}

var teacher = new Teacher();

Student.prototype = teacher

function Student () {
   this.name = 's'
}

var student = new Student()

console.log (student.lang) // US

```

2. 通过call/apply借用对象的属性实现继承, 不能访问对象原型上的属性和方法

``` js
function Teacher () {
   this.skill = 'JS'
}

Teacher.prototype = {
   lang: 'US'
}

function Student(name, skill) {
   Teacher.call(this, skill)
   this.name = name
}

var student = new Student('student', 'CSS')

console.log(student.name, student.skill) // student CSS

```

3. 公共原型继承
``` js
function Teacher() {
   this.skill = 'JS'
}

Teacher.prototype = {
   mSkill: 'JAVA'
}

var teacher = new Teacher()

Student.prototype = Teacher.prototype
Student.prototype.age = 18 // 此时Teacher的原型也会修改

function Student () {
   this.skill = 'CSS'
}

var student = new Student()

console.log (student.mSkill) // JAVA

```

4. 圣杯模式
``` js
function Teacher() {
   this.name = 'LI'
}

Teacher.prototype = {
   pskill: 'JAVA'
}

var t = new Teacher()

function Student () {
   this.name = 'LIU'
}

// 定义中间件
function Buffer () {}
Buffer.protype = Teacher.prototype
var buffer = new Buffer()
Student.prototype = buffer
Student.prototype.age = 10 //不会影响Teacher的原型

var s = new Student()//
```

**封装继承**

1. 基本写法
``` js
function inherit(Target, Origin) {
   function Buffer() {}
   Buffer.prototype = Origin.prototype;
   Target.prototype = new Buffer();
   // 还原构造器
   // 让Target的Constructor为Target
   Target.prototype.constructor = Target;
   // 保存继承源
   // Target继承Origin
   Target.prototype.super_class = Origin;
}

``` 

2. 使用闭包的方式，也是模块化开发方式

``` js
var inherit = (function () {
   var Buffer = function () {}
   return function (Target, Origin) {
      Buffer.prototype = Origin.prototype;
      Target.prototype = new Buffer();
      Target.prototype.constructor = Target;
      Target.prototype.super_class = Origin
   }
})()

```

**闭包的多种方式**

1. 
``` js
function test() {
   var num = 100
   return function () {
      num++
      console.log (num)
   }
}

var add = test()
add()

```

2. 
```js
function test() {
   var num = 100
   return {
      add () {
         num ++
         console.log (num)
      },
      minus() {
         num--
         console.log (num)
      }
   }
}

var compute = test()
compute.add()
compute.add()
compute.minus()

```

3. 
``` js
function Test() {
   var num = 100

   this.add = function () {
      num ++
      console.log (num)
   }

   this.minus = function () {
      num --
      console.log (num)
   }
   // 实例化时会隐式的返回this对象
}

var test = new Test()
test.add()
test.add()
test.minus()
```

## 对象

**链式调用通过return this**

```js
var obj = {
   speak() {
      console.log ('speak')
      return this
   },
   eat() {
      console.log ('eat')
      return this
   }
}

obj.speak().eat()
```

**通过中括号访问可变的属性**

``` js
var obj = {
   name1: 'n',
   name2: 'n2'
}
var a = 1
obj['name' + a ]
```

**遍历对象使用for in**

```js
var obj = {
   name: 'obj'
   age: 1
}
for (var key in obj) {
   // 不能这样访问，obj.key 会被转为obj['key']
   // 在obj上找不到key 所以是undefined
   console.log (obj.key) // undefined
   console.log (key + ':' + obj[key])
}
```

**hasOwnProperty:排除原型上的自定义属性**默认会遍历出原型上自定义的属性,只想要自己有的属性，用hasOwnProperty
``` js
function Car () {
   this.color = red
}

Car.prototype.brand = 'Benz'
Object.prototype.name = 'Object'

var car = new Car()

for (var key in car) {
   console.log (key, ':', car[key]) // color: red brand:Benz name:Object 
   if (car.hasOwnProperty(key)) {
      console.log (key, ':', car[key]) // color: red
   }
}

```

**in:是否是对象的属性，不排除原型**
``` js
var car = {
   brand: 'Benz'
}
// 默认会找car['place']
console.log ('place' in car) // false

function Car () {
   this.color = red
}

Car.prototype.brand = 'Benz'

var car = new Car()

console.log ('brand' in car) // true
```

**:pink:instanceof** 
A instanceof B：A对象的原型里到底有没有B的原型，有返回true否则返回false
``` js
function Car () {

}

Car.prototype = {

}

var car = new Car()

car instanceof Car // true
car instanceof Object // true
[] instanceof Array // true
[] instanceof Object // true
{} instanceof Object // true
```

**判断是否是数组**

``` js
var arr = [1, 2, 3]
console.log (arr.constructor === Array) 
console.log (arr.instanceof Array)
// 推荐用第三种
/**
 * 原理
 * Object.prototype = {
 *   toString () {
 *     // call后this指向arr,所以打印出来是'[object Array]'
 *     this.toString()
 *   }
 * } 
 */
console.log (Object.prototype.toString.call(arr) === '[object Array]')
console.log (Array.isArray(arr))
```

## This

1. 全局this指向window
2. 没有实例化的函数内部的this默认指向window(预编译)
``` js
function test(b) {
   this.d = 3
   var a = 2
   function c() {} 
}
test(1)
console.log (window.d) //3 
/*
* AO = {
   arguments: [1]
   this: window
   a: undefined  2
   b: undefined  1
   c: undefined  function c
  }
*/
```
3. 构造函数实例化后，this指向实例化对象
``` js
function Car () {
   /**
    * var _this = {
    *   brand: 'Audio',
    *   __proto__: Car.prototype
    * }
   */
   this.brand = 'Audio'
   // return _this
}

var car = new Car()

/**
 * AO = {
 *   this: window  -> 实例化后 car
 * }
 * 
 * GO = {
 *   Car: function
 *   car: {}
 * }
*/
```

4. 通过call/apply改变this指向
``` js
function Car () {
   this.name = 'car'
}

function Person () {
   Car.apply(this)
   this.age = 18
}
```

**callee/caller**

1. callee返回正在执行的函数对象
``` js
function test(a, b) {
   // 返回实参列表所对应的函数
   console.log (arguments.callee) // function test(a, b) {}
   console.log (arguments.callee.length) // 2
   console.log (test.length) // 2

   // 实参长度
   console.log (arguments.length) // 2
}

test(1, 2)
```

计算n的累加
``` js
function sum (n) {
   if(n <= 1) return 1
   return n + sum(n - 1)
}

sum(10) // 55


// 使用模块化开发需要使用到callee
var sum = (function (n) {
   if (n <= 1) return 1
   return n + arguments.callee(n - 1)
})()
```

2. caller: 返回当前被调用函数的函数引用

``` js
function test1 () {
   test2()
}

function test2() {
   console.log (test2.caller) // function test1
}

test1()
```


## 看看题, 巩固一下

1. call/apply
``` js
funtion foo () {
   bar.apply(null, arguments)
}

function bar() {
   console.log (arguments) // [1, 2]
}

foo(1, 2)


```

2. typof 可能返回的值
string类型的：object(null) / function / string / number / boolean / undefined
``` js
console.log (typeof null) // object, 历史遗留问题
```

3. arguments
``` js
function b (x, y, a) {
   a = 10
   console.log (arguments[2]) // 10
   arguments[2] = 20
   console.log (arguments[2]) // 20
}
b(1, 2, 3)
```

4. 逗号运算
``` js
var f = (
   function f() {
      return 1
   },
   function g() {
      return 2
   }
)
console.log (typeof f) // function 

var e = (
   function f() {
      return '1'
   },
   function g() {
      return 2
   }
)()
console.log (typeof e) // number
```

5. undefined/ null
``` js
console.log (undefined > 0) // false
console.log (undefined < 0)// false
console.log (undefined === 0) // false

console.log (null > 0) // false
console.log (null < 0)// false
console.log (null === 0) // false


console.log (undefined == null) // true
console.log (undefined === null) // false
console.log (isNaN('100')) // false
console.log (paseInt('1s') === 1) // true

```

6. 重写isNaN
``` js
function isNaN (num) {
   var res = Number(num) + ''
   if(res === 'NaN') return true
   return false
}

```

7. obj
``` js
console.log ({} == {}) // false
// 为什么不等，引用值对比的是地址，两个值存储在不同的空间，地址也不同
// 怎样相等
var a = {}
var b = a
console.log (b == a) // true

```

8. this/new
``` js
var a = '1'
function test() {
   var a = '2'
   this.a = '3'
   console.log (a)
}

test()
new test()
console.log (a)

// '2', '2', '3'


var b = 5
function foo() {
   b = 0
   console.log (b)
   console.log (this.b)
   var b 
   console.log (b)
}

test() // 0 5 0
new test() // 0 undefined 0
```

9. js模块化开发

``` js
window.onLoad = function () {
   init()
}

function init () {
   fecci(10)
   div(100)
}

var fecci = (function(){
   return function (n) {
      if (n <= 0 )return 0
      if (n <= 2) return 1
      return arguments.callee(n - 1) + arguments.callee(n - 2)
   }
})()

var div = (function() {
   function div(n) {
      var arr = []
      for (var i = 0 ; i <= n; i++) {
         if (i % 3 === 0 && i % 5 === 0) arr.push(i)
      }
      return arr
   }

   return div
}())

```

10. 类型转换，字符串比较使用ascci码,其中有一个是数字才会隐式类型转换
``` js
var str = 89 > 9 ? '89' > '9' ? 'd' : 's' :'f'
```

11. 定义值
``` js
function test() {
   console.log (a) // undefined
   var a = 2
   console.log (a) // 2
   console.log (b) // ReferenceError
}
test()

```
12. AO
``` js
function test() {
   var a
   a()
   function a() {
      console.log (1) // 1
   }
}
test()

```

13. This
``` js
var name 't'
var obj = {
   name: 'test',
   say: function () {
      console.log (this.name)
   }
}

var func = obj.say
func() //  t
obj.say() // test

var obj1 = {
   name: 'test1',
   say: function (fn) {
      fn()
      //相当于func
   }
}

obj1.say(obj.say) // t
obj1.say = obj.say
obj1.say() // test1

```

14. This
``` js
function test() {
   var obj = {
      name: 'test',
      say: function () {
         console.log (this.name)
      }
   }

   var test1 = {
      name: 'test1'
   }
   var test2 = {
      name: 'test2'
   }
   var test3 = {
      name: 'test3'
   }

   test3.say = obj.say

   obj.say.call(test1) // test1
   obj.say.apply(test2) // test2
   obj.say() // test
   test3.say() // test3
}

```

15. 闭包
``` js
var bar = {
   a: 1
}

function test() {
   bar.a = 'a'
   Object.prototype.b = 'b'
   return function () {
      console.log (bar.a) // 'a'
      console.log (bar.b) // 'b'
   }
}

test()()
```

16. 预编译/构造函数/原型/this/对象/运算符优先级/变量提升
``` js
function Foo() {
   getName = function () {
      console.log (1)
   }
   return this;
}

Foo.getName = function () {
   console.log (2)
}

Foo.prototype.getName = function () {
   console.log (3)
}

var getName = function () {
   console.log (4)
}

function getName () {
   console.log (5)
}

/**
 * GO = {                                             执行时
 *   getName: undefined -> function(){console.log(5)} -> function(){console.log(4)}
 *            Foo()后
 *            -> function(){console.log(1)}
 *   Foo: function 
 * }
 * 
*/
// 函数也是特殊的对象
Foo.getName(); // 2
// 预编译执行时getName重新赋值为function(){console.log (4)}
getName(); //4
// 括号运算符优先级大于点
// Foo执行，再this.getName()， 此时的this指向window,getName重新赋值为function(){console.log(1)}
Foo().getName(); //1
// getName为function(){console.log(1)}
getName(); // 1
// 点运算的优先级大于new,先执行Foo.getName输出2，new 2没有任何意义
new Foo.getName() // 2
// 括号运算符优先级大于点，先执行new Foo(),实例化后自己上没有getName就到原型中找
new Foo().getName()// 3
// new 3没有意义
new new Foo().getName() // 3
```

17. 判断是否是瑞年
1. 能被4整除并且不能被100整除
2. 能被400整除
``` js
function isLeapYear(year) {
   return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
```

## 三目运算符，默认会返回
``` js
var a = 1
//                return '>0'   return '<=0'
var str = a > 0 ? '> 0' : '<=0' 

```

## ::o::o::o:对象克隆

也叫拷贝一个对象

普通拷贝：用赋值的方式拷贝，改变其中一个对象的属性，另一个对象也会改变
``` js
var obj = {
   name: 'foo'
}

var newObj = obj

newObj.age = 18
console.log (obj, newObj) // {name: 'foo', age: 18}
```

#### 浅克隆(只处理了最外层的属性)

``` js
const obj = {
   name: 'foo',
   age: 18
}

function clone (origin, target) {
   var tar = target || {}
   for(var key in origin) {
      if(origin.hasOwnProperty(key)) {
         tar[key] = origin[key]
      }
   }
   return tar
}
const newObj = clone(obj)
```

#### 深拷贝

``` js
function deepClone (origin, target) {
   var tar = target || {};
   for (var key in origin) {
      if (origin.hasOwnProperty(key)) {
         const value = origin[key]
         if (typeof value === 'object' && value !== null) {
            const childTar = Object.prototype.toString.call(value) === '[object Array]' ? [] : {}
            tar[key] = deepClone(value, chidTar)
         } else {
            tar[key] = origin[key]
         }
      }
   }
   return tar
}

```

``` js
var obj = {
   name: 'test'
}
var str = JSON.strgify(obj)
var newObj = JSON.parse(str)
```

## 数组

**特性**
1. 每项可以为空
2. 空项打印出来是undefined
3. 数组最后一项是加逗号没有意义，其他项加逗号，表示空项， 空项也占数组的长度


#### 定义数组的方式

1. `var arr = [1,3]`
2. `var arr = new Array(1,3)`
1个参数：`new Array(1) //设置数组的长度`
3. `var arr = Array()`

本质都是由Array构造出来的，原型都是Array.prototype

**数组本质是对象的特殊形式，可以使用对象来模拟**
``` js
var arr = [1, 2, 3]
var obj = {
   0: 1,
   1: 2,
   2: 3
}
arr[0] // 1
obj[0] // 1
```

**稀松数组：**

``` js
var arr = [, 2, 2, 4,] // [empty, 2, 2, 4]
// 打印第0项也是undefined
console.log(arr[0]) // undefined

```

**获取不存在的索引为undefined**
``` js
const a = [1, 2]
console.log (a[2]) // undefined
```

**数组方法：继承Array.prototype**

*** 修改原数组 ***
1. push/unshift ,返回值是执行了方法以后数组长度, 可以增加多个值
push(数组最后一位添加)/unshift(数组首位之前添加)

``` js
Array.prototype.myPush = function () {
   for(var i = 0 ;i < arguments.length; i++) {
      this[this.length] = arguments[i]
   }
   return this.length
}


Array.prototype.myUnshift = function () {
   var pos = 0
   for(var i = 0; i < arguments.length; i++) {
      this.splice(pos, 0, arguments[i])
      pos++
   }
   return this.length
}

Array.prototype.myUnshift2 = function() {
   var args = Array.prototype.slice.call(arguments)
   var newArr = args.concat(this)
   return newArr
}
let arr = ['d', 'e']
arr.myUnshift('a', 'b', 'c') // ['a', 'b', 'c', 'd', 'e']
```
2. shift/pop ,返回值是当前剪切的值
pop(删除数组最后一位)/shift(删除数组首位)
``` js
const arr = [2, 4, 5]
console.log (arr.pop) // 5
```
3. reverse: 倒叙
``` js
const arr = [1, 3]
const newArr = arr.reverse() // [3, 1]
```

4. splice(开始项的下标，剪切的长度，剪切以后最后一位开始添加数据)
``` js
var arr = [1, 3]
arr.splice(1, 1, 2,3) // [1, 2, 3]


// 在当前项之前添加
arr.splice(1, 0, 2) // [1,2,3]
arr.splice(-1, 0 2) // [1, 2, 3]
```

5. sort, 返回排序后的结果， 默认按照ascii码对应的十进制来排序的

``` js
var arr = [-1, 2, 1, 7]
arr.sort() // [-1, 1, 2, 7]

var arr = [23, 48, 9, 5]
arr.sort() // [23, 48, 5, 9]
```

**解决问题：自定义排序**
1. 参数：a,b
2. 返回值： 负值 a排前面
           正值 b排前面
           0   不动

``` js
var arr = [1, 23, 2]
// 正序
arr.sort(function (a,b) {
   if (a > b) return 1
   return -1
})

arr.sort(function (a, b) {
   return a - b
})

// 降序
arr.sort(function (a, b) {
   if (a < b) return 1
   return -1
})
arr.sort(function (a, b) {
   return b - a
})
```

**随机排序**
``` js
var arr = [1, 3, 3,455, 2]
arr.sort(function (a, b) {
   return Math.random() - 0.5
})

```

**对象数组排序**
``` js
var arr = [
   {
      age: 2
   },
   {
      age: 18,
   },
   {
      age: 5
   }
]

arr.sort(function (a, b) {
   if (a.age > b.age) return 1
   return -1
})

```

**不修改原数组**

1. concat: 数组拼接
``` js
var arr = [1, 3, 4]
var arr1 = [2]
arr.concat(arr1) // [1, 2, 3, 4]
```

2. toString: 将数组转为字符串并用逗号隔开
``` js
var arr = [1, 3, 3]
arr.toString() // '1,3,3'

```

3. slice
0个参数：相当于赋值数组
1个参数：从下标开始截取[index]
2个参数：第一个参数开始截取的下标并包含，第二个参数截取到的下标位置之前（不包含当前）[index, last)
        从第一个下标开始到第二个下标之前
``` js
var arr = [1, 3, 4, 5, 6]
arr.slice() // [1, 3, 4, 5, 6]
arr.slice(1) //[3, 4, 5, 6]
arr.slice(1, 4) // [3, 4, 5]

arr.slice(-3, 4) //[4, 5]
arr.slice(-3, -1)// [4, 5]
```

4. join / split

join: 将数组变为字符串
split: 将字符串转为数组,第二个参数为截取的长度,从0开始

``` js
var arr = [1, 3, 4]
arr.join('/') // '1/3/4'

arr.split('/') // [1, 3, 4]

arr.split('/', 2) // [1, 3]
```

## 类数组

类似于数组的对象，原型是Object.prototype

将类数组转为数组`Array.prototype.slice.call(arguments)`

arguments / 一组dom元素
``` js
var obj = {
   '0': 1, 
   '1': 2.
   'length': 2,
   __proto__: Object
}

```

``` js
var obj = {
   '2': 3,
   "3": 4,
   'length': 2,
   'splice': Array.prototype.splice,
   'push': Array.prototype.push
}

obj.push(1)
obj.push(2)
console.log (obj) // { '2': 1, '3': 2, 'length': 4 }

// push的原理
Array.prototype.push = function (elem) {
   this[this.length] = elem
   this.length ++
}
```

**看看题，巩固一下**

1. 数组按照元素的字节数排序
``` js
var arr = ['HELLO', '世界', 'Word!', '你好']
function getBytes(str) {
   var bytes = str.length;
   for(var i = 0 ; i < str.length; i++) {
      if (str.charcodeAt(i) > 255) bytes++
   }
   return bytes
}
arr.sort(function (a, b) {
   return getBytes(a) - getBytes(b)
})
```

2. 封装typeof 返回所有的类型
number / boolean / string / undefined / null / function / object('object Object') / object number('object Number') / object string('object String') / object boolean('object Boolean') / array('object Array')

``` js
function myTypeof(val) {
   if (val === null) return 'null'
   var type = typeof val,
       toString = Object.prototype.toString,
       res = {
         '[object Array]' : 'array',
         '[object Object]' : 'object',
         '[object Number]' : 'object number',
         '[object String]' : 'object string',
         '[object Boolean]' : 'object boolean'
       }
   if (type === 'object') {
      var ret = toString.call(val)
      return res[ret]
   }

   return type
}
myTypeof(null) // null
myTypeof(new Number(1)) // object number
```

3. 数组去重
``` js
Array.prototype.unique = function () {
   var obj = {}
   var newArr = []
   for(var i = 0; i < this.length; i++) {
      var item = this[i]
      // if (!obj[item]) {
      //    obj[item] = 'value'
      //    newArr.push(item)
      // }
      // 处理0不能排除的问题
      if (!obj.hasOwnProperty(item)) {
         obj[item] = item
         newArr.push(item)
      }
   }
   return newArr
}

```

4. 找出字符串中只出现1次的第一个字符
``` js
var str = 'abcabecacbafbcacgaaaccbb'
Array.prototype.uniqueOnce = function () {
   var temp = {}
   for (var i = 0; i < this.length; i++) {
      var item = this[i]
      if (temp.hasOwnProperty(item)) {
         temp[item]++
      } else {
         temp[item] = 1
      }
   }

   for(var key in temp) {
      if (temp[key] === 1) return key
   }
}
str.uniqueOnce() // e
```

5. typeof arguments -> object
```js
function test() {
   console.log (typeof arguments) // object
}
test()
```

6. 自变量定义函数会忽略函数名
```js
var test = function a () {
   console.log (test.name) // a
   a()
}
test()
console.log (typeof a) // undefined
```

7. 优化switch
``` js
function test(type) {
   switch(type) {
      case 1:
         console.log ('M')
         break;
      case 2:
         console.log ('T')
         break;
      default:
         console.log ('Know')
         break;
   }
}
test()

//使用数组优化
function test(type) {
   var arr = ['M', 'T', 'K']
   if (arr[type - 1] !== undefined) return console.log (arr[type - 1])
   return console.log ('Know')
}

// 不想使用type - 1怎们办，利用数组的特性，前面加空项，
function test(type) {
   var arr = [, 'M', 'T', 'K']
   if (arr[type] !== undefined) return console.log (arr[type - 1])
   return console.log ('Know')
}
```

## JS中的错误类型

**语法错误: SyntaxError**
1. 变量名不规范
``` js
var 1 = 1
var 1ab = 1
function 1test() {}
```

2. 关键字赋值
``` js
new = 5
function = 1
```

3. 基本的语法错误
``` js
var a = 5:
```


**引用错误: ReferenceError**
1. 变量或函数未声明
``` js
test()
console.log (a) // Reference Error a is not defined
```

2. 给无法被赋值的对象赋值
``` js
var a = 1 = 2;

var b = 1
console.log (b) = 1
```

**范围错误: RangeError**
1. 数组长度赋值为负数
``` js
var arr = [1, 3, 5]
arr.length = -1 // Invalid array length
```

2. 对象方法参数超出可行范围
``` js
var num = new Number(66.66)
console.log (num.toFixed(-1))
```

**类型错误：TypeError**
1. 调用不存在的方法
``` js
123()

var obj ={}
obj.say()

var a = new 'string'

```

**URIERROR: URI错误**
``` js
decodeURI('3344$%')
```

**EvalError: eval函数执行错误**
``` js
console.log (eval('obj'))
```

#### 手动抛出错误的方法

try catch finally throw
``` js
try {
   console.log (a)
} catch(e) {
   console.log(e.name, e.message)
} finally {
   console.log ('正常执行')
}
```

## 严格模式

`use strict`
出现的原因，为了规范以后的语法

建议在单独的模块使用
``` js

(function () {
'use strict'

// with语法不能使用
// caller callee不能使用
// var a = b = 1不行
// 变量必须声明 a = 2
// 函数中的this指向undefined
// 函数的参数不能重复
// 对象的属性不能重复,但不报错
// eval有自己的作用域
eval('var b = 2; console.log(2)')
console.log (a) // a is not defined
function test(b, b) {
   var obj = {
      a: 1,
      a: 2,
   }
   console.log (obj.a) // 2
   console.log (b) // error
   console.log(this) // undefined
   var a = 2
   console.log (arguments.callee)
   with(test) {
      console.log (a) // 2
   }
}

test()
})()
```

## 垃圾回收机制

原理：
1. 找出不再使用的变量（只讨论函数内的变量，函数内部的变量如果不再使用了，只有等页面关闭才会自动回收， 全局变量浏览器关闭后自动回收）
2. 释放其占用内存（不单是删除某个值，而是在内存中处理）
3. 固定的时间间隔运行

**闭包产生的作用域链不释放，需要手动清除引用**
``` js
function foo() {
   var a = 'foo'
   return function() {
      a++
      console.log (a)
   }
}
var bar = foo()
bar() // 2
bar() // 3

// 清除
bar = null;
```

**处理机制：**

1. 标记清除
垃圾回收时，先清除全局和闭包产生的变量，如果还有其他变量就会删除离开状态的全部变量
``` js
function foo() {
   var bar = 'bar' // 标记bar进入
}

foo() // bar离开 

```

2. 引用计数

对引用值进行计数，为0就清除
``` js
function foo() {
   var a = new Object() // a:1
   var b = new Object() // b:1
   var c = a // a++
   var c = b // a--
   // 循环引用会导致a, b一直加
   a.prop = b // b++
   b.prop = a // a++

   // 解决方式，清除引用
   a = null
   b = null
}

```