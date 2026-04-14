# MySQL 从入门到精通

## 基本概念

1. 数据库：数据存储的仓库
2. 数据库管理系统：操纵和管理数据库的大型软件
3. SQL: 操作关系型数据库的编程语言，是一套标准

## MySQL 数据库

- 启动和停止：

启动：`net start mysql80`
停止：`net stop mysql80`

- 客户端连接方式
  - 方式一：MySQL提供的客户端命令行工具（打开，输入密码）
  - 方式二：系统自带的命令行工具（打开输入命令`mysql -u root -p`）需要配置环境变量

- 数据模型

客户端 ---->  MySQL数据库服务器（DBMS -> 数据库（表、字段） ）

- 关系型数据库
概念：建立在关系模型基础上，由多张相互连接的二维表组成的数据库
     (员工表中的deptId与部门表中的id关联)
特点: 
     1. 使用表存储数据，格式统一，以便于维护
     2. 使用SQL语言操作，标准统一，使用方便

## SQL

### 通用语法：
1. SQL语句可以单行或多行，用分号结束；
2. SQL语句可以使用空格或缩进来增强语句的可读性；
3. MySQL语句不区分大小写，关键字建议大写；
4. 注释：
   - 单行 # 或 --
   - 多行/*注释*/

### SQL分类

#### DDL
数据定义语言，用来定义数据库对象（数据库、表、字段）

##### 数据库操作：
1. 查询
- 查询所有数据库
`show databases;`
- 查询当前数据库
`select database;`

2. 创建 [中代表可选]
`create database [if not exists] 数据库名 [default charset字符集] [collate 排序规则];`

3. 删除
`drop database [if not exists] 数据库名;`

4. 使用
`use 数据库名;`

##### 表操作
1. 查询
- 查询数据库所有表
`show tables;`
- 查询表结构
`desc 表名;`
- 查询指定表的建表语句
`show create table 表名;`

2. 创建(注意：最后一个字段后不加逗号)
```sql
create table user(
  id int comment '编号',
  name varchar(10) comment '姓名',
  age tinyint unsigned comment '年龄',
  gender char(1) comment '性别',
  id_card char(18) comment '身份证',
  entrydate date comment '入职时间'
) comment '用户表';

```

3. 修改

- 添加字段
`alter table 表名 add 字段名 类型(长度) [comment 注解] [约束];`
为user表添加一个nickname,类型为varchar(20)
`alter table user add nickname varchar(20) comment '昵称';`

- 修改
  - 修改数据类型
  `alter table 表名 modify 字段名 新数据类型(长度)'`
  - 修改字段名和字段类型
  `alter table 表名 change 旧字段名 新字段名 类型(长度) [comment 注解] [约束];`
  将user表的nickname修改为username,类型为varchar(30)
  `alter table user change nickname username varchar(30) comment '用户名''`

- 删除
删除字段
`alter table 表名 drop 字段名;`
删除user表的username
`alter table user drop username;`

- 修改表名
`alter table 表名 rename to 新表名;`
`alter table user rename to employee;`

- 删除表: 删除时表中的数据全部被删除
`drop table [if exists] 表名;`
删除指定表并创建新表
`truncate table 表名;`

**类型表**
- 数值类型

|类型|大小|有符号范围（SIGNED）|无符号范围（UNSIGNED）|描述|
|---|---|------------------|--------------------|---|
|tinyint|1byte|(-128, 127)|(0,255)|小整数值|
|smallint|2byte|(-32758, 32767)|(0,65535)|大整数值|
|mediumint|3byte|(-8388608,8388607)|(0,16777215)|大整数值|
|int/integer|4byte|(-2147483648, 2147483647)|(0,4294967295)|大整数值|
|bigint|8byte|(-2^63, 2^63-1)|(0,2^64-1)|极大整数值|
|float|4byte|(-3.4 E+38, 3.4 E+38)|0和(1.7 E-38,3.4 E+38)|单精度浮点数值|
|double|8byte|(-1.7 E+308,1.7 E+308)|0和(2.4 E-308,1.9 E+308)双精度浮点数值|
|decimal|--|依赖于精度和标度|依赖于精度和标度|小数值（精确定点数）|

- 字符串类型

|类型|大小|描述|
|----|----|----|
|char|0-255 bytes|定长字符串（性能好）|
|varchar|0-65535 bytes|不定长字符串|

- 日期类型

|类型|大小|描述|
|---|---|---|
|date|3|日期值|
|time|3|时间值|
|year|1|年份值|
|date time|8|日期时间|
|timestamp|4|时间戳|


#### DML
数据操作语言，用来对数据库表中的数据进行增删改查

##### 添加数据insert

- 插入数据时，指定的字段顺序需要和值一样
- 字符串和日期数据应该包含在引号中
- 插入的数据大小应该在字段规定范围内

1. 给指定字段添加数据
`insert into 表名 (字段1,字段2,....) values (值1,值2,.....);`
2. 给全部字段添加数据
`insert into 表名 values (值1,值2,.....);`
3. 批量添加数据
`insert into 表名 (字段1,字段2,....) values (值1,值2,.....),(值1,值2,.....);`
`insert into 表名 values (值1,值2,.....),(值1,值2,.....);`

##### 修改数据update
`update 表名 set 字段1=值1,字段2=值2,... [where 条件];`
`update user set name='test' where id=1;`
`update user set name='test1',age=18 where id=1;`
`update user set entrydate='2026-01';`

##### 删除数据delete
没有条件删除整张表
不能删除某一个字段的值，使用update
`delete from 表名 [where 条件];`
删除gender为女的员工
`delete form user gender='女';`

#### DQL
数据查询语言，用来查询数据库中表的记录


#### DCL
数据控制语言，用来创建数据库用户、控制数据库的访问权限




    