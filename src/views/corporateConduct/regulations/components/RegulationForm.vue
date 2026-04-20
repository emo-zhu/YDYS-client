<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="84">
    <n-form-item label="文件类型" path="fileType">
      <n-select v-model:value="model.fileType" :options="fileTypeOptions" />
    </n-form-item>
    <n-form-item label="标题" path="title">
      <n-input v-model:value="model.title" placeholder="请输入标题" />
    </n-form-item>
    <n-form-item label="发布时间" path="publishDate">
      <n-date-picker type="date" value-format="yyyy-MM-dd" v-model:formatted-value="model.publishDate" clearable />
    </n-form-item>
    <n-form-item label="发布内容" path="contentName">
      <n-input v-model:value="model.contentName" placeholder="请输入发布内容文件名" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { fileTypeOptions } from '../src/hooks/regulation'
import type { RegulationForm, RegulationFileType } from '../src/types/regulation'

const model = defineModel<RegulationForm>({
  default: {
    fileType: '规章制度' as RegulationFileType,
    title: '',
    publishDate: '',
    contentName: ''
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  fileType: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择文件类型'
  },
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入标题'
  },
  publishDate: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择发布时间'
  },
  contentName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入发布内容文件名'
  }
}

const getData = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors) => {
      if (!errors) {
        resolve(true)
        return
      }
      window.$message?.warning('请完善表单内容')
      reject(false)
    })
  })
}

defineExpose({ getData })
</script>
