# 可视化大屏开发技术方案设计

## 开发规范

1. 浏览器兼容性

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

2. 屏幕分辨率适配

- 适配 1k/2k/4k 屏幕分辨率（屏幕两边无留白）

3. 统一使用 ECharts 作为可视化引擎

- 按需加载
- 窗口变化自适应（增加防抖处理）

4. 代码组织规范

- 命名规范（尽量富有含义，清晰明了）
  - 文件夹名：单词小写，多个用短横线-链接，如：user-management;
  - 组件名：大驼峰命名，如：HelloWorld;
  - 方法名：小驼峰命名，如：getUserInfo;
  - 变量名：小驼峰命名，如：userInfo;
  - css 样式：短横线， 如：wrapper-header;
- 代码规范
  - 缩进：2 个空格;
  - 引号：使用单引号;
  - 分号：结尾使用分号; 等等；具体参考 eslint 配置;
  - 代码注释：每个函数添加注释，复杂模块必须每行代码添加注释;
  - 公共组件抽离复用
  - 公共逻辑抽离复用
- 代码提交规范
  - 遵循开源项目提交规范，如（feat(test): init）

## 技术方案调研

1. 使用缩放，高分辨率的屏幕会出现白边
2. 使用 vw/vh (推荐)

### scale方案具体实现
![scale-1](/public/big-screen/scale-1.jpg)

1. 封装自动缩放hook
```ts
import { debounce } from "lodash-es";
import { onMounted, onUnmounted } from "vue";

/**
 * 封装大屏缩放方案
 * @param container 大屏元素选择器
 * @param designOption 设计稿尺寸
 * 注意：大屏宽高固定为设计稿宽高
 * 
 * */ 
export default function useScreenScale(container: string, designOption = {
  width: 1920,
  height: 1080,
}) {

  let containerElement = null;
  const { width, height } = designOption;

  onMounted(() => {
    init()
  })

  function init() {
    containerElement = document.querySelector(container);
    if (!containerElement) return;
    // 设置默认样式
    setElementStyle()
    // 初始缩放
    initScale()
    // 监听窗口变化，同步缩放
    addEventListener('resize', debounce(initScale, 200))
  }

  function setElementStyle() {
    Object.assign(containerElement.style, {
      width: `${width}px`,
      height: `${height}px`,
      transformOrigin: `top left`,
      transition: `transform 0.5s`,
    });
  }

  function initScale() {
    // 横纵坐标缩放的比例
    const scaleX = innerWidth / width;
    const scaleY = innerHeight / height;
    // 缩放的最小值
    const scale = Math.min(scaleX, scaleY);

    // 容器移动的距离，让容器居中
    const left = (innerWidth - (width * scale)) / 2;
    const top = (innerHeight - (height * scale)) / 2;
    containerElement.style.transform = `translate(${left}px, ${top}px) scale(${scale})`
  }

  onUnmounted(() => {
    removeEventListener('resize', debounce(initScale, 200))
    containerElement = null;
  })
}
```

2. 大屏首页直接使用
``` vue
<script setup lang="ts">
import useScreenScale from './hooks/useScreenScale';
useScreenScale('#screen')
</script>

<template>
  <div class="home-view" v-loading="loading">
    <div ref="screen" class="screen" id="screen">
      <div class=hd>Hd</div>
      <div class="body">
        <div class="left">
          Left
        </div>
        <div class="center">
          Main
        </div>
        <div class="right">
          Right
        </div>
      </div>
      <div class="footer">Ft</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  width: 100%;
  height: 100dvh;
  background: #010821;
  color: #edf4fa;

  .screen {
    background: #010821;

    .body {
      @apply flex justify-between w-full;
      @apply px-4;

      .left,
      .right {
        width: 377px;
        height: 100%;
      }

      .center {
        flex: 1;
        padding: 50px 56px 0 75px;
      }

      .title-img-box {
        width: 100%;
        padding-top: 8px;
      }

      .title-img {
        height: 43px;
      }
    }

    .footer {
      width: 100%;
      height: 27px;
      background: url(./images/footer-bg.png) no-repeat center/100% 100%;
    }
  }
}
</style>
```


### vw/vh 方案具体实现

![vh-1](/public/big-screen/vh-1.jpg)

1. 封装 css 工具函数将 px 转换 vw(css样式使用)并配置全局引入

```scss
// css/utils.scss
@use "sass:math";
$designWidth: 1920; // 设计稿宽度
$designHeight: 1080; // 设计稿高度

@function vw($px) {
  @return math.div(round(math.div($px, $designWidth) * 10000000), 10000000) * 100vw;
}

@function vh($px) {
  @return math.div(round(math.div($px, $designHeight) * 10000000), 10000000) * 100vh;
}
```

配置全局引入

```ts
// vite.config.ts
 css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@screen/css/util.scss" as *;`,
      },
    },
  },
```

2. 封装工具函数将 px 转换 vw(行内样式和图表样式使用)

``` ts
import _ from 'lodash'
const designWidth = 1920
const designHeight = 1080
const precision = 5

export function vw(val: number) {
  if (!val) return 0
  const result = _.divide(val * 100, designWidth)
  return _.round(result, precision) + 'vw'
}

export function vh(val: number) {
  if (!val) return 0
  const result = _.divide(val * 100, designHeight)
  return _.round(result, precision) + 'vh'
}

```

3. 图表字体等样式可以使用如下方法/也可以直接使用vw/vh

``` ts
// Echarts图表字体、间距自适应
export const fitChartSize = (size, defalteWidth = 1920) => {
  const clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  if (!clientWidth) return size
  const scale = clientWidth / defalteWidth
  return Number((size * scale).toFixed(3))
}
```

4. 关键部分代码块

- 首页
```vue
<template>
  <div v-loading="loading" class="big-wrap" id="screen">
    <BigScreenHeader />
    <main class="wrapper flex">
      <div class="wrapper-left">
         Left
      </div>
      <div class="wrapper-main">
        Main
      </div>
      <div class="wrapper-left">
        Right
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.big-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(./images/body-bg.png) no-repeat center / cover;
  font-size: vw(14);
  overflow: hidden;
}
.wrapper {
  width: 100%;
  padding: vw(28) vw(15) 0;
  height: vh(992);

  &-main {
    width: vw(1218);
    height: 100%;
    padding: vw(28) vw(28) vw(30) vw(23);
  }

  &-left,
  &-right {
    width: vw(336);
    height: 100%;
    box-sizing: border-box;
  }
}
</style>

```

- 饼图

```vue
<template>
  <div class="chart flex-row-center">
    <div class="chart-circle"></div>
    <div ref="pieChart" class="chart-box"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { fitChartSize } from '../utils/charts'

interface IOptionsItem {
  // 名称
  name?: string
  // 金额
  value?: number
  // 项目状态
  type?: string
}
const props = withDefaults(
  defineProps<{
    data?: IOptionsItem[]
    colors?: string[]
    title?: string
    subtext?: string | number
    // 格式化提示
    format?: string | ((...args: any[]) => string)
  }>(),
  {
    data: () => [],
    title: '',
    subtext: '',
    format: '',
  },
)

const pieChart = ref(null) // 图表容器引用
let myChart = null // 存储图表实例
const emits = defineEmits(['open'])

// 配置选项
const option = ref({
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tooltip: {
    trigger: 'item',
  },
  graphic: [
    {
      type: 'circle',
      left: 'center',
      top: 'center',
      shape: {
        r: fitChartSize(40),
      },
      style: {
        fill: 'transparent',
        stroke: 'rgba(108, 128, 151, 1)',
        lineWidth: 1,
      },
    },
    {
      type: 'image',
      style: {
        image: 'down.png',
        width: fitChartSize(7),
        height: fitChartSize(7),
      },
      left: 'center',
      top: '39%',
    },
    {
      type: 'image',
      style: {
        image: 'top.png',
        width: fitChartSize(7),
        height: fitChartSize(7),
      },
      left: 'center',
      bottom: '39%',
    },
    {
      type: 'image',
      style: {
        image: 'right.png',
        width: fitChartSize(7),
        height: fitChartSize(7),
      },
      left: '40%',
      top: 'center',
    },
    {
      type: 'image',
      style: {
        image: 'left.png',
        width: fitChartSize(7),
        height: fitChartSize(7),
      },
      right: '40%',
      top: 'center',
    },
    {
      type: 'image',
      style: {
        image: 'inner-circle.png',
        width: fitChartSize(29),
        height: fitChartSize(29),
      },
      left: 'center',
      top: 'center',
    },
  ],
  legend: {
    bottom: '5%',
    left: 'center',
    textStyle: {
      fontSize: fitChartSize(12),
      color: 'rgba(208, 222, 238, 1)',
    },
    itemGap: fitChartSize(15), // 增加图例项间距
    itemStyle: {
      borderWidth: 0,
    },
    itemWidth: fitChartSize(8),
    itemHeight: fitChartSize(8),
  },
  color: props.colors, // 全局颜色数组
  series: [
    {
      name: '重要工作完成情况',
      type: 'pie',
      radius: ['30%', '43%'],
      label: {
        color: 'rgba(208, 222, 238, 1)',
        fontSize: fitChartSize(12),
        formatter: (params) => {
          return `${params.name}: ${params.percent}%`
        },
        percentPrecision: 1,
      },
      labelLine: {
        show: true,
        length: fitChartSize(10),
        length2: fitChartSize(15),
        lineStyle: {
          width: 1,
        },
      },
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

onMounted(() => {
  initChart()
})

watch(
  () => props.data,
  (newVal) => {
    option.value.series[0].data = newVal
    // 应用配置
    myChart?.setOption(option.value)
  },
  {
    deep: true,
  },
)

function initChart() {
  // 初始化图表
  if (pieChart.value) {
    myChart = echarts.init(pieChart.value)

    // 应用配置
    myChart.setOption(option.value)

    // 窗口变化自适应
    window.addEventListener('resize', handleResize)
    // 绑定点击事件
    myChart.on('click', function (params) {
      if (params.componentType === 'graphic') {
        emits('open')
      }
    })
  }
}

// 处理窗口缩放
const handleResize = () => {
  myChart?.resize()
}

// 组件卸载前清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})
</script>

<style lang="scss" scoped>
.chart {
  position: relative;

  &-circle {
    position: absolute;
    top: vh(90);
    left: vw(109);
    width: vw(170);
    height: vh(170);
    background: url(../images/circle.png) no-repeat center/100% 100%;
  }

  &-box {
    width: vw(390);
    height: vh(350);
  }
}
</style>

```

- 柱状图
```vue
<template>
  <div ref="chartsRef" v-loading="loading" class="charts-wrap"></div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import useFetch from '@/hooks/useFetch'
import { fitChartSize } from '@screen/utils/charts'
import { getAllDomainViewMatterStatus } from '@screen/apis'
import { generatePageParams } from '@screen/utils'

const chartsRef = ref<HTMLDivElement>(null)

const defaultFillArr = new Array(15).fill(2)

const defaultSeries = ref([
  {
    data: defaultFillArr,
    type: 'bar',
    barWidth: fitChartSize(8),
    stack: 'Ad',
    name: '已超时',
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 1, color: 'rgba(208,222,238,0)' },
        { offset: 0, color: 'rgba(208,222,238,1)' },
      ]),
    },
  },
  {
    data: defaultFillArr,
    type: 'bar',
    stack: 'Ad',
    name: '未签收',
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 1, color: 'rgba(255, 201, 122, 0)' },
        { offset: 0, color: 'rgba(255, 201, 122, 1)' },
      ]),
    },
  },
  {
    data: defaultFillArr,
    type: 'bar',
    stack: 'Ad',
    name: '已完成',
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(102, 225, 223, 1)' },
        { offset: 1, color: 'rgba(102, 225, 223, 0)' },
      ]),
    },
  },
  {
    data: defaultFillArr,
    type: 'bar',
    stack: 'Ad',
    name: '正常推进',
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 1, color: 'rgba(21, 154, 255, 0)' },
        { offset: 0, color: 'rgba(21, 154, 255, 1)' },
      ]),
    },
  },
])

const maxTotal = ref(1)

let currentIndex = -1
let timer = null

const options = computed(() => ({
  grid: {
    top: '15%',
    left: '10%',
    right: '2%',
    bottom: '15%',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    extraCssText: 'z-index:100;',
    formatter: (params: any) => {
      if (!params?.length) return ''
      let title = params[0].name
      const tip = params.reduce((acc, cur) => {
        return `${acc}<br>${cur.seriesName}：${cur.value}`
      }, '')
      return `${title}${tip}`
    },
  },
  legend: {
    top: '5%',
    show: true,
    textStyle: {
      fontSize: fitChartSize(12),
      color: 'rgba(208, 222, 238, 1)',
    },
    itemGap: fitChartSize(15), // 增加图例项间距
    itemStyle: {
      borderWidth: 0,
    },
    itemWidth: fitChartSize(8),
    itemHeight: fitChartSize(8),
  },
  xAxis: {
    type: 'category',
    data: [
      '重点项目',
      '园区发展',
      '深化改革',
      '文化旅游',
      '城市建设',
      '农业农村',
      '生态环境保护',
      '教育领域',
      '民生服务',
      '卫生健康',
      '人才工作',
      '人力社保',
      '平安稳定',
      '交通运输',
      '纪检监察',
    ],
    axisLabel: {
      rotate: 30,
      interval: 0,
      color: 'rgba(208,222,238,1)',
      fontSize: fitChartSize(12),
      fontWeight: fitChartSize(500),
      margin: fitChartSize(8), // 增加标签与轴线距离
    },
    axisPointer: {
      type: 'shadow',
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(108, 128, 151, 1)',
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '事项数(件)',
      min: 0,
      max: maxTotal.value,
      interval: Math.floor(maxTotal.value / 5),
      nameTextStyle: {
        color: 'rgba(108, 128, 151, 1)',
        fontSize: fitChartSize(12),
      },
      axisLabel: {
        color: '#6C8097',
        fontSize: fitChartSize(11),
        fontFamily: 'YouSheBiaoTiHei',
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(108, 128, 151, 0.63)',
        },
      },
    },
    {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
  ],
  dataZoom: [
    {
      type: 'inside',
    },
  ],
  series: defaultSeries.value,
}))

const charts = ref(null)

const { loading, onFetchSuccess } = useFetch(
  getAllDomainViewMatterStatus,
  generatePageParams(),
  true,
)

onFetchSuccess((data) => {
  let normalArr = [],
    timeoutArr = [],
    completedArr = [],
    notSignArr = []
  if (data?.length) {
    data.forEach((item) => {
      const curList = item.list
      const notAssignCounts = curList.find(
        (numItem) => numItem.type === 'notSigned',
      )
      const timeoutCounts = curList.find(
        (numItem) => numItem.type === 'timeOut',
      )
      const completedCounts = curList.find(
        (numItem) => numItem.type === 'completed',
      )
      const normalCounts = curList.find((numItem) => numItem.type === 'normal')
      const curTotle =
        (normalCounts?.number ?? 0) +
        (timeoutCounts?.number ?? 0) +
        (completedCounts?.number ?? 0) +
        (notAssignCounts?.number ?? 0)

      maxTotal.value = Math.max(maxTotal.value, curTotle)

      normalArr.push(normalCounts?.number ?? 0)
      timeoutArr.push(timeoutCounts?.number ?? 0)
      completedArr.push(completedCounts?.number ?? 0)
      notSignArr.push(notAssignCounts?.number ?? 0)
    })
  }
  defaultSeries.value[0].data = normalArr
  defaultSeries.value[1].data = timeoutArr
  defaultSeries.value[2].data = completedArr
  defaultSeries.value[3].data = notSignArr
  initCharts()
})

const initCharts = () => {
  if (charts.value) {
    charts.value.setOption(options.value)
    return
  }
  if (chartsRef?.value) {
    const chart = echarts.init(chartsRef.value)
    chart.setOption(options.value)
    charts.value = chart
    // 自动选中
    autoSelected()
    // 窗口变化自适应
    window.addEventListener('resize', handleResize)
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.value = null
  stopAutoPlay()
  currentIndex = 0
})

const handleResize = () => {
  charts.value?.resize()
}

function autoSelected() {
  // 开始自动切换
  startAutoPlay()

  // 鼠标悬停时停止自动切换
  charts.value.on('mouseover', handleMouseover, false)

  // 鼠标离开时重新开始自动切换
  charts.value.on('mouseout', handleMouseout, false)
}

function handleMouseover() {
  stopAutoPlay()
}

function handleMouseout() {
  startAutoPlay()
}

function autoHighlight() {
  // 清除之前的高亮
  charts.value.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: currentIndex,
  })

  const dataLength = options.value.series[0].data?.length
  // 计算下一个索引
  currentIndex = (currentIndex + 1) % dataLength

  // 应用新的高亮
  charts.value.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: currentIndex,
  })

  // 显示提示框
  charts.value.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: currentIndex,
  })
}

// 开始自动切换
function startAutoPlay() {
  if (timer) {
    clearInterval(timer)
  }
  timer = setInterval(autoHighlight, 1000) // 2秒切换一次
}

// 停止自动切换
function stopAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
</script>

<style lang="scss" scoped>
.charts-wrap {
  width: vw(727);
  height: vh(350);
  background: linear-gradient(
    180deg,
    rgba(21, 154, 255, 0.1) 0%,
    rgba(21, 154, 255, 0.1) 100%
  );
}
</style>

```
