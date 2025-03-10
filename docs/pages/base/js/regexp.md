# 正则

## 一、正则基础

### 1. 转义

转义：改变意义
转义符号：\
转义字符：\字符（\n、\"）

**意义：**
让字符失去原来的意义

**转义字符是给编辑系统使用的，html页面中不能使用**
\n(换行) 
\r(回车) 
\t(Tab键默认4个空格)
\v(垂直换行)
\f(换页)

系统换行
1. win: \n\r
2. mac: \r
3. linux: \n

案例：
``` js
// 转义单引号
const str = 'I am\'student\'fontend'

// js默认不允许字符串换行, 使用转义，将制表符\n\r转义为空格
const str1 = '<h1>testtet</h1>\
              <h2>test2222</h2>'

// 下面是未转义的字符
const str1 = '<h1>testtet</h1>
              <h2>test2222</h2>'

```

### 2. 正则

意义：设定特定的规则检索或匹配字符串
英文：RegExp: regular expression

**小程序中使用正则替换：**
小程序中不能识别`<br />`, 需要使用正则替换为`\n`

**特点:**
不回头
贪婪模式


1. 实例化
new RegExp('test', 'ig')
'test': 字符串片段，大小写默认敏感，连续性
'igm': 修饰符也是正则属性
i: 忽略大小写 (ignore case)
g: 全局匹配
m: 多行匹配

**字符串包含**
``` js
const reg = new RegExp('test')
const isIncludes = reg.test('This is test') // true 
```

2. 对象字面量的方式
/test/gim

**推荐使用字面量方式，当正则字符串片段是变量时只能使用实例化方式**
``` js
const a = 'test'
const reg = new RegExp(a, 'igm')
```

3. 表达式[]: 不是代表区间，是匹配字符串中的一位

[aw][xy][z]: 意思是取3位，每一个中括号之间是可选的字符（取aw中的一个，xy中的一个）

[0-9][A-Z][a-z]：括号中间代表区间

``` js
const reg = /[wx][xy][z]/g
const str = 'wxyz'
const result = str.match(reg) // 'xyz'
```

**连续匹配：匹配后就不会倒过来匹配**
``` js
const str = '9801iiiii980'
const reg = /[\d][\d][\d]/g
const result = str.match(reg) // ['980', '980']
```

4. ^符号

中括号[^]内的^代表非
`const reg = /[^0][\d]/`

5. | 或
`const reg = /123|345/`

6. 元字符

\w === [0-9A-z]_
\W === [^\w]
\d === [0-9]
\D === [^\d]
\s === [\r\n\t\v\f]
\S === [^\s]
\b 单词边界
\B 非单词边界

7. (.)匹配除了回车和换行的所有字符

8，使用元字符后不需要中括号
`const reg = /\w\W/`

9. 量词
**n+ {1, 正无穷}**
**n* {0, 正无穷}**

``` js
const reg1 = /\w*/g
const str = 'abcd'
const r1 = str.match(reg1) //['abcd', '']

const reg2 = /\w*/
const str1 = '12345'
const r2 = str1.match(reg2) // ['', '','','','']
```
**n? {0, 1} 0个或1个**

```js
const reg = /\w?/
const str = 'abcd'
const r = str.match(reg) // ['a', 'b', 'c', 'd', '']
```
**n{x,y}代表匹配x或y个，注意中间不要不要空格{x, y}，正则中空格就代表真的空格**

n{0, 1} === n?
n{1,} === n+
n{0,} === n*

``` js
const reg = /\w{1, 2}/g
const str = 'abc'
const r = str.match(reg) //null 中间有空格

const str1 = 'abcde'
const r1 = str1.match(reg) // ['ab', 'cd', 'e']
```

**n^匹配任何以n开头的字符串**
**n$匹配任何以n结尾的字符串**
``` js
// 匹配以abcd开头，abcd结尾的字符串
const reg = /^abcd$/g
const str = 'abcd1bsabcd'
const r = str.match(reg) // null 原因开头的abcd和结尾的不同

// 正确的做法
const reg1 = /^abcd.*abcd$/g
const r1 = str.match(reg1) // ['abcd1bsabcd']

//匹配138开头的11位手机号
const reg2 = /^138\d{8}/g
const str2 = '13888888888'
const r2 = str2.match(reg2) // ['13888888888']

```

**匹配任何仅跟着n的字符串?=n**
**匹配任何不跟着n的字符串?!n**
注意要用括号(?=n)
``` js
const reg = /a(?=b)/g
const str = 'abcdab'
const r = str.match(reg) // ['a', 'a']

const reg1 = /a(?!b)/g
const str1 = 'acabad'
const r = str1.match(reg1) // ['a', 'a']
```

**(\w)子表达式（具有记忆功能，会记住匹配到的字符串）**
**(\w)\1反向引用，引用子表达式匹配的字符串**
注意：这里的\1\2\3\4表示反向引用第几个子表达式
``` js
// 匹配xxxx这种形式
const str = 'aaaabbbbccccddddeefffg'
const reg = /(\w)\1\1\1/g
const r = str.match(reg) // ['aaaa', 'bbbb', 'cccc', 'dddd']

// 匹配xxyy
const str1 = 'aabbccddeeffgg'
const reg1 = /(\w)\1(\w)\2/
const r1 = str1.match(reg1) // ['aabb', 'ccdd', 'eeff']
```

10. 正则属性和方法

属性: global/muilt/ignoreCase/ lastIndex

方法: test/match/exec

**注意：**
lastIndex 和 exec执行后的index相对应，修改lastIndex时，如果不是匹配的整数倍，exec中的index会找离index最近的整数倍值，重新执行后复原，当正则中有子表达式反向引用时，exec中会出现每次匹配到的子表达式

```js
const reg = /123/g
const str =  '123441232'
const r1  = reg.test(str) //true
const r2 = str.match(reg) // ['123', '123']
const r3 = reg.exec(str)  // ['123', index: 0, input: '123441232', goups: undefined ]
reg.lastIndex = 4
const r4 = reg.exec(str) // ['123', index: 5, input: '123441232', goups:undefined ]
const r5 = reg.exec(str) // ['123', index: 9, input: '123441232', goups:undefined ]
reg.lastIndex   // 9 

const reg1 = /(\w)\1(\w)\2/g
const str1 = 'aabbddcceeffgg'
const r6 = reg1.exec(str1) // ['aabb', 'a', 'b', index: 0, input: 'aabbddcceeffgg', goups:undefined ]
```

## 正则提升

1. 正向预查

匹配字符串后紧跟或不跟某个字符串1(?=2), 1(?!2)

2. 贪婪模式，能匹配多就不会匹配少(*?)
``` js
const str = '{{abc}}efd{{edg}}'
// 默认贪婪模式
const reg = /{{.*}}/g
const result = str.match(reg) /**["{{abc}}efd{{edg}}"]*/ 
// 非贪婪模式
const reg1 = /{{.*?}}/g
const result1 = str.match(reg1) /**['{{abc}}', {{edg}}]*/
```

``` js 
// 贪婪模式
const reg = /\w?/g
const str = 'aaaaa'
const result = str.match(reg) //['a', 'a', 'a', 'a', 'a', '']

```

3. replace: 默认不会全局匹配

``` js
const str = 'abcdbb'
const reg = /b/
const str1 = str.replace(reg, 'D') // aDcdbb
const reg1 = /b/g
const str2 = str.replace(reg, 'D') // aDcdDD
```
**反向引用: aabb替换成bbaa**

``` js
const str = 'aabbccdd'
const reg = /(\w)\1(\w)\2/g
const str1 = str.replace(reg, '$2$2$1$1') // bbaaddcc
// 函数的方式
const str2 = str.replace(reg, function ($, $1, $2) {
  console.log ($, $1, $2) // $:当前匹配到的字符串 $1:第一个子表达式 $2:第二个子表达式
  return $2 + $2 + $1 + $1
}) // bbaaddcc
```

**反向引用：ab_cd替换成abCd**
``` js
const str = 'ab_cd'
const reg = /_(\w)/g
const str1 = str.replace(reg, function ($, $1) {
  return $1.toUpperCase()
}) // abCd
```
**反向引用：xxyyzz替换成XxYyZz**
``` js
const str = 'xxyyzz'
const reg = /(\w)\1(\w)\2(\w)\3/g
const str1 = str.replace(reg, function ($, $1, $2, $3) {
  return $1.toUpperCase() + $1 + $2.toUpperCase() + $2 + $3.toUpperCase() + $3
}) // XxYyZz
```

**反向引用：xxyyzz替换成x$y$z$不能使用函数**
要使用$时用两个$$('$1$$$2$$$3$$'),其他只用一个，例如*('$1*$2*$3*')

``` js
const str = 'xxyyzz'
const reg = /(\w)\1(\w)\2(\w)\3/g
const str1 = str.replace(reg, '$1$$$2$$$3$$') // x$y$z$
```

**将aaaabbbbbcc替换成abc**
``` js
const str = 'aaaabbbbcc'
const reg = /(\w)\1*/g
const str1 = str.replace(reg, '$1') // abc
```

**注意：将100000000替换成100,000,000**
从后往前匹配，空后面紧跟3个数字结尾的非单词边界，
匹配到的是空格，将空格替换成逗号

``` js
const str = '100000000'
const reg = /(?=(\B)(\d{3})+$)/g
const str1 = str.replace(reg, ',') // 100,000,000
```

**模板替换**
``` js
const str = 'I like play {{ ball }}'
const reg = /{{(.*?)}}/g
const st1 = str.replace(reg, function (node, key) {
  return {
    ball: 'basketball'
  }[key]
}) // I like play basketball
```

4. 不捕获分组?: （不使用match时可以忽略）
字符串match时，使用的正则中函数子表达式时，默认会捕获分组，可以使用?:剔除分组，叫不捕获分组
``` js
// 捕获分组
const str = 'aabbccdd'
// 注意不是全局匹配
const reg = /(a)(b)(c)/
const str1 = str.match(reg) // ['abc', 'a','b','c']

// 不捕获分组
const reg1 = /(?:a)(b)(c)/
const str2 = str.match(reg1) // ['abc', 'b','c']
```

## 正则案例

1. 验证身份证

``` js
// 521322199508226715
const str = '521322199508226715'
const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[1-9Xx]$/
const r = reg.test(str) // true
```

2. 验证用户名至少6位包含1个大写1个小写1个数字1个特殊字符
只要是包含使用正向预查
``` js
const str = '23Za$1'
const reg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%&*^?]).*$/
const r = reg.test(str) // true
```

3. 验证多位用户
``` js
const str = 'test111'
const reg = /[A-z0-9_-]{6,10}/
const r = reg.test(str) //true
```

4. 验证email
``` js
const str = '451660550@qq.com'
const reg = /^[A-z0-9_-]+\@([A-z0-9_\-\.]+\.([A-z]{2,4}))$/
const r = reg.test(str) // true
```

5. 手机号
``` js
/**
 * (+86)
 * 13 ( 0 | 1 | 2 | 3 | 4 | 5 | 6| 7 | 8 | 9)
 * 14 (0 | 1 | 4| 5| 6| 7| 8| 9)
 * 15 (0 | 1 | 2 | 3 | 5 | 6 | 7 | 8 | 9)
 * 16 (2|5| 6 | 7)
 * 17 (0 | 1 | 2| 3| 4| 5| 6| 7| 8 )
 * 18 (0 | 1 | 2| 3| 4| 5| 6| 7| 8| 9)
 * 19 (0 | 1 | 2 | 3 | 5 | 6 | 7 | 8 | 9)
*/
const str = '17888888888'
const reg = /^(\(\+86\))?(13[0-9]|14[01456789]|15[012356789]|16[2567]|17[012345678]|18[0-9]|19[012356789])\d{8}$/
const r = reg.test(str) // true
```

6. 日期
``` js
const str = '2023-10-06'
const reg = /^(19|20)\d{2}([./-])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|[3][01])$/
const r = reg.test(str) // true
```
