<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="104">
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="报告名称" path="reportName" :span="2">
        <n-input v-model:value="model.reportName" placeholder="请输入自查自纠报告名称" maxlength="50" show-count />
      </n-form-item-gi>
      <n-form-item-gi label="起止时间" path="timeRange" :span="2">
        <n-date-picker
          v-model:value="model.timeRange"
          type="datetimerange"
          clearable
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </n-form-item-gi>
      <n-form-item-gi label="发起人" path="initiator">
        <n-input v-model:value="model.initiator" placeholder="请输入发起人" />
      </n-form-item-gi>
      <n-form-item-gi label="状态" path="status">
        <n-select v-model:value="model.status" :options="statusOptions" />
      </n-form-item-gi>
      <n-form-item-gi label="应填报科室" path="targetDepartmentCount">
        <n-input-number v-model:value="model.targetDepartmentCount" :min="0" placeholder="请输入应填报科室数" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="已填报科室" path="submittedDepartmentCount">
        <n-input-number v-model:value="model.submittedDepartmentCount" :min="0" placeholder="请输入已填报科室数" style="width: 100%" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { statusOptions } from '../src/hooks/selfCheck'
import type { SelfCheckForm, SelfCheckStatus } from '../src/types/selfCheck'

const model = defineModel<SelfCheckForm>({
  default: {
    reportName: '',
    timeRange: null,
    initiator: '',
    targetDepartmentCount: 0,
    submittedDepartmentCount: 0,
    status: '进行中' as SelfCheckStatus
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  reportName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入自查自纠报告名称'
  },
  timeRange: {
    required: true,
    type: 'array',
    trigger: ['change', 'blur'],
    message: '请选择起止时间'
  },
  initiator: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入发起人'
  },
  targetDepartmentCount: {
    required: true,
    type: 'number',
    trigger: ['change', 'blur'],
    message: '请输入应填报科室数'
  },
  submittedDepartmentCount: {
    required: true,
    type: 'number',
    trigger: ['change', 'blur'],
    validator: (_rule, value: number) => {
      if (value === undefined || value === null) {
        return new Error('请输入已填报科室数')
      }
      if ((model.value.targetDepartmentCount || 0) < value) {
        return new Error('已填报科室数不能大于应填报科室数')
      }
      return true
    }
  },
  status: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择状态'
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
