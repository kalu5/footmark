# 金额相关工具

## 封装金额计算工具

``` ts
import * as _ from 'lodash-es';

const formatWithCommas = (value) => {
  if (!_.isFinite(_.toNumber(value))) return '';

  return _.chain(value)
    .toNumber()
    .round(2)
    .thru((num) => num.toFixed(2)) // 保证两位小数
    .thru((str) => str.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    .value();
};

const Money = {
  // 小数补0，确保金额格式为两位小数
  twoDecimal(val: string) {
    if (!val) return '00';
    if (val?.length < 2) return val + '0';
    return val;
  },
  // 保留两位小数，没有补0
  formatDecimal(val: string | number) {
    const valStr = typeof val === 'number' ? String(val) : val;
    const splitVal = valStr.split('.');
    const [int = 0, decimal = ''] = splitVal;
    return `${int}.${this.twoDecimal(decimal)}`;
  },
  // 字符串/数字 → 分（整数）
  toCents(val: string | number) {
    return _.round(_.toNumber(val) * 100);
  },
  // 分 → 带千分位的两位小数
  format(cents: number) {
    if (!_.isInteger(cents)) return '';
    const yuan = _.round(cents / 100, 2);
    return formatWithCommas(yuan);
  },
  // 安全加法（返回分）
  add(a: string | number, b: string | number) {
    const totalCents = this.toCents(a) + this.toCents(b);
    return this.formatDecimal(_.round(totalCents / 100, 2)); // 直接得到两位小数的数字
  },
  // 安全减法（返回分）
  subtract(a: string | number, b: string | number) {
    const totalCents = this.toCents(a) - this.toCents(b);
    return this.formatDecimal(_.round(totalCents / 100, 2)); // 直接得到两位小数的数字
  },
  // 安全乘法（返回分）
  multiply(a: string | number, b: string | number) {
    const totalCents = this.toCents(a) * this.toCents(b);
    return this.formatDecimal(_.round(totalCents / 10000, 2)); // 直接得到两位小数的数字
  },
  // 安全除法（返回分）
  divide(a: string | number, b: string | number) {
    if (this.toCents(b) === 0) return 0; // 避免除以零
    const totalCents = this.toCents(this.toCents(a)) / this.toCents(b);
    return this.formatDecimal(_.round(totalCents / 100, 2)); // 直接得到两位小数的数字
  },
};

export default Money;

```

## 封装输入组件

增加千分位分隔符和保留两位小数自动补0

弃用InputNumber组件，使用Input自定义

``` vue
<template>
  <!-- <ElInputNumber
    class="w-[180px]"
    v-model="modelValue"
    v-bind="AMOUNT_PROP"
    :controls="false"
    clearable
    :max="max"
    :formatter="formatNumber"
    :parser="parseNumber"
  >
    <template #suffix>
      <span class="text-sm">{{ unit }}</span>
    </template>
  </ElInputNumber> -->
  <ElInput
    class="w-[180px]"
    clearable
    v-model="modelValue"
    :formatter="handleFormatter"
    :parser="handleParser"
    @blur="handleBlur"
  >
    <template #suffix>
      <span class="text-sm">{{ unit }}</span>
    </template>
  </ElInput>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus';

import {
  addThousandSeparatorForElementPlus,
  removeThousandSeparatorForElementPlus,
} from '@handsomewolf/num-utils';
import Money from '@/utils/caculate';

const { unit = '元', max = 999999999999999 } = defineProps<{
  unit?: string;
  max?: number;
}>();

const emit = defineEmits(['blur']);

function handleBlur() {
  const formatterVal = modelValue.value;
  modelValue.value = Money.formatDecimal(formatterVal);
  emit('blur', formatterVal);
}

function handleFormatter(val) {
  return addThousandSeparatorForElementPlus(val);
}

function handleParser(val) {
  const parserVal = removeThousandSeparatorForElementPlus(val, {
    defaultReturn: '0',
    decimalPlaces: 2,
  });
  if (Number(parserVal) > max) return max + '';
  return parserVal;
}

const modelValue = defineModel<string>();
</script>

```

## 使用

合同金额（根据含税金额和税率自动计算不含税金额和增值税额）

``` vue
<template>
  <div v-for="item in amountType" :key="item.amountTypeName">
    <p class="flex-row-center">
      <label class="label">含税金额</label>
      <AmountInput
        :disabled="disabled"
        v-model="type.taxInclusiveAmount"
        @change="(val) => handleChangeTaxAmount(index, val)"
      />
    </p>
    <p class="flex-row-center">
      <label class="label">适用税率</label>
      <AmountInput
        :disabled="disabled"
        v-model="type.taxRate"
        :max="100"
        unit="%"
        @change="() => handleChangeTaxRate(index)"
      />
    </p>
    <p class="flex-row-center text-right">
      <label class="label">不含税金额</label>
      <AmountInput :disabled="true" v-model="type.taxExclusiveAmount" />
    </p>
    <p class="flex-row-center">
      <label class="label">增值税额</label>
      <AmountInput :disabled="true" v-model="type.addedTax" />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es';

const amountType = ref([
  {
    amountTypeName: '设备采购',
    // 含税金额
    taxInclusiveAmount: '0',
    // 税率
    taxRate: '0',
    // 不含税金额
    taxExclusiveAmount: '0',
    // 增值税额
    addedTax: '0',
    amountType: EAmountType.DevicePurchase,
  },
  {
    amountTypeName: '技术服务',
    taxInclusiveAmount: '0',
    taxRate: '0',
    taxExclusiveAmount: '0',
    addedTax: '0',
    amountType: EAmountType.TechnicalService,
  },
  {
    amountTypeName: '其他',
    taxInclusiveAmount: '0',
    taxRate: '0',
    taxExclusiveAmount: '0',
    addedTax: '0',
    amountType: EAmountType.Other,
  },
]);

// 不含税金额 = 含税金额 ÷ (1 + 税率)
//                           这里税率是个百分数，需要除以100
// 增值税额=含税金额-不含税金额
function handleChangeTaxAmount(index: number, val: string) {
  const curItem = cloneDeep(amountType.value[index]);
  if (!curItem.taxRate || curItem.taxRate === '0') return;
  const taxRate = 1 + Number(curItem.taxRate) / 100;
  curItem.taxExclusiveAmount = String(Money.divide(val, taxRate));
  curItem.addedTax = String(Money.subtract(val, curItem.taxExclusiveAmount));
  amountType.value[index] = curItem;
}

// 改变税率
function handleChangeTaxRate(index: number) {
  const curItem = cloneDeep(amountType.value[index]);
  if (!curItem.taxInclusiveAmount || curItem.taxInclusiveAmount === '0') return;
  handleChangeTaxAmount(index, curItem.taxInclusiveAmount);
}
</script>
```