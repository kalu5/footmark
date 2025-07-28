# Element Plus Form表单封装

## 通过配置选项使用Form, 提升开发效率

### Form组件封装

- CustomForm
``` vue 
<template>
  <ElForm
    :model="formData"
    :rules="rules"
    :inline="inline"
    :size="size"
    ref="formRef"
    v-bind="$attrs"
  >
    <ElRow v-if="showSpan" :gutter="20">
      <ElCol v-for="item of schemas" :key="item.prop" :span="item.span ?? 24">
        <ElFormItem
          :label="item.label ? item.label + '：' : ''"
          :prop="item.prop"
        >
          <slot :name="item.prop">
            <component
              :is="getComponent(item.type)"
              v-model="formData[item.prop]"
              v-bind="getProps(item)"
            ></component>
          </slot>
        </ElFormItem>
      </ElCol>
      <ElCol :span="6">
        <slot name="btns"></slot>
      </ElCol>
    </ElRow>
    <template v-else>
      <ElFormItem v-for="item of schemas" :label="item.label" :key="item.prop">
        <slot :name="item.prop">
          <component
            :is="getComponent(item.type)"
            v-model="formData[item.prop]"
            v-bind="getProps(item)"
          ></component>
        </slot>
      </ElFormItem>
      <slot name="btns"></slot>
    </template>
  </ElForm>
</template>

<script lang="ts" setup>
import { IFormSchemas, TFormType } from '@/type/table'
import {
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  FormInstance,
  FormRules,
  ElRow,
  ElCol,
  ComponentSize,
  FormValidateCallback,
  ElInputNumber,
} from 'element-plus'
import { useTemplateRef } from 'vue'
import CustomSelect from './CustomSelect.vue'
import FileUpload from '../FileUpload.vue'

withDefaults(
  defineProps<{
    schemas: IFormSchemas[]
    formData: Record<string, any>
    rules?: FormRules<Record<string, any>>
    showSpan?: boolean
    size?: ComponentSize
    inline?: boolean
  }>(),
  {
    rules: () => ({}),
    showSpan: true,
    size: 'small',
    inline: false,
  },
)

const defaultProps = ['label', 'prop', 'type', 'span']

const componentMap = {
  input: ElInput,
  select: CustomSelect,
  'date-picker': ElDatePicker,
  upload: FileUpload,
  'input-number': ElInputNumber,
}

const formRef = useTemplateRef<FormInstance>('formRef')

// 获取组件
function getComponent(type: TFormType) {
  if (type && typeof type !== 'string') {
    return type
  }
  return componentMap[type as string]
}

// 获取属性
function getProps(item: IFormSchemas) {
  const props = {}
  Object.keys(item).forEach((key) => {
    if (!defaultProps.includes(key)) {
      props[key] = item[key]
    }
  })
  const newProps = {
    ...props,
    ...item.componentProps,
  }
  return newProps
}

function validate(callback?: FormValidateCallback) {
  return formRef?.value?.validate(callback)
}

function reset() {
  formRef?.value?.resetFields()
}

defineExpose({
  validate,
  reset,
})
</script>

```

- CustomSelect

``` vue
<template>
  <ElSelect v-model="model" v-bind="$attrs">
    <ElOption
      v-for="item of options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></ElOption>
    <component v-if="$slots" :is="h('template', $slots)"></component>
  </ElSelect>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption } from 'element-plus'
import { h } from 'vue'

withDefaults(
  defineProps<{
    modelValue: string
    options: {
      label: string
      value: string
    }[]
  }>(),
  {},
)

const model = defineModel()
</script>

```

- 类型定义
``` ts
import { FormRules, ComponentSize } from 'element-plus'
// 表单配置项
export interface IFormOptions {
  schemas: IFormSchemas[]
  formData: Record<string, any>
  rules?: FormRules<Record<string, any>>
  showSpan?: boolean
  size?: ComponentSize
  inline?: boolean
}

export type TRenderComponent = (...args: any) => any
// 表单类型
export type TFormType =
  | 'input'
  | 'select'
  | 'custom'
  | 'date-picker'
  | 'select'
  | TRenderComponent
  | 'upload'
  | 'input-number'
// 表单项
export interface IFormSchemas {
  label?: string
  prop: string
  type: TFormType
  // 占用的列
  span?: number
  placeholder?: string
  // 组件参数
  componentProps?: Record<string, any>
  disabled?: boolean
  [key: string]: any
}

```

### 封装自定义hooks useForm

``` ts
import CustomForm from '@/components/form/CustomForm.vue'
import { h, reactive, ref } from 'vue'
import type { IFormOptions } from './typing'

export default function useForm(options: IFormOptions) {
  const _formRef = ref()
  function FormComponent(props, { slots }) {
    return h(
      CustomForm,
      {
        ref: _formRef,
        ...reactive(options),
        ...reactive(props),
      },
      slots,
    )
  }

  async function validate(callback) {
    return _formRef.value?.validate(callback)
  }

  function reset() {
    return _formRef.value?.reset()
  }

  return [
    FormComponent,
    {
      validate,
      reset,
    },
  ]
}

```

