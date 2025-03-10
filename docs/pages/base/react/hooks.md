# React Hooks 

学习源码目的：
1. 更加深入了解原理，有更多的解决方案
2. 学习设计思想，找到更多的解决方案

## UseState 

对状态进行管理，从而更新视图

``` tsx
const [count, setCount] = useState(0)

setCount(1)

setCount((count) => count+1)

```

## UseReducer

对状态的操作进行收集，方便管理和维护

```tsx
function countReducer(count, {type, payload}) {
  switch(type) {
    case 'Add':
      count += 1
      break;
    case 'Minus':
      count -= 1
      break;
    break;
  }
}
const [count, dispatch] = useReducer(countReducer, 0)

dispatch({type: 'Add', payload: 1})
```

## UseEffect

对生命周期进行简化，处理副作用（axios请求，修改dom,计时器，console等）
本质是主动收集依赖

**问题一、第二个参数值问题：**
1. undefined  -> 任何状态改变都会执行回调      -> 组件更新生命周期componentDidUpdate
2. 不是数组     -> 报警告
3. 空数组      -> 回调只会在函数组件调用时执行一次 -> componentDidMount
4. 有元素的数组，元素为状态  -> 状态更新回调执行一次 -> componentDidUpdate:特定状态的更新

```tsx
//组件更新生命周期componentDidUpdate 
useEffect(()=> {

})

//警告
useEffect(()=> {

}, {})

//componentDidMount
useEffect(()=> {

}, [])

//  componentDidUpdate:特定状态的更新
useEffect(()=> {

}, [count])

```

**问题二、返回函数清除副作用**

``` tsx
useEffect(()=> {

  // componentWillUnmout
  // 清除副作用
  return () => {

  }
})
```

**问题三、处理异步请求**
不能直接在回调中使用async(返回的是一个清除副作用的函数),应使用自执行函数
``` tsx
// 错误的写法
useEffect(async () => {
  const data = await axios.get()
})

// 正确写法
useEffect(() => {
  ;(async function (){
    const data = await axios.get()
  })()

  return () => {

  }
})
```

**问题四、更新一个state后更新另一个state**

``` tsx
const [count,setCount] = useState(0)
const [newCount, setNewCount] = useState(1)

useEffect(() => {
  setNewCount((newCount) => newCount + count)
}, [count])
```

## Memo和UseMemo

### Memo

解决父组件状态更新，避免子组件（未绑定当前状态，不需要更新）不必要的更新

``` tsx
// 不用memo时，当count1改变后，Child会重新执行，使用memo可解决此问题
const Child = memo((props) => {
  console.log ('called')
  return (
    <div>
      <h1>{props.count2}</h1>
    </div>
  )
})

const App = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  return (
    <div>
      <h1>{ count1 }</h1>
      <button onClick={setCount1(count1 + 1)}>加</button>
      <Child count2={count2}></Child>
    </div>
  )
}
```

**memo失效问题：**
memo比较的是浅引用，引用更新，组件重新执行，当绑定的是一个引用值时失效

``` tsx
/**
 * 当状态是引用值时会失效
 * 
 * app组件传递的是引用值
 * const data = { count2 }
 * 
 * <Child data={data} />
 * */ 
const Child = memo((props) => {
  console.log ('called')
  return (
    <div>
      <h1>{props.count2}</h1>
    </div>
  )
})

const App = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const data = {
    count2
  }
  return (
    <div>
      <h1>{ count1 }</h1>
      <button onClick={setCount1(count1 + 1)}>加</button>
      <Child data={data}></Child>
    </div>
  )
}
```

### 解决memo失效，使用UseMemo

``` tsx
const Child = memo((props) => {
  console.log ('called')
  return (
    <div>
      <h1>{props.count2}</h1>
    </div>
  )
})

const App = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const data = useMemo({
    count2
  }, [count2])
  return (
    <div>
      <h1>{ count1 }</h1>
      <button onClick={setCount1(count1 + 1)}>加</button>
      <Child data={data}></Child>
    </div>
  )
}
```

### UseMemo相当与Vue中的computed

``` tsx
const App = () => {
  const [count1, setCount1] = useState(0)

  const computedCount = useMemo(() => count1 * 2, [count1])

  return (
    <div>
      <h1>{ count1 }</h1>
      <h2>{ computedCount }</h2>
    </div>
  )
}
```

## UseCallback

当子组件传递的是一个函数时，父组件状态更新，子组件会重新执行，解决方法，使用useCallback

``` tsx
const Child = memo((props) => {
  console.log ('called')
  return (
    <div>
      <h1>{props.count2}</h1>
      <button onClick={props.setCount2(2)}></button>
    </div>
  )
})

const App = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  const newSetCount = useCallback(() => setCount2,[])

  return (
    <div>
      <h1>{ count1 }</h1>
      <button onClick={setCount1(count1 + 1)}>加</button>
      <Child count2={count2} setCount2={newSetCount}  ></Child>
    </div>
  )
}
```