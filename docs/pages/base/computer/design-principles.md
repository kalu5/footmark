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

## 设计模式的种类

总共23种

1. 创建型模式：创建类实例对象的方式
   - 单例
   - 工厂
   - 抽象工厂
   - 原型
   - 建造者

2. 结构型模式：类或对象有机结合形成一种复合型的对象结构
   - 适配器
   - 装饰器
   - 桥接
   - 外观
   - 享元
   - 代理
   - 组合

3. 行为型模式：对象之间的交互方式
   - 模板
   - 命令
   - 状态
   - 访问者
   - 观察者
   - 迭代器
   - 备忘录
   - 中介者
   - 解释器
   - 策略
   - 职责链

## 单例模式：Singleton pattern

- 定义： 类只有唯一一个对象实例
- 创建要求：
1. 类中有一个静态的创建唯一实例的方法（不可使用new创建对象）
2. 构造方法私有
3. 类只能通过静态方法的执行创建并返回唯一实例

### 饿汉模式
导入当前类的时候就已经创建实例，可能会造成空间浪费
``` ts
class User {
  private instance: User

  static {
    instance = new User()
  }

  private constructor() {

  }

  public static getInstance () {
    return User.instance
  }
}

const user = User.getInstance();
```

### 懒汉模式
只在需要的时候才创建实例
``` ts
class User {
  private static instance: User

  private constructor () {

  }

  public static getInstance () {
    if (User.instance == null) {
      User.instance = new User()
    }
    return User.instance
  }
}

const user = User.getInstance();
```

案例：购物车
``` ts
interface IProductInfo {
  goodsId: string;
  productName: string;
}
interface IShoppingCart {
  add (productInfo: IProductInfo): string;
  remove (goodsId: string): boolean;
  changeNum (num: number, goodsId: string): void;
}

class ShoppingCart implements IShoppingCart {
  private static instance: ShoppingCart
  private cartList: IProductInfo[] = []
  private constructor () {

  }
  add (productInfo: IProductInfo): string {
    this.cartList.unShift(productInfo)
  }

  remove (goodsId: string) {
    const index = this.cartList.findIndex(cart => cart.goodsId === goodsId)
    this.cartList.splice(index, 1)
    return true
  }

  changeNum (num: number, goodsIs: string) {
    this.cartList.forEach(cart => {
      if (cart.goodsId === goodsId) {
        cart.num = num
      }
    })
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new ShoppingCart()
    }
    return this.instance
  }
}


const cart = ShoppingCart.getInstance()
cart.add ({
  goodsId: '98999',
  goodsName: 'Model3'
})

``` 

## 工厂模式

工厂模式（Factory Pattern）是软件开发中一种创建型设计模式，用于创建对象的实例。它通过将对象创建的逻辑与使用对象的逻辑分离，使得代码更具可扩展性和维护性。

**特点：**

遵循了设计原则中的单一职责原则（工厂方法创建不同的操作类对象，不同的操作类实现不同的功能）


示例：实现一个简单计算器

设计计算器类
``` ts
interface ICalculatorOption {
  //开始数字
  startNumber: number;
  // 计算符号
  operator: string;
  // 结束数字
  endNumber: number;
}

// 计算器类
class Calculator {
  private startNumber: number;
  private operator: string;
  private endNumber: number;
  constructor(opt: ICalculatorOption) {
    this.startNumber = opt.startNumber;
    this.operator = opt.operator;
    this.endNumber = opt.endNumber;
  }

  calculate() {
    const result = Calculate.calculateOperator()
    this.result = result;
    return this.result;
  }
}

// 计算类
class Calculate extends Calculator {
  static calculteOperator() {
    this.result = 0;
    switch(this.operator) {
      case '+': 
        this.result = createAddCalculate().add()
        break;
      case '-':
        this.result = createMinusCalculate().minus()
        break;
      case '*':
        this.result = createMultiplyCalculate().multiply()
        break;
      case '/':
        this.result = createDivideCalculte().divide()
        break;
      default:
        break;
    }
    return this.result;
  }
}

// 加法类
class AddCalCulate extends Calculator {
  add() {
    return this.startNumber + this.endNumber;
  }
}

// 减法类
class createMinusCalculate extends Calculator {
  minus() {
    return this.startNumber - this.endNumber;
  }
}

// 乘法类
class createMultiplyCalculate extends Calculator {
  multiply() {
    return this.startNumber * this.endNumber;
  }
}

// 除法类
class createDivideCalculate extends Calculator {
  divide() {
    return this.startNumber / this.endNumber;
  }
}

class CalculatorFactory {
  static createCalculator(opt: ICalculatorOption) {
    return new Claculator(opt)
  },
  static createAddCalculate() {
    return new AddCalCulate();
  },
  static createMinusCalculate() {
    return new MinusCalculate();
  },
  static createMultiplyCalculate() {
    return new MultiplyCalculate();
  },
  static createDivideCalculate() {
    return new DivideCalculate();
  }
}

```

使用
``` ts
const calculator = CalculatorFactory.createCalculator({
  startNumber: 1,
  operator: '+',
  endNumber: 2
});

calculator.calculate();
```

## 策略模式

### if/else 优化一

``` js

/**
 * 设计模式---策略模式
 * 1. 优化if
*/
// 优化if--1

(function () {
    function computed (num) {
        if (num === 90) {
            return 'A'
        } else if ( num === 80 ) {
            return 'B'
        } else if (num === 70) {
            return 'C'
        } else if (num === 60) {
            return 'D'
        } else if (num === 50) {
            return 'E'
        } else if (num === 40) {
            return 'F'
        } else if (num === 30) {
            return 'G'
        } else if (num === 20) {
            return 'H'
        } else if (num === 10) {
            return 'I'
        } else if (num === 0) {
            return 'J'
        }
    }

    console.log (computed (40))

    const count = {
        90: 'A',
        80: 'B',
        70: 'C',
        60: 'D',
        50: 'E',
        40: 'F',
        30: 'G',
        20: 'H',
        10: 'I',
        0: 'J'
    }

    function computedNum (num) {
        return count[num];
    }

    console.log (computedNum(40))

    
})();

// 优化if---2表单提交

(function () {
    const oSubmit = ducoment.getElementById('#btn');
    oSubmit.addEventListener('click', submitForm, false);
    function submitForm () {
        if (userName == ''){
            console.log ('用户名不能为空');
            return;
        }

        if (userName.length > 6) {
            console.log ('用户名的长度不能大于6位');
            return;
        }

        if (passWord == '') {
            console.log ('密码不能为空');
            return;
        }

        if (passWord.length > 6) {
            console.log ('密码的长度不能大于6位')
            return;
        }

        console.log ('登录成功');
    }

    // 提取优化对象
    const loginForm = {
        notEmpty (val, errMsg) {
            if (val === '') {
                return errMsg;
            } else {
                return val;
            }
        },
        sureLen (val, len, errMsg) {
            if (val.length > len) {
                return errMsg;
            } else {
                return val;
            }
        }
    }

})();

```

### if/else 优化二

``` js 

/**
 * 策略模式 --> 表单验证
 * */
import EventBus from './publish';

const oUser = document.getElementById('username'),
	oPass = document.getElementById('password'),
	oMobile = document.getElementById('mobile'),
	oSubmit = document.getElementById('submit');

const strategies = {
	isEmpty: function (val, errMsg) {
		if (val === '') {
			return errMsg;
		}
		return val
	},
	minLength: function (val, len, errMsg) {
		if (val.length < len) {
			return errMsg;
		}
		return val;
	},
	mobileFormat: function (val, errMsg) {
		if (!/(^1[3|5|8][0-9]{9}$)/.test(val)) {
			return errMsg;
		}
		return val;
	}
}

class Validetor extends EventBus {
	constructor() {
		super();
		this.cache = [];
	}

	add(dom, rules) {
		rules.forEach((rule) => {
			const { strategie, errMsg } = rule;
			const strategyArr = strategie.split(':');
			/** 
			没有使用发布订阅之前
			this.cache.push(function () {
				const strategy = strategyArr.shift();
				strategyArr.unshift(dom.value)
				strategyArr.push(errMsg)
				return strategies[strategy].apply(dom, strategyArr);
			})
			*/
			// 使用发布订阅模式
			const strategy = strategyArr.shift();
			this.describe(strategy, () => {
				strategyArr.unshift(dom.value)
				strategyArr.push(errMsg)
				return strategies[strategy].apply(dom, strategyArr);
			});
		})
	}

	start() {
		/**
		 * 没有使用发布订阅模式
		*/
		//return this.cache.map(item => item())
		// 使用发布订阅模式
		return Object.keys(strategies).reduce((acc, key) => {
			acc.push({ [key]: this.publish(key) })
			return acc;
		}, [])
	}
}

// 每次提交重新给一个校验器
const ValidetorFunc = () => {
	const valid = new Validetor();
	valid.add(oUser, [
		{ strategie: 'isEmpty', errMsg: '用户名不能为空' },
		{ strategie: 'minLength:6', errMsg: '用户名长度不能小于6' }
	]);
	valid.add(oPass, [
		{ strategie: 'minLength:6', errMsg: '密码长度不能小于6' }
	]);
	valid.add(oMobile, [
		{ strategie: 'mobileFormat', errMsg: '手机号不合法' },
	]);
	return valid.start();
}

oSubmit.addEventListener('click', function (e) {
	e.preventDefault();
	const res = ValidetorFunc();
	console.log(res, 10);
}, false)

```

## 发布订阅模式

``` js

/**
 * 设计模式
 * 发布订阅模式
*/

class EventBus {
    constructor () {
        this.clientList = {};
    }

    describe (key, callback) {
        (!this.clientList[key]) && (this.clientList[key] = []);
        this.clientList[key].push(callback);
    }

    publish () {
        const key = Array.prototype.shift.call(arguments),
              callbacks = this.clientList[key];
        let res;
        for (let i = 0; i < callbacks.length; i++) {
            res = callbacks[i].apply(this, arguments);
        }
        return res;
    }
}

export default EventBus;

```







