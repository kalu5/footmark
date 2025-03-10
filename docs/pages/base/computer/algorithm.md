# 数据结构与算法

## 动态规划问题

### 常见题型

- 动规基础
- 背包问题
- 打家劫舍
- 股票问题
- 子序列问题

### 基础理论

**动规五部曲**

- 理解dp(状态转移)数组以及下标含义：`dp[i][j]`
- 递推公式（很重要）
- dp数组如何初始化
- 遍历顺序（注意）
- 打印DP数组（方便寻找错误问题的原因）

### leetCode题

#### 1. 斐波那契数列

求第n个斐波那契数列的值
1 1 2 3 5 8 
对应 
第0个： 1
第1个： 1
第2个： 2
第3个： 3

动规5部分析
- 确定dp[i]的含义：第i个斐波那契数值为dp[i]
- 递推公式：dp[i] = dp[i-1] + dp[i-2]
- dp数组如何初始化：dp[0] = 1 dp[1] = 1
- 遍历顺序：从前往后
- 打印dp数组

代码实现
``` ts
function feicci(n: number) {
  if (n < 0) return
  const dp = []
  dp[0] = 1
  dp[1] = 1
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[n]
}

```

#### 2. 爬楼梯问题

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

``` ts
function climbStairs(n: number): number {
    /**
    dp[i] i种不同的方法可以爬到楼顶
    公式：dp[i] = dp[i-2] + dp[i-1]
    初始化：dp[1] = 1 dp[2] = 2
    遍历顺序：正序
    */
    if (n <= 0) return 
    const dp = []
    dp[1] = 1
    dp[2] = 2
    for (let i = 3 ; i <= n; i++) {
        dp[i] = dp[i-2] + dp[i-1]
    }
    return dp[n]
};

```

#### 3. 打家劫舍

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。

``` ts
function rob(nums: number[]): number {
  /**
   * dp[i]: 偷第i间房以及偷之前的总和的最大金额
   * 递推公式：dp[i] = Math.max(dp[i-2] + nums[i], dp[i-1])
   * 初始化： dp[0] = nums[0]
   *        dp[1] = Math.max(nums[0], nums[1])
   * 遍历顺序：正序
  */
  if (!nums.length) return 0;
  const dp = [nums[0], Math.max(nums[0], nums[1])]
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i-2] + nums[i], dp[i-1])
  }
  return dp[nums.length - 1]
}
```

#### 4. 最长递增子序列

给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。

``` ts
function lengthOfLIS(nums: number[]): number {
  /**
   * dp[i]: 以nums[i]结尾的最长递增子序列的长度
   * 递推公式: dp[i] = Math.max(dp[i-1] + 1, dp[i])
   * 初始化dp[i] = 1
   * 遍历顺序：正序
  */
  if (!nums.length) return 0;
  if (nums.length < 2) return 1;
  let len = 1;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[j] + 1, dp[i])
      }
    }
    len = Math.max(len, dp[i])
  }
  return len;
}
```

## 树 

通过链表来链接
1. 多叉树 -> children

``` js 

const tree = {
  val: 'root',
  children: [
    {
      val: '1',
      children: [
        val: '11',
        children: []
      ]
    },
    {
      val: '2',
      children: [
        val: '22',
        children: []
      ]
    }
  ]
}
```

2. 二叉树 -> left, right
```js
const tree = {
  val: 'root',
  left: {
    val: '1',
    left: {
      val: '11',
      left: {},
      right: null
    },
    right: {
      val: '12',
      left: null,
      right: null
    }
  },
  right: {
    val: '2',
    left: {
      val: '21',
      left: null,
      right: null
    },
    right: {
      val: '22',
      left: null,
      right: null
    }
  }
}
```



### 深度优先遍历（搜素）

从根出发，尽可能深的搜素树的节点

**技巧：**
1. 访问根节点
2. 对根节点的children挨个进行深度优先搜素

### 广度优先遍历（搜索）

从根出发，优先访问离根节点最近的节点

**技巧：**
1. 新建一个队列，把根节点入队
2. 把队头出队
3. 把队头的children挨个入队
4. 重复2和3直到队列为空

### 二叉树

每个根节点都有两个子节点

           1         
        2     3
      4   5   6  7


#### 先序遍历

根 左 右

#### 中序遍历

左 根 右

#### 后序遍历

左 右 根

代码实现：

``` ts
interface Head {
  val: string,
  children: Head[]
}

interface TwoTree {
  val: string,
  left: TwoTree | null,
  right : TwoTree | null
}
// 深度优先遍历
// 递归
let res = []
export function deepEachTree (tree: Head) {
  const value = tree.val
  res.push(value)
  tree?.children?.length && tree.children.forEach(child => deepEachTree(child))
  return res
}

// 广度优先
// 队列
export function widthEachTree (tree: Head) {
  const res = []
  const queue = [tree]
  while(queue.length) {
    const head: Head = queue.shift()
    res.push(head.val)
    head.children.forEach(child => {
      queue.push(child)
    })
  }
  return res
}

// 二叉树
// 两种方式，递归和栈

// 先序遍历 递归 
export function  prevEach (tree) {
  const res = []
  const dump = (tree) => {
    res.push(tree.val)
    tree.left && dump(tree.left)
    tree.right && dump(tree.right)
  }
  dump(tree)
  return res
}

// 先序遍历 栈
export function  prevEachStack (tree) {
  if (!tree) return []
  const res = []
  const stack = [tree]
  while(stack.length) {
    const root = stack.pop()
    root && res.push(root.val)
    root && root.right && stack.push(root.right)
    root && root.left && stack.push(root.left)
  }
  return res
}

// 中序遍历 递归 
export function middleEach (tree) {
  const res = []
  const dump = (tree) => {
    tree.left && dump(tree.left)
    res.push(tree.val)
    tree.right && dump(tree.right)
  }
  dump(tree)
  return res
}

// 中序遍历 栈
export function middleEachStack (tree) {
  if (!tree) return []
  const res = []
  const stack = []
  let root = tree
  while(stack.length || root) {
    
    while(root) {
      stack.push(root)
      root = root.left
    }
    const n = stack.pop()
    res.push(n.val)
    root = n.right
  }
  return res
}

// 后序遍历 递归 
export function nextEach (tree) {
  const res = []
  const dump = (tree) => {
    tree.left && dump(tree.left)
    tree.right && dump(tree.right)
    res.push(tree.val)
  }
  dump(tree)
  return res
}

// 后序遍历 栈
export function nextEachStack (tree) {
  if (!tree) return []
  const res = []
  const stack = [tree]
  /**
   * 1. res  [a]
   *    stack [{left}, {right}]
   * 2. res [e,a]
   *    stack [{left}, {left}, {right}]
   * 3. res [g, e, a]
   *    stack [{left}, {left}]
   * 4. res[f, g, e, a]
   *    stack [{left}]
   * 5. res[b, f, g, e, a]
   *    stack [{left}, {right}]
   * 6. res[d, b, f, g, e, a]
   *    stack [{left}]
   * 7.  res[c, d, b, f, g, e, a]
   *    stack []
   * 
   * lastRes = [c, d, b, f, g, e, a]
  */
  while(stack.length) {
    const root = stack.pop()
    root && res.unshift(root.val)
    root.left && stack.push(root.left)
    root.right && stack.push(root.right)
  }
  return res
}

// 二叉树的最小深度
export function minDepth (root: TwoTree) {
  if (!root) return 0

  const stack: [TwoTree, number][] = [[root, 1]]

  while (stack.length) {
    const [tree, num] = stack.shift()
    if (!tree.left && !tree.right) return num
    tree.left && stack.push([tree.left, num + 1])
    tree.right && stack.push([tree.right, num + 1])
  }

}

// 二叉树的最大深度
export function maxDepth (root: TwoTree) {
  if (!root) return 0

  const stack = [root]
  let num = 0

  while (stack.length) {
    let len = stack.length
    num ++
    while(len --) {
      const tree = stack.shift()
      tree.left && stack.push(tree.left)
      tree.right && stack.push(tree.right)
    }
  }

  return num
}
```

## 堆

堆都能用树表示

### 二叉堆

用完全二叉树（没有右子节点）来表示（利用数组来实现）
`[1, 2, 3, 4, 5, 6]`

``` js
// 完全二叉树
       1
    2     3
  4  5   6

// 满二叉树

       1
    2     3
  4  5   6  7
```

***注意:***
1. 父子节点通过索引计算
2. 叶子节点从左右填满才能开始填下一层,这就保证了不需要对数组整体进行大片移动，删除一个元素时要把最后一个叶子节点补充到根节点
3. 计算父子节点
   左： 2 * index + 1
   右： 2* index + 2
   父： Math.floor(index - 1) / 2

### 最小堆

根节点一定小于左右节点（左右节点不管他们的大小）

代码实现：
``` ts
export class MinHeap {
  heap: number[] = []

  // 添加元素
  push(item: number) {
    this.heap.push(item)
    // 上移当前元素
    // 当前元素的下标
    const curIndex = this.heap.length -1 
    this.up(curIndex)
  }

  // 上移
  /**
   * 如果只有一个元素不需要移动
   * 判断当前元素是否小于父元素，小于需要移动位置(交换)
  */
  up(index: number) {
    if (index === 0) return 
    const parentIndex = this.getParentIndex(index)
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex, index)
      // 多次换位
      this.up(parentIndex)
    }
  }

  // 换位置
  swap(i: number, j: number ) {
    let temp:number = this.heap[i]
    this.heap[i] = this.heap[j]
    this.heap[j] = temp
  }

  // 删除堆顶
  /**
   * 将尾删除赋值给堆顶
   * 下移重新组织结构
  */
  pop() {
    // [8, 2, 3, 7]
    this.heap[0] = this.heap.pop()
    this.down(0)
  }

  // 下移（往后移动）
  down(index: number) {
    const leftIndex = this.getLeftIndex(index)
    const rightIndex = this.getRightIndex(index)
    if (this.heap[leftIndex] < this.heap[index]) {
      // [2, 8, 3, 7]
      this.swap(leftIndex, index)
      // 多次移动
      this.down(leftIndex)
    }
    if (this.heap[rightIndex] < this.heap[index]) {
      this.swap(rightIndex, index)
      this.down(rightIndex)
    }
    

  }

  // 左子节点
  getLeftIndex (index: number) {
    return index * 2 + 1
  }

  // 右子节点
  getRightIndex(index: number) {
    return index * 2 + 2
  }

  //父节点
  getParentIndex (index: number) {
    return Math.floor((index - 1) / 2)
  }

  //获取堆顶
  peek() {
    return this.heap[0]
  }

  // 长度
  size() {
    return this.heap.length
  }

}
```

## 数组排序

``` ts
type Arr = number[]

export function bubbleSort(arr:Arr): Arr {
  const len = arr.length;
  if (!len) return arr
  for(let i = 0; i < len -1; i++) {
    for(let j=0; j < len -1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  return arr
}

export function selectSort(arr: Arr): Arr {
  const len = arr.length;
  if (!len) return arr;
  let minIndex = 0;
  for(let i = 0 ; i < len-1; i++) {
    minIndex = i
    for(let j = minIndex; j < len-1; j++) {
      if (arr[minIndex] > arr[j+1]){
        [arr[minIndex], arr[j+1]] = [arr[j+1], arr[minIndex]]
      }
    }
  }
  return arr
}

export function insertSort(arr: Arr): Arr {
  const len = arr.length;
  if (!len) return arr
  let temp 
  for (let i = 1; i < len; i++) {
    let j = i;
    temp = arr[i]
    while(j > 0 && arr[j-1] > temp) {
      arr[j] = arr[j-1]
      j--
    }
    arr[j] = temp
  }
  return arr
}

export function concatSort(arr: Arr): Arr {
  const len = arr.length;
  if (len < 2) return arr;
  const middle = Math.floor(len / 2);
 
  const merge = (
    leftArr: Arr,
    rightArr: Arr
  ) => {
    let newArr = []
    while(leftArr.length && rightArr.length) {
      newArr.push(leftArr[0] <= rightArr[0] ? leftArr.shift(): rightArr.shift())
    }
    
    return newArr.concat(leftArr).concat(rightArr)
  }

  return merge (concatSort(arr.slice(0, middle)),concatSort(arr.slice(middle)))
}

export function quickSort(arr: Arr): Arr {
  const len = arr.length;
  if (len <= 1) return arr
  const middle = Math.floor(len / 2)
  const middleItem = arr.splice(middle,1)[0]
  let left = []
  let right = []

  for (let i = 0; i < len -1 ; i++) {
    if (arr[i] < middleItem) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([middleItem], quickSort(right))
}

export function findTwo(arr: Arr, target): number {
  const len = arr.length;
  if (!len) return -1
  let start = 0;
  let end = len -1;
  while (start <= end) {
    const midIndex = Math.floor((start + end) / 2)
    const mid = arr[midIndex]
    if (target === mid) return midIndex
    if (target > mid) {
      start += 1
    } else {
      end = midIndex
    }
  }
  return -1
}
```