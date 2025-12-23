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

#### 关键步骤

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

#### 详细实现

##### 1. 首页

###### 1.1大屏全局样式

``` scss
@keyframes hoverScale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@font-face {
  font-family: 'YouSheBiaoTiHei';
  src:
    url('../fonts/YouSheBiaoTiHei.woff2') format('woff2'),
    url('../fonts/YouSheBiaoTiHei.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DDin';
  src: url('../fonts/D-DIN-Bold.ttf') format('truetype');
}

:root {
  --big-screent-hover-color: rgba(30, 162, 255, 1);
  --big-screent-color: #fff;
  --border-hover-color: rgba(30, 162, 255, 1);
  --big-title-color: #fff;
  --big-pagination-tab-bg-color: rgba(53, 156, 240, 0.08);
  --big-pagination-tab-color: rgba(184, 198, 203, 1);
  --big-description-label-color: rgba(184, 198, 203, 1)
}
.card-box {
  position: relative;
  width: 100%;
  height: 100%;
  padding: vh(16) vw(15);
  background: rgba(53, 141, 244, 0.1);
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 1px;
    background: linear-gradient(180deg, rgba(0, 180, 255, 0.23) 0%, rgba(0, 180, 255, 0.23) 61.73%, rgba(0, 180, 255, 0) 100%);
  }

  &::before {
    transform: rotate(315deg);
  }

  &::after {
    top: 50%;
    left: 0%;
    transform: rotate(225deg);
  }
}

.flex-row-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.flex-row-between-start {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.flex-row-start {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.flex-row-center-end {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}

.flex-col-start {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-col-start-center {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.flex-row-center-start {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.flex-row-end {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.flex-col-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
}

.gradient-text {
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 10.89%, rgba(165, 240, 199, 1) 97.8%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.5;
  /* 根据实际行高调整 */
  max-height: 3em;
}

div,
main,
aside,
header,
section,
p,
h1,
h2 {
  box-sizing: border-box;
}

.big-screen .el-loading-mask {
  background-color: #fff !important;
}

/* 整个滚动条 */
::-webkit-scrollbar {
  width: vw(8);
  height: vh(8) !important;
  opacity: 1;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: vw(8);
  background: rgba(104, 121, 148, 1);
  height: vh(30);
}

/* 滚动条滑块悬停状态 */
::-webkit-scrollbar-thumb:hover {
  background: rgba(104, 121, 148, 1);
  /* 悬停时颜色 */
}

.link {
  color: var(--big-screent-hover-color);
  cursor: pointer;
  text-decoration: underline;
}
```

###### 1.2封装布局组件

layout/DefaultLayout.vue
``` vue
<template>
  <div class="big-wrap" id="screen">
    <div class="big-wrap-loading flex-col-center" v-if="loading">
      <div class="loading-box">
        <div class="loading-box-inner flex-row-between">
          <div class="loading-box-inner-bg"
          :style="{ width: `${loadingWidth}%` }"
          ></div>
        </div>
      </div>
      <div class="loading-text gradient-text">{{ loadingWidth }}%</div>
    </div>
    <div class="inner">
      <BigScreenHeader />
      <main class="big-wrap-main">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BigScreenHeader from './BigScreenHeader.vue';
import '../css/common.scss';
import useGlobalLoading from '../hooks/useGlobalLoading';
import { watch } from 'vue';
const { defaultLoading = false } = defineProps<{
  defaultLoading?: boolean;
}>();

const { loading, loadingWidth, changeLoading } = useGlobalLoading(defaultLoading);

watch(() => defaultLoading, (val) => {
  changeLoading(val);
});
</script>

<style lang="scss" scoped>
.big-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  font-size: vw(14);
  overflow: hidden;
  color: #fff;
  background: url(../images/body-second-bg.png) no-repeat center/100% 100%;

  &-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 9999;

    .loading-box {
      position: relative;
      width: 300px;
      height: 20px;
      padding: 2px;
      border-radius: 10px;
      z-index: 2;
      overflow: hidden;

      &-inner {
        width: 100%;
        height: 100%;
        z-index: 3;
        background: #000;
        border-radius: 10px;

        &-bg {
          height: 100%;
          z-index: 4;
          background: var(--big-screent-hover-color);
          border-radius: 10px;
        }
      }

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        background: linear-gradient(90deg, #fff0, #42d392, #fff0);
        height: 100px;
        width: 40px;
        transform: translate(0);
        animation: rotate 15s linear infinite;
        z-index: -1;
        transform-origin: top center;
      }
    }

    .loading-text {
      margin-top: 15px;
      font-size: 16px;
      font-family: 'YouSheBiaoTiHei';
    }
  }

  .inner {
    width: 100%;
    height: 100%;
    z-index: 1;
    background: url(../images/body-bg.png) no-repeat center/100% 100%;
  }

  &-main {
    width: 100%;
    padding: vh(10) vw(50) vh(88);
    height: vh(982);
  }
}
</style>

```

###### 1.3首页使用layout

``` vue
<template>
  <DefaultLayout :defaultLoading="defaultLoading">
    <div class="flex">
      <div class="big-wrap-main-left">
        <Title title="人员结构分析"> </Title>
        <LeftContent />
      </div>
      <div class="big-wrap-main-content">
        <EmploymentMethod />
        <Title type="big" title="数据提示&预警提示"> </Title>
        <DataWarning />
      </div>
      <div class="big-wrap-main-left">
        <Title title="岗位类型占比"> </Title>
        <JobRatio />
        <Title title="应发工资"> </Title>
        <PayableSalary />
        <Title title="聘用经费来源"> </Title>
        <FundSource />
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from './layout/DefaultLayout.vue';
import Title from './components/Title.vue';
import './css/common.scss';
import LeftContent from './components/left/LeftContent.vue';
import JobRatio from './components/right/JobRatio.vue';
import PayableSalary from './components/right/PayableSalary.vue';
import FundSource from './components/right/FundSource.vue';
import EmploymentMethod from './components/main/EmploymentMethod.vue';
import DataWarning from './components/main/DataWarning.vue';
import { onMounted, ref } from 'vue';

const defaultLoading = ref(true);

onMounted(() => {
  // 只有从后台进入时才显示loading
  const forward = window.history.state.forward;
  if (forward && forward?.indexOf('/second') !== -1) {
    defaultLoading.value = false;
  };
});
</script>

<style lang="scss" scoped>
.big-wrap {
  &-main {
    &-content {
      width: vw(860);
      height: 100%;
      padding: 0 vw(20);
    }

    &-left,
    &-right {
      width: vw(480);
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>

```

##### 2.echarts基础组件封装

###### 2.1通用配置封装

utils/echarts.ts
``` ts
import { cloneDeep } from 'lodash-es';
import { IAgeStatisticsData, TAgeStatisticsData } from '../apis';
import { TPieData, TRecord } from '../typings';

// 生产需要修改size的属性的备份
const COPY_KEY = 'copy_';
export function generateCopyObj(key: string, value: number) {
  return {
    [`${COPY_KEY}${key}`]: value,
  };
}

// Echarts图表字体、间距自适应
export const fitChartSize = (key: string, size: number) => {
  return {
    [key]: calculateChartSizeByScreen(size),
    ...generateCopyObj(key, size),
  };
};

// 根据屏幕大小计算样式
export const calculateChartSizeByScreen = (size: number, defaultWidth = 1920) => {
  const clientWidth
    = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  if (!clientWidth) return size;
  const scale = clientWidth / defaultWidth;
  return Number((size * scale).toFixed(3));
};

// 公共提示框样式
const commonTip = {
  confine: true,
  axisPointer: {
    type: 'shadow',
  },
  backgroundColor: '#fff',
  textStyle: {
    color: 'rgba(2, 33, 56, 1)',
    ...fitChartSize('fontSize', 12),
    fontFamily: 'DDin',
  },
};

// 提示框样式统一配置
export const tooltipOptions = (isPie = false) => {
  if (isPie) {
    return {
      ...commonTip,
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}: ${params.percent}%`;
      },
    };
  }
  return {
    ...commonTip,
    trigger: 'axis',
    extraCssText: `z-index:100;`,
    formatter: (params: any) => {
      if (!params?.length) return '';
      const title = params[0].name;
      const tip = params.reduce((acc, cur) => {
        return `${acc}<br>${cur.seriesName}：${cur.value}`;
      }, '');
      return `${title}${tip}`;
    },
  };
};

// bar x轴配置
export const barXAxisOptions = (rotate = 15) => {
  return {
    type: 'category',
    // 修改标签样式
    axisLabel: {
      color: 'rgba(208, 222, 238, 1)',
      ...fitChartSize('fontSize', 12),
      ...fitChartSize('margin', 8), // 增加label标签与轴线距离
      rotate,
    },
    // 修改轴线样式
    axisLine: {
      lineStyle: {
        color: 'rgba(83, 110, 153, 1)',
      },
    },
  };
};

// bar y轴配置
export const barYAxisOptions = {
  type: 'value',
  min: 0,
  max: 1000,
  interval: 200,
  // 修改name样式
  nameTextStyle: {
    color: 'rgba(208, 222, 238, 1)',
    ...fitChartSize('fontSize', 12),
  },
  // 修改y轴标签样式
  axisLabel: {
    color: 'rgba(208, 222, 238, 1)',
    ...fitChartSize('fontSize', 12),
  },
  // 修改y轴对应的横轴样式
  splitLine: {
    lineStyle: {
      color: 'rgba(108, 128, 151, 0.3)',
      type: 'dashed',
    },
  },
};

// legend 配置
export const legendOptions = {
  // 文本样式
  textStyle: {
    color: 'rgba(184, 198, 203, 1)',
    ...fitChartSize('fontSize', 12),
  },
  ...fitChartSize('itemWidth', 8),
  ...fitChartSize('itemHeight', 8),
};

// pie label options
export const pieLabelOptions = {
  color: '#fff',
  ...fitChartSize('fontSize', 14),
  formatter: (params) => {
    return [`{a|${params.percent}%}`, `{b|${params.name}}`].join('\n');
  },
  percentPrecision: 1,
  rich: {
    b: {
      ...fitChartSize('fontSize', 12),
      color: '#B8C6CB',
    },
  },
};

// pie graphic options
export interface IPieGraphicOption {
  outsideCircleR?: number;
  left?: string;
  top?: string;
}
export const pieGraphic = (options?: IPieGraphicOption) => {
  const { outsideCircleR = 54, left = '18%', top = 'center' } = options || {};
  return [
    {
      type: 'circle',
      kind: 'outsideCircle',
      left,
      top,
      shape: {
        r: calculateChartSizeByScreen(outsideCircleR),
      },
      style: {
        fill: 'transparent',
        stroke: 'rgba(108, 128, 151, .2)',
        lineWidth: 2,
      },
    },
  ];
};

// 处理饼图数据格式
export function dealPieData(
  data: TAgeStatisticsData,
  name = 'jobTypeName',
  value = 'num',
): TPieData {
  if (!data?.length) return [];
  return data.map((item: IAgeStatisticsData) => ({
    name: item[name],
    value: item[value],
  }));
}

// 计算百分比
export function calculatePercent(num: number) {
  if (!num) return 0;
  // 获取小数位数
  const decimalPlaces = (num.toString().split('.')[1] || '').length;
  // 计算放大倍数（10的decimalPlaces次方）
  const multiplier = Math.pow(10, decimalPlaces);
  // 先放大为整数，乘以100，再缩小
  const result = Math.round(num * multiplier * 100) / multiplier;
  // 保留两位小数
  return parseFloat(result.toFixed(2));
}

// 更新所有需要计算的样式
// 由于echarts每次拿到的都是更新后的值，所有需要手动配置原始值，格式为origin_xxx
function updateAllFitSize(option: TRecord) {
  Object.entries(option).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      option[key] = updateAllFitSize(value);
    }
    else {
      if (/^copy_(.*?)$/.test(key)) {
        const oldKey = key.split('_')[1];
        option[oldKey] = calculateChartSizeByScreen(option[key]);
      }
    }
  });
  return option;
}

// 窗口变化后更新所有需要计算的样式
export function updateAllFitSizeOption(myChart: any) {
  // 获取当前配置
  const currentOption = myChart?.getOption();
  const cloneOption = cloneDeep(currentOption);
  // 更新所有计算样式
  const lastOption = updateAllFitSize(cloneOption);
  // 应用更新后的配置
  myChart?.setOption(lastOption);
}

// 窗口变化后更新轮廓样式
export const updateGraphicElements = (
  myChart: any,
  options: IPieGraphicOption,
) => {
  // 获取当前配置
  const currentOption = myChart?.getOption();
  const cloneOption = cloneDeep(currentOption);

  const currentGraphic = currentOption.graphic[0].elements;

  // 更新graphic中所有元素
  if (currentGraphic?.length) {
    const { left = '18%', top = 'center', outsideCircleR = 54 } = options || {};
    currentGraphic.forEach((item) => {
      // 更新外轮廓样式
      if (item.kind === 'outsideCircle') {
        // 更新圆形半径
        if (item.shape && item.shape.r)
          item.shape.r = calculateChartSizeByScreen(outsideCircleR);
        // 更新位置
        item.left = left;
        item.top = top;
      }
    });
    cloneOption.graphic = currentGraphic;
  }
  // 更新所有计算样式
  const lastOption = updateAllFitSize(cloneOption);
  // 应用更新后的配置
  myChart?.setOption(lastOption);
};


```

###### 2.2饼图通用组件

components/echarts/PieBase.vue

``` vue
<template>
  <div ref="pieChart" :style="{ width: vWidth, height: vHeight }" class="chart-box"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';
import { pieGraphic, fitChartSize, pieLabelOptions, tooltipOptions, IPieGraphicOption, updateGraphicElements } from '../../utils/charts';
import { vh, vw } from '../../utils';

interface IOptionsItem {
  // 名称
  name?: string;
  // 金额
  value?: number;
  // 项目状态
  type?: string;
}
const props = withDefaults(
  defineProps<{
    name?: string;
    data?: IOptionsItem[];
    colors?: string[];
    title?: string;
    subtext?: string | number;
    showLegend?: boolean;
    // 格式化提示
    format?: string | ((...args: any[]) => string);
    width?: number;
    height?: number;
    // 格式化legend
    legendFormatterUnit?: string;
    // 轮廓配置
    graphicOption?: IPieGraphicOption;
  }>(),
  {
    data: () => [],
    title: '',
    subtext: '',
    format: '',
    showLegend: true,
    width: 460,
    height: 187,
  },
);

const vWidth = vw(props.width);
const vHeight = vh(props.height);

const pieChart = ref(null); // 图表容器引用
let myChart = null; // 存储图表实例

// 配置选项
const option = ref({
  title: {
    show: true,
    text: props.title,
    textStyle: {
      ...fitChartSize('fontSize', 12),
      color: 'rgba(2, 33, 56, 0.8)',
    },
    left: 'center',
    top: 'center',
  },
  tooltip: {
    ...tooltipOptions(true),
  },
  legend: props.showLegend
    ? {
        // 图例垂直居中
        top: 'center',
        ...fitChartSize('right', 70),
        bottom: 'bottom',
        orient: 'vertical',
        textStyle: {
          ...fitChartSize('fontSize', 12),
          color: 'rgba(208, 222, 238, 1)',
        },
        ...fitChartSize('itemGap', 15), // 增加图例项间距
        ...fitChartSize('itemWidth', 8),
        ...fitChartSize('itemHeight', 8),
        itemStyle: {
          borderWidth: 0,
        },
      }
    : undefined,
  color: props.colors, // 全局颜色数组
  graphic: pieGraphic(props.graphicOption),
  series: [
    {
      name: props?.name ?? '',
      type: 'pie',
      center: ['30%', '50%'], // 调整圆心位置：水平居中，垂直方向45%处
      radius: ['35%', '55%'],
      label: {
        ...pieLabelOptions,
      },
      labelLine: {
        show: true,
        ...fitChartSize('length', 10),
        ...fitChartSize('length2', 15),
        lineStyle: {
          width: 1,
          color: '#fff',
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
});

onMounted(() => {
  initChart();
});

watch(
  () => props.data,
  (newVal) => {
    option.value.series[0].data = newVal;
    if (props.legendFormatterUnit) {
      option.value.legend['formatter'] = (name) => {
        const curData = newVal.find(item => item.name === name);
        return `${name}\n${curData?.value ?? 0}${props.legendFormatterUnit}`;
      };
    }
    // 应用配置
    myChart?.setOption(option.value);
  },
  {
    deep: true,
  },
);

function initChart() {
  // 初始化图表
  if (pieChart.value) {
    myChart = echarts.init(pieChart.value);

    // 应用配置
    myChart.setOption(option.value);

    // 窗口变化自适应
    window.addEventListener('resize', handleResize);
  }
}

// 处理窗口缩放
const handleResize = () => {
  myChart?.resize();
  updateGraphicElements(myChart, props.graphicOption);
};

// 组件卸载前清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  myChart?.dispose();
});
</script>


```

使用：

``` vue
<template>
  <div class="card-box left-content">
    <div v-loading="ageLoading">
      <LineTitle>年龄分布</LineTitle>
      <PieBase name="年龄分布" :colors="colors" :data="ageRes" />
    </div>
    <div v-loading="workYearLoading">
      <LineTitle>工作年限</LineTitle>
      <PieBase name="工作年限" :colors="colors" :data="workYearRes" />
    </div>
    <div v-loading="sexLoading">
      <LineTitle>性别比例</LineTitle>
      <SexPrecent :data="sexRes" />
    </div>
    <LineTitle>学历构成</LineTitle>
    <EducationalBackground />
  </div>
</template>

<script lang="ts" setup>
import PieBase from '../echarts/PieBase.vue';
import SexPrecent from './SexPrecent.vue';
import EducationalBackground from './EducationalBackground.vue';
import LineTitle from '../LineTitle.vue';
import useFetch from '@/hooks/useFetch';
import { getStaffAgeStatisticsData, getStaffSexStatisticsData, getStaffWorkYearStatisticsData, ISexStatisticsData, TAgeStatisticsData } from '../../apis';
import { dealPieData } from '../../utils/charts';
import { TPieData } from '../../typings';

const colors = ['#2D9BFC', '#D0DEEE', '#FFC97A', '#098E3D', '#05CBF1'];

const { loading: ageLoading, res: ageRes } = useFetch<TPieData>(getStaffAgeStatisticsData, undefined, true, (data: TAgeStatisticsData) => dealPieData(data, 'levelName', 'count'), []);
const { loading: workYearLoading, res: workYearRes } = useFetch<TPieData>(getStaffWorkYearStatisticsData, undefined, true, (data: TAgeStatisticsData) => dealPieData(data, 'levelName', 'count'), []);
const { loading: sexLoading, res: sexRes } = useFetch<ISexStatisticsData>(getStaffSexStatisticsData, undefined, true, undefined, {});
</script>

<style lang="scss" scoped>
.left-content {
  height: vh(852)
}
</style>

```

###### 2.3柱状图通用组件

components/echarts/BarBase.vue

``` vue
<template>
  <div v-if="visible"
    ref="chartsRef"
    :style="{
      height: vHeight,
    }"
  ></div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';
import { vh } from '../../utils';
import { nextTick } from 'vue';
import { updateAllFitSizeOption } from '../../utils/charts';

const chartsRef = ref<HTMLDivElement>(null);
const visible = ref(false);

const {
  // 图表高度
  height = 124,
  // 自动选中时间，没有则不自动选中
  autoSelectTime = 0,
} = defineProps<{
  height?: number;
  autoSelectTime?: number;
}>();

const options = ref<echarts.EChartsOption>({});

const vHeight = vh(height);

let currentIndex = -1;
let timer = null;

const charts = ref(null);

const initCharts = () => {
  if (charts.value) {
    charts.value.dispose();
  }
  if (chartsRef?.value) {
    const chart = echarts.init(chartsRef.value);
    chart.setOption(options.value);
    charts.value = chart;
    if (autoSelectTime) {
      // 自动选中
      autoSelected();
    }
    // 窗口变化自适应
    window.addEventListener('resize', handleResize);
  }
};
const show = async (newOptions: any) => {
  options.value = newOptions;
  visible.value = true;
  await nextTick();
  initCharts();
};

defineExpose({
  show,
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  charts.value = null;
  if (autoSelectTime) {
    stopAutoPlay();
    currentIndex = 0;
  }
});

const handleResize = () => {
  charts.value?.resize();
  // 更新所有需要计算的样式
  updateAllFitSizeOption(charts.value);
};

function autoSelected() {
  // 开始自动切换
  startAutoPlay();

  // 鼠标悬停时停止自动切换
  charts.value.on('mouseover', handleMouseover, false);

  // 鼠标离开时重新开始自动切换
  charts.value.on('mouseout', handleMouseout, false);
}

function handleMouseover() {
  stopAutoPlay();
}

function handleMouseout() {
  startAutoPlay();
}

function autoHighlight() {
  // 清除之前的高亮
  charts.value.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: currentIndex,
  });

  const dataLength = options.value?.series[0].data?.length;
  // 计算下一个索引
  currentIndex = (currentIndex + 1) % dataLength;

  // 应用新的高亮
  charts.value.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: currentIndex,
  });

  // 显示提示框
  charts.value.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: currentIndex,
  });
}

// 开始自动切换
function startAutoPlay() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(autoHighlight, autoSelectTime); // 2秒切换一次
}

// 停止自动切换
function stopAutoPlay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  currentIndex = -1;
}
</script>

```

使用：

``` vue
<template>
  <div v-loading="loading">
    <BarBase :height="195" :autoSelectTime="1000" ref="barBaseRef" />
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import BarBase from '../echarts/BarBase.vue';
import { barXAxisOptions, barYAxisOptions, fitChartSize, tooltipOptions } from '../../utils/charts';
const barBaseRef = useTemplateRef<InstanceType<typeof BarBase>>('barBaseRef');
import * as echarts from 'echarts';
import useFetch from '@/hooks/useFetch';
import { getStaffAcademicStatisticsData, TAgeStatisticsData } from '../../apis';

const options = {
  grid: {
    top: '20%',
    bottom: '20%',
    left: '10%',
    right: '5%',
  },
  legend: {
    show: false,
  },
  tooltip: {
    ...tooltipOptions(),
  },
  xAxis: {
    ...barXAxisOptions(0),
    data: ['博士', '研究生', '本科', '大专', '其他'],
  },
  yAxis: {
    ...barYAxisOptions,
    name: '人',
  },
  series: [
    {
      data: [0, 0, 0, 0, 0],
      type: 'bar',
      name: '学历分布',
      // 显示柱状图数值
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontFamily: 'YouSheBiaoTiHei',
        ...fitChartSize('fontSize', 11),
      },
      ...fitChartSize('barWidth', 12),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(21, 154, 255, 1)',
          },
          {
            offset: 0.1,
            color: 'rgba(0, 58, 255, 0)',
          },
          {
            offset: 1,
            color: 'rgba(21, 154, 255, 1)',
          },
        ]),
      },
    },
  ],
};

const { loading, onFetchSuccess, onFetchError } = useFetch<TAgeStatisticsData>(getStaffAcademicStatisticsData, undefined, true, undefined, []);

onFetchSuccess((res) => {
  if (res?.length) {
    const { barSeriesData, barXAxisData, barYAxisMax, leftGrid, barYAxisInterval } = computedBarOptionData(res);
    options.xAxis.data = barXAxisData;
    options.yAxis.max = barYAxisMax;
    options.yAxis.interval = barYAxisInterval;
    options.grid.left = leftGrid;
    options.series[0].data = barSeriesData;
  }
  barBaseRef.value.show(options);
});

onFetchError(() => {
  barBaseRef.value.show(options);
});

// 柱状图计算坐标数据
function computedBarOptionData(data: TAgeStatisticsData) {
  let barSeriesData = [];
  let barXAxisData = [];
  data.forEach((item) => {
    barXAxisData.push(item.levelName);
    barSeriesData.push(item.count);
  });

  const barYAxisMax = barSeriesData.reduce((pre, cur) => Math.max(pre, Number(cur)), 0);

  const leftGrid = computedGird(barYAxisMax);

  const barYAxisInterval = Math.floor(barYAxisMax / 5);

  return {
    barSeriesData,
    barXAxisData,
    barYAxisMax,
    leftGrid,
    barYAxisInterval,
  };
}

const computedGird = (num: number) => {
  if (!num) return '5%';
  if (num < 10000) return '10%';
  if (num < 1000000) return '15%';
  if (num < 10000000) return '20%';
  if (num < 100000000) return '25%';
  return '40%';
};
</script>

```

##### 3.二级页面

目前使用element plus组件，需要单独做样式适配
``` vue
<script lang="ts" setup>
import DefaultLayout from './layout/DefaultLayout.vue';
import { useRouteQuery } from '@vueuse/router';
import { reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import CustomTable from './components/CustomTable.vue';
import { ElIcon, ElInput, ElPagination, ElTableColumn } from 'element-plus';
import DictionaryShow from '@/components/dictionary/DictionaryShow.vue';
import useFetch from '@/hooks/useFetch';
import { getUnofficialStaff } from '@/apis/members';
import DictionarySelect from '@/components/dictionary/DictionarySelect.vue';
import './css/common.scss';
import UnitCascader from '@/components/unit/UnitCascader.vue';
import DetailDialog from './components/detail/DetailDialog.vue';
import useShowDialog from './hooks/useShowDialog';

const { show: showDetail, optionItem: detailOptions, handleClick, close: handleClose } = useShowDialog();

const maxHeight = ref('60vh');

const router = useRouter();

const title = useRouteQuery('title', '');

// 用工形式类型
const type = useRouteQuery('type', '0', {
  transform: Number,
});

// 预警类型
const warningType = useRouteQuery('warningType', undefined);

function handleClickGoHome() {
  router.push({
    path: '/large-screen',
  });
}

const tabList = ['直接聘用人数', '劳务派遣人数', '其他形式人数'];

// pager start
const pager = ref({
  currentPage: 1,
  pageSize: 20,
  total: 0,
  pageSizes: [10, 20, 50, 100, 200],
});

const handleSizeChange = (val: number) => {
  pager.value.pageSize = val;
};
const handleCurrentChange = (val: number) => {
  pager.value.currentPage = val;
};

// pager end

const filterParams = reactive({
  name: '',
  unitType: undefined,
  jobType: undefined,
  workUnitArr: undefined,
});

const { loading, execute, onFetchSuccess } = useFetch(
  getUnofficialStaff,
  {},
  false,
  undefined,
);
const tableData = ref([]);

onFetchSuccess(async (data) => {
  tableData.value.length = 0;
  const newData = data?.data?.length ? data.data : [];
  tableData.value = newData;
  pager.value.total = data.totalCount ?? 0;
});

watchEffect(async () => {
  const postData = {
    currentPage: pager.value.currentPage,
    pageSize: pager.value.pageSize,
    sort: [
      {
        field: 'create_time',
        type: 'desc',
      },
    ],
    query: {
      employmentType: type.value ? type.value : undefined,
      name: filterParams.name,
      unitType: filterParams.unitType,
      jobType: filterParams.jobType,
      workUnitArr: filterParams.workUnitArr,
      type: warningType.value ? warningType.value : undefined,
    },
  };
  await execute(postData);
});

</script>

<template>
  <DefaultLayout>
    <div class="second-page">
    <div class="flex page-nav">
      <div class="page-nav-item" @click="handleClickGoHome">首页</div>
      <div class="page-nav-line">/</div>
      <div  class="page-nav-active">{{ title }}</div>
    </div>
    <div class="way-tab flex">
      <div
        class="tab-item flex-row-center"
        v-for="(tab, index) in tabList"
        :key="index"
        :class="{ active: type === index + 1 }"
        @click="type = index + 1"
      >
        {{ tab }}
      </div>
    </div>
    <div class="filter flex">
      <ElInput style="width: 200px;" v-model="filterParams.name" placeholder="请输入姓名搜索">
        <template #prefix>
            <ElIcon class="el-input__icon"><Search /></ElIcon>
          </template>
      </ElInput>
      <div class="filter-item">
        <span class="filter-item-label">工作单位</span>
        <UnitCascader style="width: 200px;" :showAllLevels="false" :checkStrictly="true" v-model="filterParams.workUnitArr" ></UnitCascader>
      </div>
      <div class="filter-item">
        <span class="filter-item-label">单位性质</span>
        <DictionarySelect style="width: 200px!important;" parentDictionaryValue="unitType" v-model="filterParams.unitType" ></DictionarySelect>
      </div>
      <div class="filter-item">
        <span class="filter-item-label">岗位类别</span>
        <DictionarySelect style="width: 200px!important;" parentDictionaryValue="jobType" v-model="filterParams.jobType" ></DictionarySelect>
      </div>
    </div>
    <div v-loading="loading" class="content">
      <CustomTable :data="tableData" :show-summary="false" :height="maxHeight">
        <ElTableColumn prop="name" label="姓名">
          <template #default="{ row }">
            <div class="link" @click="handleClick({
              title: row.name,
              ...row,
            })">{{ row.name }}</div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="workUnitName" label="工作单位"></ElTableColumn>
        <ElTableColumn prop="unitType" label="单位性质">
          <template #default="{ row }">
            <DictionaryShow
              parentDictionaryValue="unitType"
              :value="row.unitType"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="employmentType" label="用工方式">
          <template #default="{ row }">
            <DictionaryShow
              parentDictionaryValue="employmentType"
              :value="row.employmentType"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="jobType" label="岗位类别">
          <template #default="{ row }">
            <DictionaryShow
              parentDictionaryValue="jobType"
              :value="row.jobType"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="jobName" label="岗位名称">
          <template #default="{ row }">
            <DictionaryShow
              parentDictionaryValue="jobName"
              :value="row.jobName"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="professionalGradeName"
          label="职称等级"
        ></ElTableColumn>
        <ElTableColumn prop="laborCompany" label="劳务派遣公司"></ElTableColumn>
        <ElTableColumn prop="createTime" label="创建时间"></ElTableColumn>
      </CustomTable>
      <div v-if="pager.total" class="pagination-box flex-row-end">
        <div class="pagination-total">
          共
          <span class="pagination-total-num">
            {{ pager.total }}
          </span>
          条数据
        </div>
        <ElPagination
          v-model:current-page="pager.currentPage"
          v-model:page-size="pager.pageSize"
          :page-sizes="pager.pageSizes"
          :background="true"
          layout="sizes, prev, pager, next, jumper"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    </div>
  </DefaultLayout>
  <DetailDialog v-if="showDetail" :options="detailOptions" @close="handleClose" />
</template>

<style lang="scss" scoped>
.page-nav {
  &-item {
    color: var(--border-hover-color);
    cursor: pointer;
  }

  &-line {
    margin: 0 vw(10);
  }
}
.way-tab {
  margin: vh(15) 0;

  .tab-item {
    width: vw(114);
    height: vh(40);
    margin-right: vw(8);
    background: linear-gradient(180deg, rgba(122, 163, 204, 0.6) 0.02%, rgba(108, 128, 151, 0) 100%);
    /** 文本1 */
    font-weight: 500;
    line-height: vh(18);
    color: rgba(88, 105, 124, 1);
    border-top: 2px solid rgba(108, 128, 151, 1);
    cursor: pointer;

    &.active {
      border-top: 2px solid var(--border-hover-color);
      color: #fff;
      text-shadow: 0px 0px 8px rgba(2, 3, 7, 0.35);
      background: linear-gradient(180deg, rgba(30, 162, 255, 0.2) 0.02%, rgba(30, 162, 255, 0) 100%);
    }
  }
}

.filter {
  margin: vh(24) 0;

  &-item {
    margin-left: vw(24);

    &-label {
      margin-right: vw(12);
    }
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-input__icon) {
  color: #fff;
}

.second-page {
  --el-text-color-regular: #fff;
}

:deep(.el-input__inner) {
  color: #fff !important;
}

:deep(.el-loading-mask) {
  background-color: transparent !important;
}
.pagination-box {
  margin-top: vh(26);

  .pagination-total {
    margin-right: vw(12);
  }
}
:deep(.el-pager li),
:deep(.el-pagination button) {
  background-color: var(--big-pagination-tab-bg-color) !important;
  color: var(--big-pagination-tab-color);
  min-width: vw(32) !important;
  height: vh(32) !important;
  font-size: vw(14);
  box-sizing: border-box;
}

:deep(.el-pager li.is-active) {
  background-color: var(--big-screent-hover-color) !important;
}

:deep(.el-select),
:deep(.is-active),
:deep(.el-input__wrapper) {
  height: vh(32) !important;
  font-size: vw(14); font-size: vw(14);
  background: var(--big-pagination-tab-bg-color)!important;
  box-shadow: none !important;
  border: 1px solid rgba(30, 162, 255, 0.6);
  border-radius: 2px;
}

:deep(.el-select) {
  width: vw(130) !important;
  height: vh(32) !important;
}

:deep(.el-select__wrapper) {
  min-height: vh(32) !important;
  box-shadow: none !important;
  background: var(--big-pagination-tab-bg-color)!important;
}

:deep(.el-pagination .el-input) {
  width: vw(56) !important;
  font-size: vw(14);
}

:deep(.el-pagination__goto),
:deep(.el-pagination__classifier),
:deep(.el-select__selected-item) {
  font-size: vw(14);
}

:deep(.el-select.el-select--large) {
  width: vw(200) !important;
  height: vh(40) !important;
}

:deep(.el-select.el-select--large .el-select__wrapper) {
  width: vw(200) !important;
  height: vh(40) !important;
  border-radius: vw(4);
}
</style>

```

##### 4.详情弹框

``` vue
<script lang="ts" setup>
import { vh, vw } from '../utils';

withDefaults(
  defineProps<{
    show?: boolean;
    options: {
      title: string;
      z?: number;
      [key: string]: any;
    };
    full?: boolean;
  }>(),
  {
    show: false,
    z: 3333,
    full: true,
  },
);

const emits = defineEmits(['close']);

const handleClose = () => {
  emits('close');
};
</script>

<template>
  <div
    class="dialog-wrap flex-row-center"
    @click.stop
    :style="{
      zIndex: options?.z,
    }"
  >
    <div
      class="dialog-wrap-box"
      :style="{
        width: vw(1500),
        height: vh(800),
      }"
    >
      <div class="dialog-wrap-box-hd flex-row-between">
        <div class="dialog-wrap-box-hd-title flex-row-start">
          <img
            class="dialog-wrap-box-hd-title-tag"
            src="../images/dialog-title-tag.png"
          />
          {{ options?.title }}
        </div>
        <div class="flex-row-start">
          <img
            @click="handleClose"
            class="dialog-wrap-box-hd-close"
            src="../images/close.png"
          />
        </div>
      </div>
      <img
        class="dialog-wrap-box-divided"
        src="../images/header-line.png"
        alt=""
      />
      <div
        class="dialog-wrap-box-content"
        :style="{
          height: '66vh',
        }"
      >
        <slot></slot>
      </div>
      <div class="dialog-wrap-box-footer">
        <img src="../images/footer-line.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.dialog-wrap {
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 3333;
  animation: fadeIn 0.6s ease forwards;

  &-box {
    position: relative;
    width: vw(880);
    padding: vh(16) vw(16);
    background: url(../images/body-second-bg.png) no-repeat center/cover;

    border: 1px solid rgba(108, 128, 151, 0.5);

    backdrop-filter: blur(vw(20));
    font-size: vw(14);

    &-hd {
      height: vh(40);
      background: linear-gradient(
        165.2deg,
        rgba(47, 102, 232, 0.2) 0%,
        rgba(47, 102, 232, 0.08) 100%
      );

      &-title {
        min-width: vw(366);
        height: vh(40);
        padding-left: vw(12);
        /** 文本1 */
        font-size: vw(20);
        font-weight: 700;
        background: url(../images/dialog-title.png) no-repeat center/cover;
        &-tag {
          width: vw(24);
          margin-right: vw(12);
        }
      }

      &-full {
        margin-right: vw(16);
        cursor: pointer;
        font-size: vw(14);

        &:hover {
          color: var(--big-screent-hover-color);
        }
      }

      &-close {
        width: vw(24);
        cursor: pointer;
      }
    }

    &-divided {
      width: 100%;
    }

    &-content {
      padding: vh(24) vw(8) vh(30) vw(8);
      height: 92vh;
      overflow: auto;
    }

    &-footer {
      position: absolute;
      width: 100%;
      bottom: vh(17);
      left: 0;
      right: 0;
      padding: 0 vw(16);

      & img {
        width: 100%;
      }
    }
  }
}
</style>

```
使用方式见二级页面

##### 5.自定义表格

``` vue
<script lang="ts" setup>
import { ElTable } from 'element-plus';
import { vh, vw } from '../utils';
import { CSSProperties } from 'vue';

const emit = defineEmits(['sort-change']);

const { data = [], height = '100%', showSummary = true } = defineProps<
  {
    data: Record<string, any>[];
    height?: string;
    showSummary?: boolean;
  }
>();

const p = vh(4);
// 表格cell 公共样式
const cellCommonStyle = {
  paddingTop: p,
  paddingBottom: p,
};

const cellStyle: CSSProperties = {
  ...cellCommonStyle,
  fontSize: vw(14),
  lineHeight: vh(20),
  background: 'rgba(53, 156, 240, 0.08)',
  color: 'rgba(184, 198, 203, 1)',
};

function sortChange(sort) {
  emit('sort-change', sort);
}

const headerCellStyle: CSSProperties = {
  ...cellCommonStyle,
  backgroundColor: 'rgba(118, 183, 232, 0.2)',
  color: 'rgba(208, 222, 238, 1)',
};

</script>

<template>
  <div class="custom-table">
    <ElTable :data="data"
    v-bind="$attrs"
    :height="height"
    header-cell-class-name="table-hd-cell"
    stripe
    :cell-style="cellStyle"
    :header-cell-style="headerCellStyle"
    align="center" :show-summary="showSummary" sum-text="汇总"
    @sort-change="sortChange"
    >
      <slot></slot>
    </ElTable>
  </div>
</template>

<style lang="scss" scoped>
.custom-table {
  /* 表格末尾border */
  --el-index-normal: none;
  /* 设置字体 */
  --el-font-size-base: vw(14) !important;
  /* 表格 patch border */
  --el-border-color-lighter: transparent !important;
  --el-border-color-darker: transparent !important;

  // 清除表格默认有个白色
  --el-bg-color: transparent !important;
  --el-fill-color-blank: transparent !important;
}

:deep(.el-table__row) {
  border-bottom: none
}

:deep(.el-table__body .el-table__row.el-table__row--striped .el-table__cell) {
  background: rgba(133, 202, 255, 0.12) !important;
}

:deep(.el-table td),
:deep(.el-table td.is-leaf),
:deep(.el-table th.el-table__cell.is-leaf),
:deep(.el-table__footer td) {
  border: none;
}
</style>


```

使用方式见二级页面


##### 6.动态数字

``` vue
<script lang="ts" setup>
import { ElStatistic } from 'element-plus';
import { useTransition } from '@vueuse/core';
import { watch, h, ref } from 'vue';
import { vw } from '../utils';

const props = withDefaults(
  defineProps<{
    source?: string | number;
    size?: number;
    customStyle?: Record<string, string>;
  }>(),
  {
    source: 0,
    size: 16,
    customStyle: () => ({}),
  },
);

const oldSource = ref(0);
const outputValue = useTransition(oldSource, {
  duration: 1000,
});
oldSource.value = Number(props.source ?? 0);

watch(
  () => props.source,
  (newVal) => {
    oldSource.value = Number(newVal ?? 0);
  },
  {
    deep: true,
  },
);

const vSize = vw(props.size);
</script>

<template>
  <component
    :is="
      h(
        ElStatistic,
        {
          ...$attrs,
          precision: 2,
          value: outputValue,
          valueStyle: {
            fontSize: vw(props.size),
            fontWeight: '700',
            fontFamily: 'DDin',
            lineHeight: vw(props.size),
            ...props.customStyle,
          },
        },
        $slots,
      )
    "
  ></component>
</template>

<style>
.el-statistic__content {
  font-size: v-bind('vSize') !important;
}
</style>


```

使用方式见首页
   

##### 7.基础hooks

hooks/
useLoading

``` ts
import { onMounted, onUnmounted, ref } from 'vue';

export default function useGlobalLoading(init = false) {
  const loading = ref(init);

  const loadingWidth = ref(0);

  let intervalId;

  onMounted(() => {
    intervalId = setInterval(() => {
      if (loadingWidth.value >= 100) {
        return;
      }
      loadingWidth.value += 10;
    }, 200);
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });

  const changeLoading = (val: boolean) => {
    loading.value = val;
  };

  return {
    loading,
    loadingWidth,
    changeLoading,
  };
};


```

useShowDialog

``` ts
import { ref } from 'vue';
import { IDialogOptions } from '../typings';

export default function useShowDialog() {
  const show = ref(false);

  const optionItem = ref<IDialogOptions>({
    title: '',
  });

  function changeShow(newShow: boolean) {
    show.value = newShow;
  }

  function close() {
    show.value = false;
    optionItem.value = {
      title: '',
    };
  }

  function handleClick(item: {
    title: string;
    [key: string]: any;
  }) {
    optionItem.value = item;
    changeShow(true);
  }

  return {
    show,
    changeShow,
    close,
    handleClick,
    optionItem,
  };
}

```

useTimer

``` ts
import { ref, onMounted, onUnmounted } from 'vue';

export default function useDateTime(format = 'YYYY年MM月DD日 HH:mm:ss WW') {
  const dateTime = ref('');
  const weekDays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  let timer = null;

  // 更新时间的函数
  const updateTime = () => {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const week = weekDays[now.getDay()];

    dateTime.value = format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
      .replace('WW', ` | ${week}`);
  };

  // 组件挂载时启动定时器
  onMounted(() => {
    updateTime(); // 立即更新一次
    timer = setInterval(updateTime, 1000); // 每秒更新一次
  });

  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    dateTime,
  };
}

```

useYear

``` ts
import { useRouteQuery } from '@vueuse/router';
import { ref } from 'vue';

export default function useYear(interval?: boolean) {
  const defaultYear = useRouteQuery('year', '', {
    transform: val => Number(val),
  });

  const curYear = new Date().getFullYear();
  const prevFiveYear = curYear - 2;

  const generatorYearOptions = () => {
    const options = [];
    for (let i = curYear; i >= prevFiveYear; i--) {
      options.push({
        label: interval ? `${i - 1}-${i}` : i,
        value: i,
      });
    }
    return options;
  };

  const year = ref(defaultYear.value ? defaultYear?.value : curYear);

  const yearOptions = generatorYearOptions();

  return {
    yearOptions,
    year,
  };
}


```
