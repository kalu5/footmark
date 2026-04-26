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

通用语法：
1. SQL语句可以单行或多行，用分号结束；
2. SQL语句可以使用空格或缩进来增强语句的可读性；
3. MySQL语句不区分大小写，关键字建议大写；
4. 注释：
   - 单行 # 或 --
   - 多行/*注释*/

## SQL分类

### DDL
数据定义语言，用来定义数据库对象（数据库、表、字段）

#### 数据库操作：
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

#### 表操作
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


### DML
数据操作语言，用来对数据库表中的数据进行增删改查

#### 添加数据insert

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

#### 修改数据update
`update 表名 set 字段1=值1,字段2=值2,... [where 条件];`
`update user set name='test' where id=1;`
`update user set name='test1',age=18 where id=1;`
`update user set entrydate='2026-01';`

#### 删除数据delete
没有条件删除整张表
不能删除某一个字段的值，使用update
`delete from 表名 [where 条件];`
删除gender为女的员工
`delete form user gender='女';`

### DQL
数据查询语言，用来查询数据库中表的记录

语法： `select 字段列表 from 表名 where 条件列表 group by 分组字段列表 having 分组后条件列表 order by 排序字段列表 limit 分页参数;`

**执行顺序**
from 表名   ->   where 条件列表   ->   group by 分组字段列表   ->  having 分组后条件列表  -> select 字段列表  -> order by 排序字段列表   ->   limit 分页参数

#### 基本查询

1. 查询多个字段
`select 字段1,字段2... from 表名;`
`select * from 表名;`

例子:
- 查询指定字段
`select name,workno,age from emp;`
- 查询所有字段
`select name,workno,age,id,gender from emp;`
不建议用*
`select * from emp;`

2. 设置别名
`select 字段1 [as 别名1],字段2 [as 别名2],... from 表名;`

例子：
- 查询所有员工的工作地址起别名
`select workaddress as '地址' from emp;`
`select workaddress '地址' from emp;`

3. 去重重复记录
`select distinct 字段列表 from 表名;`

例子：
- 查询员工的工作地址不重复
`select distinct workaddress '地址' from emp;`

#### 条件查询

语法：`select 字段列表 from 表名 where 条件列表;`

**条件**

|  比较运算  |    功能   |
| ----------- | ----------|
|     >           |               |
|     <           |               |
|     >=          |               |
|     <=          |               |
|     =           |               |
|     <> 或 !=   |   不等于  |
|  between ... and ...         |   在某个范围之内含最小和最大值            |
|     in(...)          |      在in之后的列表中的值，多选一    |
|     link  占位符        |      模糊匹配（_： 匹配单个字符，%： 匹配任意个字符）         |
|     is null          |    是null         |


|  逻辑运算  |    功能   |
| ----------- | ----------|
|     and 或 &&           |     并且          |
|     or  或 ||            |      或者         |
|     not 或 ！         |         非 /不是     |


例子：
- 查询年龄等于18的员工
`select * from emp where age = 18;`

- 查询年龄小于18的员工
`select * from emp where age <= 18`

- 查询有身份证号的员工
`select * from emp where idcard is not null`

- 查询没有身份证号的员工
`select * from emp where idcard is null`

- 查询年龄不等于18的员工
`select * from emp where age != 18;`
`select * from emp where age <> 18;`

- 查询年龄[15-20]的员工
`select * from emp where age >= 15 && age <= 20;`
`select * from emp where age >= 15 and age <= 20;`

`select * from emp where  age between  15 and 20;`


- 查询年龄19或25的员工
`select * from emp where age = 19 || age = 25;`
`select * from emp where age = 19 or age = 25;`

`select * from emp where age in(19,25);`

- 查询姓名为2个字的员工
`select * from emp where name link '--';`

- 查询身份证最后一个是X的员工
`select * from emp where idcard link '%X';`


#### 聚合函数

将一列数据作为一个整体，进行纵向运算

语法：`select 聚合函数(字段列表) from 表名;`

**注意** null不参与所有聚合函数运算

|   函数   |    功能       |
| ------    |  ------       |
|   count   |  统计数量   |
|   max   |  最大值   |
|   min   |  最小值   |
|   avg   |  平均值   |
|   sum   |  求和   |

例子：

- 统计该企业的员工数量
`select count(*) from emp;`

- 统计该企业的员工平均年龄
`select avg(age) from emp;`

- 统计该企业的员工最小年龄
`select min(age) from emp;`

- 统计西安地区员工之和
`select sum(age) from emp where address = ‘西安’;`


#### 分组查询

语法： `select 字段列表 from 表名 [where 条件] group by 分组字段名 [having 分组后的过滤条件];`

**where与having区别**
1. 执行时机不同：where分组之前过滤，having分组之后过滤
2. 判断条件不同：where不能对聚合函数进行判断 having可以

**注意：**
1. 执行顺序： where > 聚合函数 > having
2. 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无意义

例子：

- 根据性别分组统计男生和女生的数量
`select gender count(*) from emp group by gender;`

- 查询年龄小于45的员工， 并根据工作地址分组，获取员工数量大于等于3的工作地址
`select workaddress count(*) as address_count from emp where age < 45 group by workaddress having address_count >= 3;`


#### 排序查询

语法： `select 字段列表 from 表名 order by 字段1 排序方式, 字段2 排序方式...;`

排序方式： 升序asc, 降序 desc

**注意：**
如果是多个字段，当前一个字段相同时，才会根据第二个字段排序

例子：

- 根据年龄升序排序，年龄相同按入职时间降序
`select * from emp order by age asc, entrydate desc;`

#### 分页查询

语法：`select 字段列表 from 表名 limit 起始索引,查询记录数;`

**注意：**
1. 起始索引从0开始，等于 （查询页码 - 1）* 每页显示记录数
2. 分页查询是数据库语言，不同数据库不同，mysql为limit
3. 如果查询的是第一页，索引可以省略，简写limit 10

例子：

- 查询第一页，每页展示10条
`select * from emp limit 10;`

- 查询第二页，每页展示10条
`select * from emp limit 10,10;`


#### 案例

- 统计员工信息表中，年龄小于60岁的男女员工的人数
`select gender count(*) from emp age < 60 group by gender;`

### DCL
数据控制语言，用来创建数据库用户、控制数据库的访问权限

#### 基础管理

1. 查询用户
`use mysql;`
`select * from user;`

2. 创建用户
`create user '用户名'@‘主机名’ identified by '密码';`
- 创建user test只能在当前主机localhost访问
`create user 'test'@'localhost' identified by '123456';`

- 创建user test可以在任意主机访问该数据库
`create user 'test'@'%' identified by '123456';`

3. 修改用户密码
`alter user '用户名'@‘主机名’ identified with mysql_native_password by '新密码';`

`alter user 'test'@'%' identified with mysql_native_password by '111111';`

4. 删除用户
`drop user '用户名'@‘主机名’ ;`

`drop user 'test'@'%';`

**注意：**
1. 主机名可以使用通配符%
2. 主要是数据库管理员使用

#### 权限控制

**权限列表：**

| 权限 |  说明 |
|------| -------|
| all / all privileges |  所有权限 |
| select |  查询数据 |
| insert |  插入数据 |
| update |  更新数据 |
| delete |  删除数据 |
| alter |  修改表 |
| drop |  删除数据库/表/视图 |
| create |  创建数据库/表 |

**权限控制：**

1. 查询
`show grants for '用户名'@‘主机名’ ;`

2. 授予
`grant 权限列表 on 数据库名.表名 to '用户名'@‘主机名’ ;`

`grant all on test.* to 'test'@'%';`

3. 撤销
`revoke 权限列表 on 数据库名.表名 from '用户名'@‘主机名’ ;`

**注意：**

1. 多个权限之间，使用逗号隔开
2. 授权时，数据库名和表名可以使用*代表所有


## 函数

一段可以直接被另一段函数调用的程序/代码

### 字符串函数

- 常见函数

|  函数  |   功能    |
| -------| --------  |
| concat(s1,s2,....sn) | 字符串拼接，将s1...sn拼接成一个字符串 |
| lower(str)             |  将字符串str全部转为小写 |  
| upper(str)             |  将字符串str全部转为大写 |  
| lpad(str,n,pad)             |  用字符串pad对str的左边进行填充，达到n个字符串长度 |  
| rpad(str,n,pad)             |  用字符串pad对str的右边进行填充，达到n个字符串长度 |  
| trim(str)             |  去掉字符串头部和尾部的空格 |  
| substring(str,start,len)             |  返回从字符串str从start位置起的len个长度的字符串 |  


- 基本语法

`select concat('hello', 'test');`

`select upper('hello');`

`select lpad('01', 5 '-');`

`select trim(' test ')`

`select substring('hello', 1, 2);`


- 例子
更新员工编号为5为不足补0
`update emp set workno = lpad(workno, 5, '0')`

### 数值函数

- 常见函数

|  函数  |   功能    |
| -------| --------  |
|  ceil(x) |  向上取整 |
|  floor(x) |  向下取整 |
|  mod(x/y) |  返回x/y的模 |
|  rand() |  返回0-1内的随机数 |
|  round(x，y) |  求参数x的四舍五入的值，保留y位小数 |

- 例子
通过数据库函数，生成一个六位数的随机验证码
`select lpad(round(rand() * 1000000, 0), 6 '0')`

### 日期函数

- 常见函数

|  函数  |   功能    |
| -------| --------  |
| curdate() |  返回当前日期 |
| curtime() |  返回当前时间 |
| now() |  返回当前日期和时间 |
| year(date) |  返回指定date的年份 |
| month(date) |  返回指定date的月份 |
| day(date) |  返回指定date的日期 |
| date_add(date, interval expr type) |  返回一个日期/时间值加上一个时间间隔expr后的时间值 |
| datediff(date1, date2) |  返回起始时间和结束时间之间的天数 |

- 例子
1. 当前时间加70年
`select date_add(now(), interval 70 year);`

2. 查询所有员工的入职天数并按照入职天数倒叙排序
`select name, datediff(curdate(), antrydate) as 'antrydays' from emp order by entrydays desc;`

### 流程函数

- 常见函数

|  函数  |   功能    |
| -------| --------  |
| if(value,t,f) |  如果value为true,则返回t,否则返回f |
| ifnull(value1, value2) |  如果value1不为空,则返回value1,否则返回value2 |
| case when [val1] then [res1] ... else [default] end |  如果value1为true,则返回res1,否则返回default默认值 |
| case [expr] when [val1] then [res1] ... else [default] end |  如果expr等于val1,则返回res1,否则返回default默认值 |


- 例子
1. 查询emp表的员工姓名和工作地址（北京/上海）为一线，其他为二线
`select name, (case workaddress when '北京' then '一线' when '上海' then '一线' else '二线' end) as '工作地址' from emp;`

2. 统计班级各个学院的成绩，大于80优秀，大于60及格 否则不合格
`select name (case when math >= 80 then ‘优秀’ when math >= 60 then '及格' else '不及格' end) as '数学' form student`

## 约束

- 概念： 约束是作用于表中字段上的规则，用于限制存储在表中的数据
- 目的： 保证数据库中数据的正确、有效性和完整性
- 分类


|  约束   |    描述       |    关键字    |
| -------- | ----------------- | ------------------ |
| 非空约束 |   限制该字段的数据不能为null |   NOT NULL |
| 唯一约束 |   保证该字段的所有数据都是唯一的、不重复的 |  UNIQUE |
|  主键约束 |   主键是一行数据的唯一标识，要求非空且唯一 |  PRIMARY KEY |
| 默认约束  |   保存数据时，如果未指定该字段的值，则采用默认值 | DEFAULT |
| 检查约束（8.0.16版本之后）|  保证字段值满足某一个条件   |  CHECK   |
|    外键约束 |    用来让两张表的数据之间建立联系，保证数据的一致性和完整性 | FOREIGN KEY |


**注意：**
约束是作用于表中的字段上的，可以在创建表/修改表的时候添加约束

**例子：**

- 基本约束

``` sql
create table user(
  id int primary key auto_increment comment '主键约束',
  name varchar(10) not null unique comment '非空和唯一约束',
  age int check (age > 0 && age <= 120 ) comment '检查约束',
  status char(1) default '1' comment '默认约束',
  gender char(1) comment '性别'
);
```

- 外键约束
1. 添加外键
添加后删除部门会报错
``` sql
create table emp (
  id int primary key auto_increment comment 'id',
  constraint fk_emp_dept_id foreign key (dept_id) references dept (id)
);
```
`alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept (id); `

2. 删除外键
`alter table emp drop foreign key fk_emp_dept_id;`

- 删除或更新行为

|  行为 |                        说明                   |
| ------ | -------------------------------------|
| NO ACTION |  当父表中删除/更新对应记录时，首先检查该记录是否有对应的外键，如果有则不允许删除/更新 （与RESTRICT 一致）|
| RESTRICT | 当父表中删除/更新对应记录时，首先检查该记录是否有对应的外键，如果有则不允许删除/更新 （与NO ACTION  一致）|
| CASCADE | 当父表中删除/更新对应记录时，首先检查该记录是否有对应的外键，如果有则也删除/更新外键在子表中的记录  |
| SET NULL | 当父表中删除/更新对应记录时，首先检查该记录是否有对应的外键，如果有则设置子表中该外键为null (要求改外键允许为null)  |
| SET DEFAULT | 父表有变更时，子表将外键列设置成一个默认的值（Innodb不支持）  |

`alter table 表名 add constraint 外键名称 foreign key (外键字段) refernces 主表名 (主表字段名) on update cascade on delete cascade;`

`alter table emp add constraint fk_emp_dept_id foreign key (dept_id) refernces dept (id) on update set null on delete set null;`


## 多表查询

### 多表关系

- 概述
项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在各种联系基本分3种
- 一对多（多对一）
    部门与员工：
        关系： 一个部门对应多个员工，一个员工对应一个部门
        实现：在多的一方建立外键，指向一的一方的主键
                  员工表建立外键dept_id对应部门表主键id

``` sql
create table emp(
  id int primary key auto_increment comment '主键id',
  name varchar(10) comment '性别',
  age int comment '年龄',
  dept_id int comment '部门id',
  constraint fk_dept_id foreign key (dept_id) refernces dept (id) 
) comment '员工基本信息表';

create table dept(
  id int primary key auto_increment comment 'id',
  name varchar(10) comment '部门',
) comment '用户教育表';
```

- 多对多
    学生 与课程的关系
        关系：一个学生可以选多门课程，一门课程也可以供多个学生选择
        实现：建立第三张中间表，中间表至少包含两个外键，分别关联两方主键
                  学习课程关系表 student_id关联学生表主键id, course_id关联课程表的id

``` sql
create table student(
  id int primary key auto_increment comment '主键id',
  name varchar(10) comment '性别',
  age int comment '年龄',
) comment '学生基本信息表';

create table course(
  id int primary key auto_increment comment 'id',
  name varchar(10) comment '课程名称',
) comment '课程表';

create table student_course(
  id int primary key auto_increment comment 'id',
  student_id int comment 'student id',
  course_id int comment 'courser id',
  constraint fk_s_id foreign key (student_id) references student (id),
  constraint fk_c_id foreign key (course_id) references course (id)
) comment '课程学生关联表';
```

- 一对一
    用户与用户详情
        关系： 一对一，多用于表拆分，将一张表的基础字段放在一张表中，其他详情字段放在另一张表中，以提升操作效率
        实现：在任意一方添加外键，关联另一方的主键，并且设置外键为唯一的（UNIQUE）
                  用户教育信息表添加一个外键user_id与用户基本信息表id关联
``` sql
create table user(
  id int primary key auto_increment comment '主键id',
  name varchar(10) comment '性别',
  age int comment '年龄'
) comment '用户基本信息表';

create table user_edu(
  id int primary key auto_increment comment 'id',
  univerity varchar(50) comment '大学',
  user_id int unique comment 'user id',
  constraint fk_user_id foreign key (userid) references user (id)
) comment '用户教育表';
```


### 多表查询概述、

- 概念：从多个表中查询

**注意：**

需要使用条件过滤无效的笛卡尔积：

`select * from emp, dept where emp.dept_id = dept.id;`


- 分类

1. 连接查询
   - 内连接：查询A、B交集部分数据
   - 外连接：
       - 左外连接：查询左表所有数据，以及两张表的交集部分数据
       - 右外连接：查询右表所有数据，以及两张表的交集部分数据
   - 自连接：当前表与自身的连接查询，必须使用表别名

2. 子查询

### 内连接

查询两张表交集的部分

1. 隐式内连接
`select 字段列表 form 表1,表2 where 条件;`

2. 显式内连接
`select 字段列表 from 表1 [inner] join 表2 on 连接条件;`

查询每一个员工的姓名及关联的部门名称
- 隐式内连接
`select emp.name, dept.name from emp,dept where emp.dept_id = dept.id;`

`select e.name, d.name from emp e,dept d where e.dept_id = d.id;`

- 显示内连接
`select e.name, d.name form emp e inner join dept d on e.dept_id = d.id; `

### 外连接

1. 左外连接
`select 字段列表 from 表1 left [outer] join 表2 on 条件;`
查询表1左表的所有数据包含表1和表2的交集部分的数据

2. 右外连接
`select 字段列表 from 表1 right [outer] join 表2 on 条件;`
查询表2右表的所有数据包含表1和表2的交集部分数据

查询emp表的所有数据和对应的部门信息
- 左外
`select e.*, d.* from emp e left outer join dept d on e.dept_id = d.id;`

- 右外
`select d.*, e.* from emp e right outer join dept d on e.dept_id = d.id;`
右外改为左外
`select d.*, e.* from dept d left outer join  on emp e e.dept_id = d.id;`

### 自连接

`select 字段列表 from 表1 别名1 join 表1 别名2 on 条件;`
可以是内连接也可以是外连接

查询员工及所属领导的名字(领导也是员工，员工表中通过managerid关联)
`select e.name, e2.name from emp e, emp e2 where e.managerid = e2.id;`

`select e.name as ‘员工姓名’, e2.name as ‘领导姓名’ from emp e left join emp e2 on e.managerid = e2.id;`


### 联合查询 union union all

对于union查询，就是把多次查询的结果合并起来，形成一个新的查询结果集

``` sql
select 字段列表 from 表a
union [all]
select 字段列表 from 表b
```

**注意：**
1. 对于联合查询的多张表的列数必须保持一致，字段类型也需要保持一致
2. union all 会将全部的数据直接合并在一起，union会对合并之后的数据去重

**例子**
将薪资低于5000的员工和年龄大于50岁的员工全部查询出来
``` sql
select * from emp where salary < 5000
union
select * from emp where age > 50;

```

### 子查询

-  sql语句中嵌套select语句称为嵌套查询，又称子查询。
`select * from t1 where column1 = (select column1 from t2);`

子查询外部的语句可以是insert / update / delete / select任意一个

- 根据子查询结果不同分为
1. 标量子查询（子查询为单个值）
2. 列子查询（子查询结果为一列）
3. 行子查询（子查询结果为一行）
4. 表子查询（子查询结果为多行多列）

- 根据子查询位置，分为 where之后、from之后、select之后

#### 标量子查询

返回的结果是单个值（数字、字符串、日期等）

- 常见操作符号 = 、<>  、   >   、 >=   、  <    、    <= 

**例子**
- 查询销售部所有员工的信息
`select * from emp e where dept_id = (select id from dept where name = '销售部');`

- 查询小明入职之后的员工
`select * from emp where entrydate > (select entrydate from emp where name = '小明' );`


#### 列子查询

返回的结果是一列（可以是多行）

- 常见操作符号 in (在指定的集合范围内，多选一)、 not in(不在指定的集合范围内) 、 any（子查询返回的列表中，有任意一个满足即可） 、 some（与any相同） 、 all（子查询返回的列表的所有值都必须满足）

**例子**
- 查询销售部和市场部所有员工的信息
`select * from emp where dept_id in (select id from dept where name = '销售部' or name  = '市场部');`

- 查询比财务部所有员工工资都高的员工
`select * from emp where salary > all (select salary from emp where  dept_id = (select id from dept where name = '财务部'));`

-  查询比研发部其中任意一个人工资高的员工
`select * from emp where salay > any (select salary from emp where dept_id = (select id from dept where nam = '研发部'));`


#### 行子查询

返回的结果是一行（可以是多列）

- 常见操作符 = 、<> 、in 、not in

**例子**
- 查询与小明的薪资及直属领导相同的员工信息
`select * from emp where (salary, managerid) = (select salary, managerid from emp where name = '小明' ); `


#### 表子查询

返回的结果是一张表

- 常见操作符 in

**例子**
- 查询与小明、小红的职位和薪资相同的员工
`select * from emp where (job, salary) in (select job, salary from emp where name = ‘小明’ or name='小红');`

- 查询入职日期是2026-01-01 之后的员工信息及其部门信息
查询入职日期是2026-01-01 之后的员工
`select * from emp where entrydate > '2026-01-01'`
将上述查询的条件作为一张表
`select * from (select * from emp where entrydate > '2026-01-01')  e left join dept d on e.dept_id = d.id`

### 多表查询案例

- 内连接
1. 查询员工的姓名、年龄、部门信息
`select e.name, e.age, d.name from emp e, dept d where e.dept_id = d.id;`

2. 查询年龄小于30岁的员工姓名、年龄、部门
`select e.name, e.age, d.name from emp e inner join dept d on e.dept_id = d.id where e.age < 30;`

3. 查询拥有员工的部门id、部门名称
查出来有重复的，需要加distinct去重
`select distinct d.id, d.name from emp e, dept d where e.dept_id = d.id;`

- 外连接
4. 查询所有年龄大于40的员工，及其归属部门名称，如果员工没有分配部门也要展示
`select e.*, d.name from emp  e left join dept d on e.dept_id = d.id where e.age > 40;`

- 内连接
5. 查询所有员工的工资等级
连接条件： e.salary >= salgrade.losal and e.salary <= salgrade.hisal
`select e.*, s.grade, s.losal, s.hisal from emp e , salgrade s where e.salary > = s.losal and e.salary <= s.hisal;`

`select e.*, s.grade from emp e , salgrade s where e.salary between s.losal and s.hisal;`

- 内连接

6. 查询研发部所有员工的信息及工资等级
关联n张表，连接条件为n-1
表： emp 、salgrade 、dept
连接条件： e.salary between s.losal and s.hisal， e.dept_id = dept.id
查询条件：dept.name = ‘研发部’

- 查询研发部所有员工的信息
`select * from emp e , dept d where e.dept_id = (select id from dept where dept.name = '研发部');`
- 查询研发部所有员工的信息及工资等级
`select e.*, s.grade from emp e , dept d. salgrade s  where e.dept_id = d.id and (e.salary between s.losal and s.hisal) and d.name = '研发部';`

7. 查询研发部员工的平均薪资
`select avg(e.salary) from emp e , dept d where e.dept_id = d.id and d.name = '研发部';`

- 子查询
8. 查询工资比小明高的员工
`select salary from emp where name = '小明';`

`select *  from emp e where e.salary > (select salary from emp where name = '小明');`

9. 查询比平均薪资高的员工
`select avg(salary) from emp;`

`select * from emp e where salary > (select avg(salary) from emp);`


10. 查询低于本部门平均薪资的员工
`select avg(e.salary) from emp e where e.dept_id = 1;`

`select * from emp e1 where salary < (select avg(e.salary) from emp e where e.dept_id = e1.dept_id)`

- select 之后可以出现子查询
11. 查询所有的部门信息，并统计部门的员工人数
`select d.id,d.name, (select count(*) from emp e where e.dept_id = d.id) '人数' from dept d;`

12. 查询所有学生的选课情况，显示出学生名称、学号、课程名称
表：student course student_course
连接条件： s.id = sc.studentid, c.id = sc.courseid
`select s.name, s.no, c.name from student s student_course sc, course c where s.id = sc.studentid and sc.courseid = c.id;`








    