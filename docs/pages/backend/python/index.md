# Python 从入门到精通

##  基础

### 基本类型 

整型 浮点类型 字符串 布尔 复数

``` py
foo = 1
bar = 1.2
baz = True
bag = False
fag = 1 + 2j

str = 'str'
'''
字符串换行
'''
barz = '''
test mult
'''

print(type(foo)) # int

```

### 格式化输出 

1. 占位符号 

生成一定格式的字符串

- `%s `字符串（常用）
占位符只是占位不会输出内容

``` py
p1 = 'p1'
print('我的名字：%s' % p1)
```

- `%d `整数（常用）
``` py
p2 = 18
p3 = 'p3'
print("名字：%s, 年龄：%d" % (p3, p2)) # 位置不能改变
```

- `%4d `整数
数字设置位数，不足前面补空白
``` py
p4 = 123
print("%6d" % p4) #    123

print("%06d" % p4) # 000123 不足用0补全
```

- `%f` 浮点数
默认后6为小数(没有补0)，遵循四舍五入

`%.4f `浮点数
数字设置小数位数，遵循四舍五入
``` py
p5 = 3.14
print("%f" % p5) # 3.140000

p6 = 2.3456
print("%.3f" % p6) # 2.346
```

- %%
```py
print("我是%%的1%%" % ()) # 我是%的1%
```

### 格式化 

f格式化:
格式：f"{表达式}"

``` py
name = 'f格式化'
age = 18
print(f"我的名字是{name},我今年{age}岁了")
```

### 运算符 

#### 算数运算符 

优先级: 幂 > 乘 除 余 整 > 加 减

1. `+ - * /` 若其中有浮点数，结果也会用浮点数
``` py
print(1/1) # 商一定是浮点数 1.0， 除数不能为0
print(1.0 + 2) # 3.0
```

2. // 取整除，取商的整数部分，向下取整（不管四舍五入，只要有小数就忽略）
``` py
p7 = 5
p8 = 2
print(p7 // p8) # 2
```

3.  % 取余数
``` py
print(p7 % p8) # 1
```

4.  ** 取幂 m**n: m的n次方
```py
print(p7 ** p8) # 25
```

#### 赋值运算符 （先定义后赋值 （变量）） 

1. =
```py
p9 = 9
p10 = p9
```

2.  +=
```py
p10 += 2
```

3.  -=
```py
p10 -= 1
```

#### 比较运算符

==  /   !=   /   >  /   < /    >=    /      <=

####  逻辑运算符（add与 or或 not非）

1.  add 两边都为真

```py
if p9 == 9 and p10 == 10:
    print('ok all')
```

2.  or 符合其中一个
```py
if p9 == 10 or p10 == 20:
    print('ok or')
```

3. not相反的结果
```py
print(not 4 > 9) # true
```

#### 三目运算符 

语法： 为真结果 if判断条件 else 为假结果
```py
print('ok') if 4 > 9 else print('bad')
```

#### 输入函数 

input : prompt提示，在控制台显示
```py
p11 = input('输入密码')
print(p11)
```

#### 转义字符 

1.  \t制表符，通常表示空4个字符，也称缩进
```py
print('test\t111')
```

2.  \n换行符
```py
print('test\ntest1')
```

3.  \r回车，将当前位置移到本行开头
```py
print('test\rtest2') # test2
```

4.  \\反斜杠
```py
print('test\\test') # test\test
```

5.  r原生字符串，默认不转义
```py
print(r"test \n test1")
```

### 判断语句 

1. if 缩进4个字符
```py
'''
if 条件:
    满足条件
'''
p12 = 19
if p12 < 20:
    print(p12)

# 成绩输入
score = input("请输入成绩")
if score == '100':
    print('ok')
if score == '50':
    print('bad')
```

2. if else
```py
'''
if 条件:
    满足条件
else:
    不满足条件
'''
if p12 == 19:
    print('ok')
else:
    print('bad')
```

3. if elseif else
```py
'''
if 条件:
    满足条件
elseif 条件2:
    满足条件
elseif 条件3：
    满足条件
else:
    不满足条件
'''
```

### 循环语句

#### while 

- 基础语法

```py
'''
while 条件:
    循环体
    改变变量(不然会死循环)
'''
i = 1
while i <=10:
    print(i)
    i += 1

# 死循环
'''
while True:
    print(i)
'''
```

- while应用：

```py
# 计算1+2+...100
s = 0
j = 1
while j <= 100:
    s += j
    j += 1
print(s)
```

- while 嵌套
```py
'''
while 条件:
    循环体
    while 条件:
        循环体
        改变变量(不然会死循环)
    改变变量(不然会死循环)
'''
```

#### for 

- 基础语法：
```py
'''
for 临时变量 in 可迭代对象:
    循环体
'''
key = 'key for in'
for k in key:
    print(k)
```

- range(start,end,次数) 记录循环次数

```py
range(1,6) # 从1开始，到6结束(包前不包后)[)
range(5) # 循环次数，默认从0开始
s1 = 0
for k1 in range(1, 101):
    s1 += k1
```

- break 终止循环 continue结束当前循环进入下一次循环（在循环中使用）
```py
for k2 in range(1, 10):
    if k2 == 5:
        break
    else:
        continue

while s1 < 10:
    print(s1)
    if s1 == 5:
        print('ok')
        # 在continue之前一定要修改计数器,防止死循环
        s1 += 1
        continue
    s1 += 1

# 1. 2， 4， 5
for k3 in range(1, 5):
    if k3 == 3:
        # break # i = 3时结束循环
        continue # 跳过3,结束了在3时的循环，继续执行下一次循环
    print(k3)
```

### 字符串编码 

本质就是二进制数据与语言文字的一一对应关系
ASCII: 只支持英文1个字节
GB2312: 支持汉字
Unicode: 统一编码：所有字符都是2个字节（好处：字符与数字之间转换速度更快，坏处：浪费空间（英文占一个字节））
UTF-8: 精准（对不同的字符用不同的长度表示， 优点：节省空间，坏处：字符与数字之间转换速度更慢，每次都需要计算字符要用多少字节来表示）

#### 字符串编码转换 

编码：
encode()
解码：
decode()

```py
k4 = 'hello'
k5 = k4.encode()
print(k5)
print(type(k5)) # bytes,以字节为单位进行处理 [class bytes]

k6 = k5.decode()
print(k6) # hello [class str]
```

#### 字符串常见操作 

1. + 字符串拼接
```py
print('10' + '20') # '1020'
```

2. * 重复输出 
```py
print('10\n'*5) #10 10 10 10 10 输出5次10
```

3. 查找 find / index / count 

find: 检查某个子字符串是否包含在字符串中，在返回下标否则-1
find(子字符串，start,end)
开始和结束下标可以省略，表示在整个字符串中查找
```py
print(k4.find('h')) # 0
print(k4.find('e', 3)) # -1
print(k4.find('h', 2, 4)) # -1
```

index: 检查某个子字符串是否包含在字符串中，在返回下标否则报错
index(子字符串，start,end)
开始和结束下标可以省略，表示在整个字符串中查找
```py
print(k4.index('h')) # 0
print(k4.index('e', 3)) # error
```

count: 返回某个字符串在整个字符串中出现的次数，没有返回0
count(子字符串，start,end)
开始和结束下标可以省略，表示在整个字符串中查找
```py
print(k4.count('h'))  # 1
```

4. 判断 startswith / endswith / isupper / islower 

startswith: 是否以某个字符串开头，是为True否则False,可设置开始/结束位置
startswith(子字符串，start,end)

endswith: 是否以某个字符串结尾，是为True否则False,可设置开始/结束位置
endswith(子字符串，start,end)

```py
print(k4.startswith('h'))  # True
print(k4.startswith('e', 3)) # False

print(k4.endswith('h', 3))  # False
```

isupper(): 所有字符都是大写
islower(): 小写
```py
print(k4.isupper())  # false
print(k4.islower()) # True
```

5. 修改元素 replace / split / capitalize / lower / upper 

replace(旧内容，新内容，替换次数): 替换元素(替换次数可省略)
```py
print(k4.replace('h', 'e'))  # eello
```

split(分割符，分割次数): 指定分隔符来切字符串
```py
print(k4.split(' ')) # ['hello']
```

capitalize(): 第一个字符大写，其他小写
```py
print(k4.capitalize())  # Hello
```

lower(): 大写转小写
upper(): 小写转大写
```py
print(k4.lower())  # hello
print(k4.upper()) # HELLO
```

6. 成员运算符

作用： 检查字符串中是否包含了某个子字符串
in: 包含True否则False
not in: 不包含True否则False
```py
k7 = 'test name'
print('test' in k7) # True
print('a' not in k7) # True
```

7. 下标/索引 从0开始
```py
k8 = 'test abc'
print(k8[0]) # t
```

8. 切片 

含义：对操作的对象截取其中一部分操作
语法：[start, end, step]
包前不包后
step: 默认1，表示选取间隔， 步长的绝对值大小决定间隔，正负决定方向
正数： 从左往左
负数： 从右往左

```py
k8 = 'test abc'
print(k8[0:3]) # tes
print(k8[3:]) # t abc
print(k8[:3]) # tes
print(k8[-1:]) # c
print(k8[:-1]) # test ab

# 最后的-1表示步长 
# 从-1截取到最后，步长为1 方向为反方向
print(k8[-1::-1]) # cba tset
print(k8[-1:-4:-1]) # cba
# 从0截取到5，步长为2
print(k8[0:5:2]) # ts

```

### 列表 

特点：
用[]表示，每一项用逗号隔开
每一项的数据类型可以不同
可以进行切片操作
可通过索引访问
列表是可迭代对象

```py
li = [1,3,4,5]
```

#### 列表的常见操作

1. 添加元素 append / extend / insert

append('foo')： 整体添加
extend('foo'): 将foo逐一拆分后添加, extend()中的参数必须是可迭代对象
inset(3, 'foo'): 在特定索引处添加 
```py
li = [1, 2, 3]
li.append(4)
li.insert(1, 5)
li.extend([6, 7])
li.extend('89')
```

2. 修改元素
```py
li[1] = 2
```

3. 删除元素del / remove(删除的项) / pop(默认删除最后一个，传递下标删除指定项)
```py
del li[1]
li1 = [3]
del li1

li.pop()

li.remove(3)
```

4. 查找元素 in / not in / index / count
```py
print(1 in li)
```

5. 排序 sort(从小到大排序) / reverse(倒序)
```py
li2 = [4,10,5,7]
li2.sort()
li2.reverse()
```

6. 列表推导式
语法：
1. [表达式 for 变量 in (列表 / range / 可迭代对象)] 
2. [表达式 for 变量 in 列表 if 条件]
```py
[print(k11) for k11 in li2]
[print(k12) for k12 in li2 if k12 > 5]
```

7. 列表嵌套
```py
li3 = [1,2,3,[4,5,6]]
```

### 元组 

- 基本格式：tua=(1,2,3),可以是不同的数据类型
只有一个元素时末尾用逗号
```py
tua=(1,2,3)
tua1=(1,)
```

- 应用场景

函数的参数和返回值
格式化输出后面的()就是一个元组

```py
name11 = 'name11'
age11 = 'age11'
print('%s的年龄%d', % (name11, age11))
info=(name11, age11)
print('%s的年龄%d', % info)
```

- 元组与列表对比

元组只能查询index/count/len的用法相同，不支持增删改
元组只有一个数据时需要加逗号，列表不用
元组也有下标


### 字典 

格式：字典名 = { key: value, key: value }
注意：字典中的键具有唯一性，值可以重复

```py
dic = { 'name': 'dic', 'age': 12 }
dic1 = { 'name': 'cic', 'name': 'rec' }
print(dic1) # { name: 'rec' }
```

#### 字典常见操作

##### 查找元素：

1. 变量名[键名]
   字典中没有下标，查找元素根据键名，键名相当于索引
   键名不存在报错
2. 变量名.get(键名)
   键名不存在返回None,可以设置默认值

```py
dic2 = { 'name': 'dic2' }
print(dic2['name'])
print(dic2.get('name'))
print(dic2.get('age', 'No')) # 不存在

```

##### 修改元素：

变量名[键名] = 新增
```py
dic3 = { 'name': 'dic3' }
dic3[name] = 'new dic3'
print(dic3)
```

##### 添加元素：

变量名[键名] = 新增(键名存在就修改，不存在就新增)
```py
dic3['age'] = 12
print(dic3)
```

##### 删除元素：

1. del
   删除整个字典 del 字典名
   删除字典的键 del 字典名[key] (键名不存在就报错)
2. clear: 清空整个字典里的键，但保留了这个字典
3. pop: 删除指定键值对，键不存在就报错,不指定键报错
   popitem(): 3.7之前随机删除一个，之后删除最后一个
```py
dic4 = { 'name': 'dic4' }
del dic4

dic5 = { 'name': 'dic5' }
del dic5['name']

dic5['age'] = 12
dic5.clear()

dic5['name'] = 'dic5'
dic5.pop('name')
```

##### len()求长度

```py
dic6 = { 'name': 'dic6', 'age': 12 }
print(len(dic6)) # 1
```

##### keys()返回字典的所有键名

```py
print(dic6.keys()) # dict_keys(['name', 'age'])
for d1 in dic6.keys():
    print(d1)
```

##### values()返回字典中所有键值

```py
print(dic6.values()) # dict_values(['dic6', 12])
[print(d2) for d2 in dic6.values()]
```

##### items()返回字典中所有的键值对(以元组的形式)

```py
print(dic6.items()) # dict_items([('name', 'dic6)])
[print(type(d3)) for d3 in dic6.items()] # class tuple
```

##### 字典的应用场景：

使用键值对存储一个物体的相关信息


### 集合 

- 语法：
格式：s1={1,2,3}
空集合：s1 = set()
空字典：dic = {}
```py
s11 = {1, 2, 3}
print(type(set)) # class set
```

- 集合具有无序性 不能修改集合中的值 
```py
print(s12) # 每次结果都不一样
print(s12)

s13 = {1,2,3}
print(s13) # 数字每次都一样

# 集合无序的实现方式涉及到hash表
# 每次运行结果不同，hash值不同，在hash表中的位置不同，所以顺序不同
print(hash('a'))
print(hash('b'))

# int类型的hash就是它本身，在hash表中位置不会发生改变，所以顺序不变
print(hash(1))
print(hash(2))
```

- 集合具有唯一性可以自动去重
```py
s14 = {1,2,1,2,1,3,4}
print(s14) # {1,2,3,4}
```

#### 集合的常见操作 

##### 添加元素 add / update

add(): 添加的是一个整体(集合中存在不再添加)
       一次只能添加一个元素
update(可迭代对象): 把传入的元素拆分一个个放入集合中
```py
s15 = {1,2,3}
s15.add(4)
print(s15) # {1,2,3,4}

s15.update('456')
print(s15) # {1,2,3,4,5,6}
```

##### 删除元素 remove / pop / discard

remove(): 选择删除的元素，集合中有就删除，没有报错
pop(): 对集合进行无序排序，删除左边第一个元素
discard(): 选择要删除的元素，没有不会进行任何操作
```py
s15.remove(4)
s15.pop() # {2,3,5,6}

s16 = {'a', 'b', 'c', 'd'}
s16.pop() # {'b', 'c', 'd'}

s17 = {1, 2, 3}
s17.discard(1) #{2,3}
```

##### 集合交集和并集 

交集：&（公有的部分,没有返回set()空集合）
并集：| 所有的放在一起，重复的不算(集合的唯一性)

```py
s18 = {1,2,3,4}
s19 = {3,4,5,6}
print(s18 & s19) #{3,4}

print(s18 | s19) # {1,2,3,4,5,6}
```

### 类型转换 

#### int()转换为整型

只能转换由纯数字组成的字符串
浮点型转整型会去掉小数及后面的数字
如果字符串中有数字和正负号以外的字符就报错，+/-号写在前面
```py
int1 = '23'
print(int(int1)) # 23
int2 = 1.2
print(int(int2)) # 1
int3 = 1.8
print(int(int3)) # 1
int4 = '+12345'
print(int(int4)) # 12345
```

#### float()转换为小数

整型转为浮点型，自动添加一位小数
```py
print(float(11)) # 11.0
```

#### str()转为字符串，任何类型都可以转为字符串

浮点型转为str，自动去除末尾为0
```py
str1 = 10
print(str(str1)) # '10'
```

#### eval() 执行字符串中的运算并返回结果
```py
print(eval('10+10')) # 20
```

#### list() 将可迭代对象转为列表，支持的类型str、tuple、dict、set 

1. str -> list
```py
str2 = 'abcdef'
print(list(str2)) # ['a', 'b', 'c', 'd','e','f']
```

2. tuple -> list
```py
tup111 = (1,2,3)
print(list(tup111)) #[1,2,3]
```

3. dict -> list: 取键名作为列表的值
```py
dict111 = { name: '12', key: '1' }
print(list(dict111)) # ['name', 'age']
```

4. set -> list: 会先去重再转换
```py
set111 = {1,2,3,1}
print(list(set111)) # [1,2,3]

```


### 深浅拷贝 （针对可变对象）

#### 赋值

赋值等于完全共享资源，一个值的改变会完全被另一个值共享
```py
list111 = [1,2,3]
list222 = list111
list111.append(4)
print(list111)  # [1,2,3,4]
print(list222)  # [1,2,3,4]
```

#### 浅拷贝：数据半共享，只会拷贝第一层

优点：
1. 拷贝速度快
2. 占用内存少
3. 拷贝效率高
```py
import copy
list333 = copy.copy(list111)
print(id(list333)) # 1991
list333.append(5)
print(list333) # [1,2,3,4,5]
```

#### 深拷贝 数据完全不共享
```py
list444 = [1,3, 4, [5,6]]
list555 = copy.deepcopy(list444)
print(list555) # [1,3, 4, [5,6]]
print(list444) # [1,3, 4, [5,6]]
list555.append(7) # [1,3, 4, [5,6], 7]
list555[3].append(8)
print(list555)# [1,3, 4, [5,6, 8], 7]
print(list444) # [1,3, 4, [5,6]]

```

### 可变对象 

变量对应的值可以修改，但是内存地址不会发生改变
1. list
2. dict
3. set
```py
list666 = [1,2,3]
print(id(list666)) # 12
list666.append(4)
print(id(list666)) # 12
```

### 不可变对象 

变量对应的值不可以修改，如果修改就会生成一个新的地址从而分配新的空间
1. int
2. str
3. bool
4. tuple
```py
int777 = 10
print(id(int777)) # 190
int777 = 15
print(id(int777)) # 199
```

### 函数 

功能复用性
```py
def foo():
    console.log (1)

foo()
```
每次调用都会重新执行,调用前必须先定义

```py
def say_hello():
    print("hello def")

say_hello()
```

#### return

作用：
1. 返回一个值
2. 终止函数
3. 返回多个值，以元组形式
   `return 'a',1`
   
   对应的结果：`('a',1)`
4. 默认返回None
```py
def say_goodbye():
    print("goodbye def")
    return "bye",1
say_goodbye()
```

#### 参数 

1. 形参和实参一一对应
```py
def hello(a, b):
    return a + b
    
hello(1,2)
```

2. 必备参数
传递和定义参数的顺序和个数必须一致
```py
def hello(name, age):
    print("hello", name)
    print("hello", age)     
hello('test',18)
```

3. 默认参数
为参数提供默认参数值,所有的位置参数必须出现在默认参数前
```py
def hello(age,name = 1):
    print("hello", name)
hello(1)
```

4. 可变参数
传入的数量可以改变，可以传多个也可以不传,以元组形式接收
```py
def hello(*args):
    print("hello", args)
    print(type(args)) # class tuple
hello()
```

5. 关键字参数: 扩展函数功能
以字典形式接收
```py
def hello(**kwargs):
    print("hello", kwargs)) #{'name': 'test', 'age': 23}
hello(name="test", age = 18)

def args(*args):
    print("args", args)
args('test')

def keywordsfunc(**kwargs):
    print("keywords", kwargs)
keywordsfunc(name='test', age=18)
```

#### 函数嵌套 

- 一个函数中调用另一个函数
```py
def fooFunc():
    print("fooFunc")
fooFunc()
def barFunc():
    print("barFunc")
    fooFunc()
barFunc()
```

- 嵌套定义

注意缩进：定义和调用同级
```py
def fooFunc2():
    print("fooFunc2")
    def barFunc2():
        print("barFunc2")
    barFunc2()
fooFunc2()
```

#### 函数进阶 

##### 作用域

1. 全局变量
整个文件生效
2. 局部变量
函数内生效，函数调用后就销毁

查找变量的顺序：函数内部 -> 全局
全局变量和局部变量命名相同不会被覆盖
在函数内部修改全局变量的值可以使用global关键字
  global关键字可以对全局变量进行修改，也可以在局部作用域中声明一个全局变量
  多个变量 global a, b
  
nonlocal： 用来声明外层的局部变量，只能在嵌套函数中使用，在外部函数先声明内部函数进行nonlocal声明
           只能对上一级修改
```py
func111 = 'g test'
def func3():
    func111 = 'test'
    print(func111)
func3() # 'test

def func4():
    global func111
    func111 = 'test'
    print(func111)
func4() # 'test'
print(func111) # 'test'


def func5():
    a = 10
    def func6():
        nonlocal a
        a = 20
        print(a)
    func6()
    print(a)
func5() # 20 20
```

##### 匿名函数: 只能实现简单逻辑

- 语法
函数名 = lambda 形参 ： 返回值（表达式
调用： 结果 = 函数名（实参）

- 参数形式
1. 无参
`add = lambda : 'none'`
2. 一个
`add = lambda a: a`
3. 默认参数
`add = lambda a,b=1: a+b`
4. 关键字参数
```py
add = lambda **kwargs:kwargs
add(name='test',age = 1)
```
示例：
```py
add1 = lambda x, y: x + y
print(add1(1, 2))

compare = lambda x, y: 'x < y' if x < y else 'x >= y'
```

#### 内置函数

查看所有的内置函数
```py
import builtins
print(dir(builtins))
```
大写：内置常量
小写：内置函数

内置函数：
1. abs()返回绝对值
   `print(abs(-10)) # 10`
2. sum(可迭代对象)求和, 字符串不可以相加
   `print(sum('123'))`
3. min()求最小值
   `print(min(1,2,3))`
4. max()求最大值
   `print(max(1,2,3))`
5. zip()将可迭代对象作为参数，将对象中对应的元素打包为一个个元组
6. map()映射函数
   `map(func, iter1): func:自定义函数， iter1: 要放进去的可迭代对象`
7. reduce()先把对象中的两个元素先取出来，计算出一个值然后保存，接下来把这个计算值跟第三个元素进行计算
   需要先导入包
   ```py
   from functools import reduce
   reduce(func,sequence) # func: 必须是两个参数的函数， sequence：一个序列必须是可迭代对象
   ```

示例：
```py
# 先求绝对值，再求最小值
print(min(-8, 5, key=abs))

# zip
lif1 = [1,2,3]
lif2 = [4,5,6]
lif3 = zip(lif1, lif2)
for i in zip(lif1, lif2):
    print(i) # (1,4) / (2, 5) / (3, 6)
    print(type(i)) # class tuple

print(list(zip(lif1, lif2))) # [(1,4), (2, 5), (3,6)]

# map
lif4 = [5,6,8]
def funclif4(x):
    return x * 2
mp1 = map(funclif4, lif4)
for ik in mp1:
    print(ik) # 10 12 16
print(list(mp1))  # []

lif44 = list(map(lambda x: x * 2, lif4))
print(lif44) #[10,12,16]

# reduce
from functools import reduce
def funcReduce(a, b):
    return a + b
lif5 = [2,3,4]
print(reduce(funcReduce, lif5)) # 9
```

#### 拆包：对于函数中多个返回数据，去掉元组、列表、字典直接获取里面数据的过程
```py
tuaf1 = (1,2,3,4)

# 方法一如下（要求元组内的个数与接收的变量个数相同），一般在取值时使用
a1,b1,c1,d1 = tuaf1

# 方法二: 一般在函数调用时使用
a2,*b2 = tuaf1
def funcTua(a3, *b3):
    print(a3, b3)
funcTua(1,3,4,5)
```

### 异常 

#### 抛出异常raise

1. 创建一个Exception('xx')对象
2. raise抛出异常
```py
def funcExcep():
    raise Exception('xx')
```

#### 捕获异常: 检测到异常时后面的代码继续执行
```py
try:
    print(funcExcep())
except Exception as e:
    print(e)
```

### 模块 

一个py文件就是一个模块
1. 内置模块: 直接导入
   `random、time、ox、logging`
2. 第三方模块
   `pip install 模块名`
3. 自定义模块：命名遵循标识符和变量命名规范，不要和内置模块冲突

#### 导入模块
1. import 模块名
`import random, time`

调用功能
模块功能.功能名
`random.random()`

2. from 模块名 import 方法名1,方法名2.....
`from test import hello`
调用：
`hello()`

3. from 模块名 import *
把模块中的内容全部导入

**建议使用1：**
`import test`


#### 模块取别名 as
`import test as cTest`
给功能取别名
`from test import hello as h,test as cT`

#### 内置全局变量__name__

只会在当前模块中执行，在其他模块不会执行一下逻辑
```py
if __name__ == '__main__':
    print('c')
```

用来控制文件在不同应用场景执行不同逻辑

`__name__`
1. 文件在当前程序执行： `__name__ == '__main__'`
2. 文件被当作模块被其他文件导入：`__name__ == 模块名`


#### 包: 将有联系的模块放在同一文件夹下，有效避免模块名称冲突问题，让结构更清晰
新建一个package包
```py
# 包结构
test # 包文件夹
  __init__.py # 初始化
```
导入包时首先执行__init__.py文件的代码
不建议在init中编写过多代码，尽量保证简单


`__all__`：本质上是一个列表，列表中的元素代表要导入的模块
`__all__ = ['register']`

包的本质就是一个模块


### 递归 

特点：
1. 必须要有终止条件
2. 每次调用复杂度减1
3. 每两次之间有关联

优点：简洁、逻辑清晰、解题更有思路
缺点：需要反复调用自己，耗内存、运行效率低

for循环能解决使用for, 解决起来复杂的话可以考虑递归
```py
def ficc(n):
    if n <= 1:
        return n
    return ficc(n-1) + ficc(n-2)
print(ficc(3)) # 2
```

### 闭包 

特点：
1. 函数嵌套
2. 内层函数使用外层变量的局部变量
3. 外层函数的返回值是内存函数名

每次通过外层函数调用内层函数都能访问到外层函数中的变量
```py
def out():
    out1 = 'test out1'
    def inner():
        print('inner')
        print(out1)
    return inner
out()()
```

- 函数引用： 函数名里保存了函数所在位置的引用
- id(): 判断两个变量是否是同一个引用


### 装饰器 

本质就是一个python函数(闭包)，它可以让其他函数在不需要做任何代码变动的前提下新增额外功能，装饰器的返回值也是一个函数对象

需要满足：
1. 不修改原程序或函数的代码
2. 不改变函数或程序的调用方法

原理： 将原有的函数名重新定义为以原函数为参数的闭包

#### 标准版装饰器
```py
def send():
    print('send message')

def outer1(fn):
    # 既包含原有功能，又有新功能
    def inner1():
        print('inner1')
        fn()
    return inner1
outer1(send)() # send

def pay():
    print('pay')
outer1(pay)() # pay
```

#### 语法糖：@装饰器名称
```py
@outer1
def speak():
    print('speak')
speak() # inner1 speak
```

#### 被装饰的函数有参数
```py
def outer2(fn):
    def inner2(name):
        print('inner2')
        print(name)
        fn(name)
    return inner2

@outer2
def speak2(t):
    print('speak2')
speak2('test')
```

#### 多个装饰器: 离函数最近的先装饰
```py
@outer1
@outer2
def speak3():
    print('speak3')
```

### 面向对象 

- 类比造车： 类是设计图，对象就是汽车

- 面向对象和面向过程
面向过程：手洗衣服一步一步洗
面向对象: 使用洗衣机

- 面向对象的核心优势：
代码复用性高
可维护性强
可扩展性好
符合人类思维

#### 类和对象

类： 对一系列具有相同属性（特征）和行为（功能）的事务的统称，是抽象的模块，不是真实的事务
对象：根据类创建出来的真实存在的事务也叫实例

先有类再有对象

- 定义类：`class 类名（大驼峰） Car`
- 创建对象：`对象 = 类名() :  car = Car()`

类的核心：属性和方法
类和对象对象都可以访问

- 构造函数__init__()
```py
class Car:
    """汽车类"""
    pass   # 空语句，表示占位

car = Car()

class Car2:
    # 对象共享的属性
    wheel_count = 4

    # 实例方法，谁调用就是谁，self代表调用的对象
    def start(self):
        # self -> Car object -> car2
        print('start')
    def run(self):
        print('run')
    def custom(self):
        print('custom' + self.color + self.brand)
car2 = Car2()
# 实例属性
car2.color = 'red'
car2.brand = 'Tesla'
car2.start()
print(car2.wheel_count) # 4

#使用__init__优化实例属性
class Car3:
    # 创建时自动执行
    def __init__(self, color, brand):
        self.color = color
        self.brand = brand
    # 程序结束的时候对象被销毁调用__del__
    def __del__(self):
        print('__del__')
        self.color = ''
        self.brand = ''
    def custom(self):
        print('custom' + self.color + self.brand)
car3 = Car3('red', 'Tesla')
car3.custom()
```

#### 面向对象的特性

3大特性：
封装：隐藏内部细节，对外提供简洁接口
继承：子类复用父类的属性和方法，减少重复代码
多态：不同对象调用同一方法，产生不同结果，提高灵活性

类本身就是一种封装


##### 封装: 保护私有属性 __a,想要修改书写公开方法，调用方法修改 

为什么需要封装
1. 数据安全（私有属性）
2. 隐藏复杂逻辑降低使用难度（通过公开接口调用）
3. 便于维护
4. 代码更清晰提高代码可读性
```py
class BankAccount:
    def __init__(self, name, balance):
        self.name = name
        # 私有属性
        self.__balance = balance
    def check_balance(self, balance):
        print('check_balance', balance <= self.__balance)
    # 存入
    def deposit(self, amount):
        self.__balance += amount
        print('deposit', amount, self.__balance)

    def withdraw(self, amount):
        if amount > self.__balance:
            print('fail')
        else:
            self.__balance -= amount
            print('withdraw', amount, self.__balance)
bankAccount = BankAccount('Bank', 100)
# 调用接口
bankAccount.check_balance(100) # True
# 修改无效
bankAccount.__balance = 1000
bankAccount.check_balance(1000) # False
# 不推荐读取或者设置私有属性
print(bankAccount.__balance)
print(bankAccount._BankAccount__balance)
```

##### 继承 

- 核心作用：
1. 减少重复代码
2. 代码结构清晰
3. 便于扩展

- 继承具有传递性

- 方法重写
1. 覆盖父类方法
2. 扩展父类方法

单继承 `class A(B)`
多继承 `class C(A,B)`
  弊端：
      1. 冲突风险高
      2. 代码复杂度高
      3. 耦合性强
  替代方案：单继承 + 组合（在子类中创建其他类的实例，复用功能）

```py
class LivingThing:
    def __init__(self, name):
        self.name = name
    def create(self):
        print('c=')
class Animal(LivingThing):
    def __init__(self, age):
        self.age = age
    def eat(self):
        print('eat')
class Dog(Animal):
    def bark(self):
        print('w ww w')
dog = Dog('Dog')
# 继承父类的公开属性和方法
print(dog.name) # Dog
dog.eat()
# 自己的方法
dog.bark()

# 方法重写
class Ball:
    def __init__(self, name):
        self.name = name
    def kind(self):
        print('kind')
class BasketBall(Ball):
    # 重写
    def kind(self):
        print('kind basket')
    # 扩展
    def kind_a(self):
        super().kind()
        print('kind a')
basketball = BasketBall()
basketball.kind() # basket

# 多继承
class Watch:
    def show(self):
        print('show')

class Help:
    def help(self):
        print('help')
# 父类有相同方法，从左到右执行 Help Watch
class HelpWatch(Help, Watch):
    def help(self):
        print('help watch')

helpwatch = HelpWatch()
helpwatch.help()
helpwatch.show()
# 父类有相同方法，从左到右执行解决方式
'''
1. 父类名.show(实例对象)
2. 子类重写show，实现多个父类方法并扩展
'''

# 单继承 + 组合 替代多继承
class Teacher:
    def teach(self):
        print('teach')

class Eater:
    def eat(self):
        print('eat')

class Student(Teacher):
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.eatSL = Eater()

s1 = Student('t1', 18)
s1.eatSL.eat()
```

##### 多态

同一接口多种实现
不同类的对象，调用同名方法时，会执行各自类的实现，得到不同结果
例子：支付动作：微信支付、支付宝支付、银行卡支付；动作都是支付

多态的价值：
1. 增加代码可读性： 让代码逻辑更加清晰
2. 统一接口： 无论对象的具体类型是什么，都可以通过同名方法调用
3. 隐藏差异： 调用者不用关心对象的具体类型，只需统一接口，降低使用难度
4. 便于扩展： 新增对象类型时，不用修改原代码直接实现新类+同名方法即可

实现方式：核心同名方法+不同实现
1. 鸭子类型
不管你是什么类的对象，只要你有某个方法，我就可以用这个方法调用你，不用关心你到底是谁

2. 继承 + 方法重写 （适合有层级关系的场景）
子类继承父类后，重写父类的同名方法，不同子类有不同的实现，调用时传入不同子类对象，执行不同重写后方法

- 鸭子类型
```py
class WeChatPay:
    def pay(self, amount):
        print('pay wechat', amount)

class AliPay:
    def pay(self, amount):
        print('pay ali', amount)

class BankCardPay:
    def pay(self, amount):
        print('pay bankcard', amount)

# 统一支付方法，不管什么支付都调用pay方法
def pay_order(pay_obj, amount):
    pay_obj.pay(amount) # 只关心有没有pay方法

pay_order(AliPay(), 100)

pay_order(WeChatPay(), 200)

pay_order(BankCardPay(), 300)
```

- 继承 + 方法重写
```py
class Animal1:
    def make_sound(self):
        print('make_sound animal1')

class Dog1(Animal1):
    def make_sound(self):
        print('make_sound dog1')

class Cat1(Animal1):
    def make_sound(self):
        print('make_sound cat1')

def animal_speak(animal):
    animal.make_sound()
animal_speak(Dog1())
animal_speak(Cat1())
```

#### 静态方法 、 类方法 

- 实例方法：通过实例调用
```py
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    def speak(self):
        print('speak')
        
p = Person()
p.speak()
```

- 静态方法： 在类中是独立工具函数和类本身、实例都没有关系（不用访问类属性，也不用访问实例属性，只靠传入的参数就能完成功能）
```py
class Person:
    @staticmethod
    def speak(): # 不用self cls
        print('speak')
```     
调用方式：`Person.speak()`
应用场景：
1. 实现通用工具
2. 方法不需要访问类属性或实例属性，只靠参数完成工作
3. 想把独立函数归类到某个类，让代码结构更清晰


- 类方法：
操作类属性而不是实例属性
```py
class Person:
    @classmethod
    def speak(cls): # cls代表类本身
        print('speak')
```
调用方式：`Person.speak()`
应用场景：
1. 访问/修改类属性（全局属性）
2. 工厂方法：封装实例化逻辑，提供多种创建对象的方式
3. 类级别的工具函数

```py
# 静态方法
class GeometryTool:
    @staticmethod
    def circle(radius):
        return 3.14 * radius ** 2

# 类方法
class Person1:
    avarage_age = 75

    def get_avarage_age(self):
        return self.avarage_age
    def set_avarage_age(self, avarage_age):
        '''修改成功后，重新实例化后新对象的age为 75 ， 想要每个实例都改的话使用类方法'''
        self.avarage_age = avarage_age

    @classmethod
    def get_age(cls):
        return cls.avarage_age
    @classmethod
    def set_age(cls, new_age):
        cls.avarage_age = new_age

p = Person1()
p.get_avarage_age() # 75
```

## 网络基础 

       ip/端口
客户端 ------------>  服务端

- IP: 
便于找到不同的设备
IPv4
四段 192.168.1.1, 每段0-255/8位二进制

- 域名: 
方便记忆对应ip（通过dns服务器映射）

- 端口
定位设备中的应用程序，不同的程序端口不同
http: 80
https: 443


- 网络模型：

1. osi七层网络模型
全球网络互联标准模型
  应用层
  表示层
  会话层
  传输层
  网络层
  数据链路层
  物理层

2. tcp/ip四层网络模型
osi简版

  应用层（http/ftp/smtp）：将用户与应用程序交互的数据按照协议格式进行封装
  传输层（udp/tcp）：负责将数据准确送到对应的应用程序（端口）
  网络层（ip）：负责给予IP地址将数据包路由给对应设备
  网络接口层：负责数据在物理网络中的传输、处理与硬件设备交互


- 应用层：
HTTP协议：超文本传输协议，规定客户端与服务器之间数据传输的规则

特点：
1、基于文本的协议：请求和响应的部分协议内容为文本格式，底层通过tcp协议传输，稳定性强
2、基于请求-响应模型：一层请求对应一次响应
3、无状态：服务端不会记忆与客户端的历史交互信息，每次请求和响应都是独立的

请求数据格式：

请求行（请求方式、资源路径、协议）
POST /api/test HTTP/1.1  

请求头（格式key:value）
Accept: */*
Content-Type: application/x-www-form-urlencoded

请求体
{"name": 1}

请求方式：
GET：请求参数在请求行中？name=1&age=2,在浏览器中有大小限制
POST：请求参数在请求体中

响应数据格式
响应行（协议、状态码）
HTTP/1.1 200 

响应头（格式key:value）

响应体（格式key:value）


## 文件操作 

操作文件的步骤：打开、读/写、关闭

- 读：
path: 
  相对路径(推荐)：从当前文件开始查找："./resources/1.txt"(./可以省略), "../asserts/2.txt"
  绝对路径：从文件系统根目录开始查找（\表示转义字符）： "D:\\py\\resource\\1.txt", "D:/py/resource/1.txt"
操作模式：
  r：读取
  w: 写入，将原来内容删除，覆盖新内容，文件不存在创建新文件
  a: 追加内容 文件不存在创建新文件
```py
# encoding="utf-8" : 关键字传递
f = open("resources/1.txt", "r", encoding="utf-8")
content = f.read()
f.close()
```

- 写：
```py
f = open("resources/1.txt", "w", encoding="utf-8")
f.write('test')
f.close()
```

- 编码：将字符转为计算机能够存储和处理的数字代码的规则系统，如：asscii、gbk、utf-8

- 文件释放方式：
1. try finally
2. with语句 -> 推荐
     with语句：上下文管理器的核心作用就是确保资源总是被正确获取和释放（即使发生异常），项目中推荐的方式
  
- 读取json文件
json模块
                     ensure_ascii: 转义ascii默认True, indent: 缩进2个空格
序列化：将字典转为json, json.dump(obj, f, ensure_ascii=False, indent=2)
反序列化：将json转为字典, json.load(f)
```py
# 方式1
f = open("resources/1.txt", "r", encoding="utf-8")
try:
    content = f.read()
    print(content)
finally:
    f.close()

# 方式2 推荐
with open("resources/2.txt", "w", encoding="utf-8") as f:
    f.write('test2')


# 读写json
import json
userJ = {
    name: 'userJ',
    age: 18
}

with open("resources/user.json", "w", encoding="utf-8") as f:
    # f代表文件
    json.dump(userJ, f, ensure_ascii=False, indent=2)

with open("resources/user.json", "r", encoding="utf-8") as f:
    userC = json.load(f)
    print(type(userC)) # <class 'dict'>

```

## 爬虫 

- 爬虫： 网络爬虫（网络机器人），是一种按照一定预设规则，自动浏览并抓取网络数据的程序或脚本
- 应用：
  搜索引擎
  舆情监控
  商业分析（电商比价）
  AI大模型训练语料
  
- 步骤：

开始 ---- 发送http请求  ----- 解析结果提取数据  ---- 数据处理（清洗） ---- 数据存储 ---- 结束

- 规范： robots.txt
robots协议（君子协议）： 爬虫协议，爬虫规则，指网站根目录下存的一份robots.txt，用于告诉爬虫哪些页面可以抓取，哪些不能抓取
User-Agent: 用户代理，通过该请求确认爬虫类型  *： 所有  Wandoujia 
Disallow: 禁止访问的资源
Allow: 允许访问的资源
Sitemap: 网站地图，帮助爬虫高效获取网站内容
Crawl-delay: 爬虫间隔时间，避免频繁访问造成网络压力过大

### 爬取语言排名榜单
步骤：
1. 查看TIOBE网站的robots.txt,明确获取的规则
2. 安装requests库，用于发送请求pip3 install requests
3. 编写脚本

- 网页结构：
HTML
CSS
JS

- 网页解析：
从原始html文档中提取数据的过程，也是网络爬虫的关键步骤，从一堆标签文本中提取需要的数据

lxml: 高性能的html/xml文档解析库，支持Xpath语法来解析和获取网页数据
Xpath: 是一种用于html/xml文档中导航或定位元素的查询语言，能准确定位文档中的元素、属性、文本
`pip3 install lxml`

```py
#解析html,转换为文档对象
doc = lxml.fromstring(html)
# Xpath语法：
doc.xpath("//table/thead/tr/th/text()")
doc.xpath("//table/tbody/tr[1]/th/text()")
#v获取每行的数据
tr_list = xpath("//table/tbody/tr")
for tr in tr_list:
    td_list = tr.xpath("./td/text()")
```  

- **Xpath语法:**
  /   从根节点的直接子元素  /html/body/h1
  //  从任意位置查找       //body/h1
  .   从当前节点下查找     ./a   .//a
  [n] 选择第n个元素        //p[2]
  [last()] 最后一个       //p[last()]
  [@attr]  有该属性的元素  //p[@color='red']
  *     匹配任意元素节点    //body/div/*
  @*   匹配元素的任何属性   //body/div/a/@href //body/img/@*
  text() 获取文本类容       //body/div/text()
  
**Xpath路径可以从浏览器复制（Copy Xpath）**


### CSV文件Comma-Separated Values,（逗号分隔值）：是一种简单通用的文本文件格式，用于存储表格数据，可以直接使用Excel打开

姓名,年龄，爱好
test,18,play

#### csv格式操作：

`import csv`
手写
```py
  #写：
    
     with open('csv_data/1.csv', 'w', encoding='utf-8') as f:
         f.write('name,age,hobby\n')
         f.write('test,18,play\n')
         f.write('test1,18,"play,sing"\n')  
  #读：  

     with open('csv_data/1.csv', 'r', encoding='utf-8') as f:
         for line in f:
             print(line.strip())
```     

**使用csv(推荐)**

``` py
# csv写入数据（open多一个换行，添加newline=''）
with open('csv_data/1.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age', 'hobby'])
    writer.writeheader()
    writer.writerow({'name': 'test', 'age': 18, 'hobby': 'play'})
    writer.writerow({'name': 'test1', 'age': 18, 'hobby': 'play,sing'})

# csv读取数据
with open('csv_data/1.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row) # {'name': 'test', 'age': '18', 'hobby': 'play'}

```

## 正则 （用于数据清洗）

正则表达式： 由特定语法规则组成的文本模式，用来描述、匹配字符串中符合特定规则的字符序列，相当于一种模式匹配工具，允许用户通过简洁
           语法进行复杂文本的搜索、匹配、提取和替换工作
`1[3-9]\d{9}`
`r"1[3-9]\d{9}"` : r代表\d中的\不是转义字符就是\

**常见操作：**

- .    -> 匹配任意一个字符（除\n）
- \d   -> 匹配数字0-9
- \D   -> 匹配非数字
- \w   -> 匹配单词，a-z A-Z 0-9 _ 其他语言字符
- \W   -> 匹配非单词
- [abc]-> 匹配其中任意单个字符
- [^ab]-> 求反，匹配不在字符列表中的任意单个字符
- [0-5]-> 表示范围 0-5之间的任意一个

- *    -> 出现任意次数 0次或无数次
- +    -> 至少出现1次  1次或无数次
- ?    -> 至多出现1次  0次或1次
- {m}  -> 出现m次
- {m,n}-> 出现m到n次
- |    -> 或的意思，匹配左右任意一个表达式
- ()   -> 分组，将括号里的多个字符视为一个单元 (ab)+ -> ab这个整体至少出现一次
- ^    -> 匹配字符串开头
- $    -> 匹配字符串结尾

1. match 从字符串的开头开始匹配，只会匹配第一个匹配项，返回match对象
``` py
import re
p1 = '18888888888我的手机号是这吗'
p2 = '我的手机号18888888888,还是17777777777'

result1 = re.match(r"1[3-9]\d{9}", p1)
print(result1.group()) # 18888888888
print(result1.span()) # (0, 11) 匹配的开始和结束索引
print(result1.start()) # 0
print(result1.end()) # 11

result11 = re.match(r"1[3-9]\d{9}", p2)
print(result1.group()) # None
```

2. search 从任意位置开始匹配，搜索第一个匹配项，返回match对象
```py
result2 = re.search(r"1[3-9]\d{9}", p2)
print(result2.group())
```

3. findall 从任意位置开始匹配 返回所有匹配项的列表 List
```py
result3 = re.findall(r"1[3-9]\d{9}", p2)
print(result3) # ['18888888888', '17777777777']
```

4. 只匹配ASCII
```py
p3 = '邮箱11@qq.com'
result4 = re.findall(r"\w+@\w+.\w+", p2, re.ASCII)
```


## 数据分析 

数据分析： 从一堆看视杂乱的数据中，通过数据清洗、分析、可视化等手段，找出有价值的信息和结论，从而帮我们解决实际问题（订单数据分析）

- 步骤:

数据收集 -----> 数据清洗处理  --------------> 数据分析(Pandas) ------------> 数据可视化(Matplotlib   )         

- 环境：
Jupyter Notebook: 是一个基于web网页的交互式的编程笔记本，让你可以把代码、运行结果、图表和笔记全部都放在一个文件里（数据分析、机器学习、教学和科研等领域的数据实验室）

### Pandas:
一个功能强大的数据分析的工具集，底层是基于Mumpy构建的，无论是在数据分析领域还是大数据开放场景中都有显著的优势
核心： DataFrame(类似表格)、Series（类似表格中的一列）
目前兼容版2.3.3

#### DataFrame格式：

```py
#1

{
    '姓名': ['张三', '李四', '王五', '赵六'],
    '语文': [80, 90, 70, 60],
}
#2

[
    {
        '姓名': '张三',
        '语文': 80,
        '数学': 80,
        '英语': 80
    },
    {
        '姓名': '张三',
        '语文': 80,
        '数学': 80,
        '英语': 80
    }
]
#3

[
    ('张三', 80, 80, 80)
], columns=['姓名', '语文', '数学', '英语']

#4 
[
   ['张三', 80, 80, 80]
], columns=['姓名', '语文', '数学', '英语'], index=[1,2,3]
```

DataFrame 常见属性： 
- index，每一列索引 
- columns, 每一列列名
- values, 每一列值
- size, 元素个数
- dtypes, 数据类型 
- shape  数据维度（行，列）


#### 构建Series:
pd.Series()

- 格式：
1. [10,20]
2. (10,20), index=[1,2]
3. {a: 1, b:2}             -> a/b是索引
4. df['语文']

- 常见属性： 
  - index，索引 
  - values, 值
  - size, 元素个数
  - dtypes, 数据类型 
  - shape  数据维度（行）


#### 数据的读取和写入（csv、Excel、数据库、网络数据）
```py
h=pd.read_csv()
file.to_csv()
```

#### 数据的查看
  - df.head(): 显示前几行，默认5
  - df.tail(): 显示最后10行数据
  - df.describe(): 显示数据所有的统计信息
  - df.info(): 显示数据信息（列名、非空计数、数据类型等）
  - df.shape: 显示行
  - df.columns: 显示列名
  
#### 选择数据

- 选择列：
  - df['产品名称'] ： 获取产品名称这列
  - df['产品名称', '单价']： 获取多列
- 选择行：
  - df.iloc[start:stop:step]: 基于行号选择行(和索引无关)，不包含结束位置stop
  - df.iloc[0:5:1]: 获取前5行数据
  
  - df.loc(start:stop:step): 基于索引选择行（包含结束位置）
  - df.loc(0:5:1): 0和5代表索引
  
#### 数据过滤：按条件筛选出需要的数据

df[filter]: filter代表过滤条件
1. 获取 销售数量 >= 10的订单数据
`df[df['销售数量'] >= 10]`
2. 获取产品类别为食品或者图书的订单数据
`df[df['产品类别'].isin(['食品', '图书'])]`
3. 获取单价100-200之间的订单数据between(79, 89, inclusive="both/neither/left/right")（包含边界）
`df[df['单价'].between(100,200)]`
4. 获取 销售数量 >= 8 并且 单价 <= 100 的订单数据 ,多条件 & |
`df[(df['销售数量'] >= 8) & (df['单价'] >= 100)]`
5. 获取 产品类别为 服装/食品， 支付方式为 支付宝/微信 的数据
`df[(df['产品类别'].isin(['服装','食品']) & (df['支付方式'].isin(['支付宝', '微信'])]`
  
#### 数据清洗：发现并纠正数据中可识别的错误（数据缺失、数据重复、数据异常、格式异常等）

- 处理缺失值：NaN

1. 查看缺失值（True代表缺失）
`df.isnull() `
2. 删除缺失值：
```py
    df.dropna() #删除缺失值所在行
    df_new = df.dropna(axis = 1) #删除缺失值所在列
```
3. 填充缺失值：
``` py
      df.fillna('test')#填充缺失
      df.ffill() #使用上一行数据填充
      df.bfill() #使用下一行数据填充
```

- 处理重复值：
1. 查看重复值：
```py
      df.duplicated() #判断依据：所有的列的数据都重复
      df.duplicated(subset=[‘订单号’])#： 指定列的数据重复
```
2. 删除重复值：
`df.drop_duplicates(subset=['订单号'], keep='first/last/False') #False都删除`

- 处理异常值：单价：-2
1. 查看异常值
    `df[df['单价'] < 0]`
2. 删除异常值
    `df.drop(df[df['单价'] < 0].index)`
3. 修复异常值
    `df['单价'] = df['单价'].abs() #绝对值`

- 数据格式异常值：2025/06/06
```py
    df['订单日期'] = df['订单日期'].replace('/', '-')
    df['订单日期'] = df['订单日期'].str.replace('/', '-') #推荐
 ```   

#### 数据排序： 升序/降序
- df.sort_values('销售数量', ascending=False) # 降序
- df.sort_values('销售数量', ascending=True) # 升序
- 销售数量一样再根据价格排序
- df.sort_values(['销售数量', '价格'], ascending=[True, True]) # 升序
  
#### 数据分组：按某种特征分组后再统计计算（求和/统计数量/最大值/最小值/平均值）

- 根据产品类别分组后求销售额数量等(缺失值不参与统计)
```py
  df.groupby('产品类别')['销售额'].sum()
  df.groupby('产品类别')['销售额'].agg(['sum','count','max','min','mean'])
```

- 统计各类别销售金额之和，没有金额需要先添加
```py
  df['销售额'] = df['单价'] * df['数量']
  df.groupby('产品类别')['销售额'].sum()
```

- 根据产品类别分组，统计各类别商品的 平均单价、最高单价、最低单价
`df.groupby('产品类别')['单价'].agg(['mean','max','min'])`
  
- 根据产品类别分组，统计各类别商品的 销售数量之和 销售金额之和，平均单价 转为字典
`df.groupby('产品类别')['单价'].agg({'销售数量': 'sum', '销售金额': 'sum','平均单价': 'mean'}).toDict()`


###  数据可是化：Matplotlib

`pip3 install matplotlib`
```py
import matplotlib.pyplot as plt
x=[1,2,3,6,101]
y=[2,3,4,5,6]
plt.plot(x,y)
plt.show()
```

```py
import pandas as pd

# 统计学生成绩
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '语文': [80, 90, 70, 60],
    '数学': [80, 90, 70, 60],
    '英语': [80, 90, 70, 60]
})

print(f"{df['语文'].max()}, {df['语文'].min()}, {df['语文'].mean():.2f}, {df['语文'].sum()}")

pd.Series([10,20])

# 数据读取
df_movies =pd.read_csv('./csv_data/list.csv', usecols=['电影名', '评分', '时长'])
# 数据处理
df_movies['评分-1'] = df_movies['评分'] + df_movies['时长']
# 写入数据   index表示不导入索引
df_movies.to_csv('./csv_data/list_new.csv', index=False)

```

- 数据可视化
### 折线图
```py
import matplotlib.pyplot as plt
x=[1,2,3,6,101]
y=[2,3,4,5,6]
plt.plot(x,y)
plt.show()

```
