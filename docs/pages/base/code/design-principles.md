# 设计模式

## 什么是设计模式

- Design Pattern 
- 一种针对于程序设计的代码封装和集成的方法论

## 设计模式的目标

1. 提升代码的可读性
2. 提升代码的复用性
3. 提升代码的可扩展性
4. 提升代码的可靠性

## 设计模式的特点

1. 设计模式基本上是服务于面向对象的编程模式
2. 设计模式的指导意见影响着函数式编程的设计

## 设计模式最终要达到的目的

1. 高内聚
2. 低耦合

### 什么是高内聚

- 集成的概念：一个程序任务中应该有多个子程序服务于大程序的目标达成

### 什么是低耦合

- 程序与程序之间，其运行尽量相互之间不影响，做到一个程序的运行依赖外部参数信息的程度要尽量低

## 7大设计原则

- Design Principles
1. 单一职责原则 Single Responsibility Principles - SRP
   - 一个类应该只负责一个功能任务，其内部不应该完成与该功能任务不相关的其他任务

示例：用户登录
User类应该只完成登录功能，生成图片验证码和验证图片验证码应单独写一个类
``` ts
class Capche {
  private capche: string;

  public generateCapche () {
    const capche = 'DESIGN'
    this.capche = capche
    return this.capche
  }

  public validCapche (capche: string) {
    return capche === this.capche
  }
}

class User {
  private capche: Capche
  public login (usename: string, password: string, capche: string) {
    // 验证图片验证码是否正确
    if (!this.capche.validCapche(capche)) return '验证图片验证码错误'
    // 登录
  }
}
```

2. 接口隔离原则 Interface Segregation Principle - ISP
接口：是一种对于任务的抽象，提前对类进行设计
   - 接口应该颗粒度高，细小的接口可以有效的进行实现的隔离，接口与类的扩展变得更加容易，维护更加简单，所以尽量避免接口大，定义全，管理类多

示例：用户登录
考虑普通用户和管理员是否由同一个接口管理，如下的示例用一个接口管理就不符合接口隔离原则，颗粒度需要更高
``` ts
interface IUser {
  checkAuth (userId: number) : boolean;
  login (mobileNumber: string, phoneCode: string): void;
  register (username: string, password: string): void;
}

interface IAdmin {
  checkAuth (userId: number, passKey: stirng): boolean;
  login (mobileNumber: string, phoneCode: string): void;
}

class UserImpl implements IUser {
  checkAuth (userId: number) {
    return true
  }

  login (mobileNumber: string, phoneCode: string) {

  }

  register (username: string, password: string) {

  }
}

class AdminImpl implements IAdmin {

  checkAuth (userId: number) {
    return true
  }

  login (mobileNumber: string, phoneCode: string) {

  }
}
```

3. 依赖倒转原则 Dependence Inversion Principle - DIP
理科中我们说的概念是通过实践总结处理的，但在程序设计中应该返过来，先考虑设计再考虑实现
   - 实现要依赖抽象，程序设计中，应该先考虑抽象的接口，再考虑如何实现接口中的任务

示例：订单
先设计接口，再实现
``` ts
interface IOrder {
  generateOrder(productId: string): void;
  payforOrder(orderId: string): void
}

class OrderImp implements IOrder {
  generateOrder (productId: string) {

  }
  payforOrder (orderId: string) {

  }
}
```

4. 里氏替换原则 Liskov Substitution Principle - LSP
   - 子类继承父类的时候，可以在继承的基础上新增方法，但尽量不要重写父类方法
示例：登录
子类继承父类，有相同的方法时，尽量不要重写父类的方法（公共类可看具体情况）
``` ts
class User {
  public login (username: string, password: string) {

  }

  public register (username: string, password: string) {

  }
}

class CustomUser extends User {
  // 手机号登录
  public loginByMobile (phone: string, mobileCode: string) {

  }
}

```

5. 开闭原则 Open Close Principle - OCP
对写好的代码关闭，对扩展开放
   - 如果需求变化了，不是修改现有的代码封装，而是在现有代码封装的基础上进行扩展、
示例：校验手机号
``` ts
class User {
  // 之前的逻辑
  public changeName (userId: string, callback: Function) {
    // todo....
    callback && callback()
  }

  // 修改了需求不动原来的代码
  public changeNameWithCode (userId: string, code: string) {
    this.changeName(userId)
    // todo.... 
  }

}

```

6. 迪米特法则 Law of Demeter - LOD
两个依赖的对象，访问其中一个对象时，不要关心对象中的属性或方法中的部分逻辑，而是只关注方法
   - 对象与对象之间应该保持最少的依赖，访问其他对象的最小单位应该是方法，而不是属性和内部逻辑
示例：手机验证码登录
``` ts
class User {
  private sms: Sms
  private code: string
  constructor (sms: Sms) {
    this.sms = new sms();
  }
  public generateMobileCode (mobileNumber: string ) {
    this.code = this.sms.generateCode(mobileNumber)
  } 
  public login (mobileNumber: string , moblieCode) {
    if (this.sms.validCode(this.code)) {
      // todo
    }
  }
}

class Sms {
  private code: string;

  public generateCode (mobileCode: string) {
    this.code = '1111'
    return this.code;
  }

  public validCode (code: string) {
    return this.code === code;
  }
}

```

7. 合成复用原则 Composite Resuse Principle - CRP
   - 类的继承实际上增加了功能与功能之间的耦合性，所以应该优先使用对象组合或聚合，而不是通过继承的方式实现代码的复用
示例：登录
尽量不要使用继承实现复用，解除代码耦合
``` ts
class User {
  private sms: Sms
  private valid: Validator
  private userService: UserService

  constructor(sms: Sms, valid: Validator, userService: UserService) {
    this.sms = sms
    this.valid = valid 
    this.userService = userService
  }
  public login (mobileNumber: string, mobileCode: string) {
    // 验证码校验
    if (!this.sms.validCode(mobileCode)) return 
    // 手机号校验
    if (!this.valid.validPhone(mobileNumber)) return 
    // 保存数据库
    this.userService.login(mobileNumber: string, mobileCode: string)
  }
}

class Sms {
  private code: string;

  public generateCode (mobileCode: string) {
    this.code = '1111'
    return this.code;
  }

  public validCode (code: string) {
    return this.code === code;
  }
}

class Validator {
  public validPhone (phone: string) {
    return phone.length === 11
  }
}

class UserService {
  public login (mobileNumber: string, mobileCode: string) {
    // 保存到数据库
  }
}

```