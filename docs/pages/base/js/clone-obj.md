# 对象克隆

:::tip
为什么要克隆一个对象？？？
:::

**:smiley: 项目开发中通常有这样的场景，定义了一个foo对象，在其他地方也想要一个与foo相同的对象，这时该怎么做呢！**

``` ts

const foo = {
  name: 'foo'
}

```

**小明同学：这不简单吗？定义一个变量bar把foo赋值给bar**

``` ts
const bar = foo
```

于是他就这样草草结束了.........


**突然有一天，产品经理说，我想修改bar的name为bar,并添加age为18，小明同学一想，这还不简单吗？**

``` ts
bar.name = 'bar'
bar.age = 18 
```
收工 :tada: 

**产品经理一看，确实改了，再看了一下foo对象，跑到小明工位轻声的对他说”我的foo呢！“**

小明同学缓缓打开了vscode

``` ts
console.log (foo) // { name: 'bar', age: 18 }
console.log (bar) // { name: 'bar', age: 18 } 
```
为什么呢！！！

他想了想，对象赋值操作就是把新的变量指向了同一个地址，改变其中一个，都会改变，所以foo和bar都改变了。

那怎么办呢 ！！！

过了5分钟.........

**想到了一个方法，遍历foo对象为bar添加每一个属性和值**

``` ts
const bar = {}
for (let key in foo) {
  bar[key] = foo[key]
}

console.log (bar) // { name: 'foo' }

// 修改bar
bar.name = 'bar'
bar.age = 18

console.log (foo) // { name: 'foo' }
console.log (bar) // { name: 'bar', age: 18 }

```

准备收工，正想关闭电脑

**脑海中闪过前几天刚复习过的prototype，结合for in ，坏了！foo上的原型方法和属性也会被遍历出来**

``` ts
foo.prototype.hobby = 'coding'
console.log (bar) // { name: 'bar', age: 18, hobby: 'coding' }

```

**于是他遍历时剔除了原型上的属性和方法**

``` ts
for (let key in foo) {
  if (foo.hasOwnProperty(key)) {
    bar[key] = foo[key]
  }
}
console.log (bar) // { name: 'bar', age: 18 }
```
小明同学有代码洁癖，于是将它封装成了一个通用函数，命名为浅克隆

## 浅克隆/浅拷贝

``` ts
function shallowCloning (origin: Recordable, target?: Recordable) {
  const tar = target || {}
  for (let key in origin) {
    // 剔除原型上的方法和属性
    if (origin.hasOwnProperty(key)) {
      tar[key] = origin[key]
    }
  }
  return tar
}
```

:v: 完美 ！！！

过了一会儿，它头脑风暴了一下，提出了一个问题，如果我对象里的属性值也为引用值，还能完美克隆吗？于是开始测试了一波...

``` ts
const foo = {
  name: 'foo',
  child: {
    name: 'fooChild',
    age: 10,
    child: {
      name: 'fooSon'
    }
  },
  cars: ['Model3', 'Su7']
}

const bar = shallowCloning (foo)

bar.child.name = 'fooSon'

console.log (foo) // { name: 'foo', child: { name: 'fooSon' } }
```

不出所料，克隆失败。于是三下五除二写了一个深克隆。

## 深克隆/深拷贝

``` ts
function isObject<T>(obj: T): boolean {
  return typeof obj === 'object' && obj !== null;
}

function isArray<T extends object> (obj: T) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

function deepCloning (origin: Recordable, target?: Recordable) {
  const tar = target || {};

  for (let key in origin) {
    if (origin.hasOwnProperty(key)) {
      const value = origin[key]
      // 是否为对象
      if (isObject(value)) {
        tar[key] = isArray(value) ? [] : {}
        deepCloning(value, tar[key])
      } else {
        tar[key] = value
      }
    }
  }

  return tar
}
```

测试一波~~~

``` ts
const bar = deepCloning (foo)

bar.child.name = 'barChild'

console.log (foo) // { name: 'foo', child: { name: 'fooChild' } }
```

:tada: 大功告成！！！小明同学终于可以安心的玩耍了。

## :rightwards_hand: 拓展：

### Js中哪些方法是浅拷贝

1. `Object.assign(target, origin)`

2. 拓展运算符 ...

``` ts
const foo = { name: 'foo' }
const bar = Object.assign({}, foo)
const baz = {...foo}

bar.name = 'bar'
baz.name = 'baz'
console.log (foo.name) // foo
console.log (bar.name) // bar
console.log (baz.name) // baz
```

3. `Array.concat()`
4. `Array.slice()`

``` ts
const foo = ['foo', 'bar']
const bar = foo.concat()
const baz = foo.slice()
bar[0] = 'bar'
baz[0] = 'baz'
console.log (bar[0]) // 'bar'
console.log (baz[0]) // 'baz'
```

### 实现深拷贝的方法

1. `JSON.parse(JSON.strgify(obj))`

2. 递归封装

3. lodash.cloneDeep






