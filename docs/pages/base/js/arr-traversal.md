# Reduce原理及实现

## Reduce / ReduceRight

归纳函数

很多同学项目中很少使用reduce函数，原因是没有彻底弄清它的底层原理；看过很多介绍reduce的文章后依然很困惑回调函数中的prev/cur(上一个/下一个)？

换个思路理解，其实很简单。

**传入一个初始值，遍历数组时可以对prev进行操作后返回prev再下一次遍历时继续处理prev, 最终返回一个期望的新值，本质还是遍历数组**

1. 先抛开prev来看下回调函数，其他参数和filter/map等是相同的

``` ts
const foo = ['foo', 'bar']
const bar = foo.reduce((prev, elem, i, arr) => {
  // elem : 当前项
  // i    : 当前索引
  // arr  : 源数组
})
```

2. 单独看prev, 传递初始值

``` ts
const foo = ['foo', 'bar']
const bar = foo.reduce((prev, elem, i, arr) => {
  // 首次时 prev === init
  // elem : 当前项
  // i    : 当前索引
  // arr  : 源数组

  
  console.log (prev) 
  // 未返回prev       // [] undefined undefined
  // 返回prev        // [] [] []

  // 说明reduce函数需要返回prev才能连接最后的值

  return prev
}, [])
```

3. 操作prev，并返回期望的值

``` ts
const foo = ['foo', 'bar']
const bar = foo.reduce((prev, elem, i, arr) => {
  if (elem === 'foo') prev.push(elem)
  return prev
}, [])

// bar ['foo']
```

reduceRight就是从后往前遍历

**Reduce实现：**

``` js
Array.prototype.myReduce = function (fn, init, context) {
  const len = this.length,
        _this = context || window;

  let last = arguments[1]
  for (let i = 0; i < len; i++) {
    last = fn.apply(_this, [last, this[i], i, this])
  }
  return last;
}
```

**ReduceRight实现：**

``` js
Array.prototype.myReduceRight = function (fn, init, context) {
  const len = this.length,
        _this = context || window;

  let last = arguments[1]
  for (let i = len - 1; i >= 0; i--) {
    last = fn.apply(_this, [last, this[i], i, this])
  }
  return last;
}
```

## :rightwards_hand: 拓展：

### 使用reduce模拟filter/map

``` ts
const arr = [4, 7, 9]
const newArr = arr.reduce((prev, elem) => {
  if (elem !== 4) prev.push(elem)
  return prev
}, [])

console.log (newArr) // [7, 9]


const newArr1 = arr.reduce((prev, elem) => {
  prev.push(elem)
  return prev
}, [])

console.log (newArr1) // [4, 7, 9]
```

::: tip
只要是需要操作数组并期望返回一个新值，都可以考虑使用reduce
:::

