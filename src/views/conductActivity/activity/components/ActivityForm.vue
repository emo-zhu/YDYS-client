<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="92">
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="活动标题" path="title" :span="2">
        <n-input v-model:value="model.title" placeholder="请输入活动标题" maxlength="50" show-count />
      </n-form-item-gi>
      <n-form-item-gi label="开展日期段" path="activityDateRange" :span="2">
        <n-date-picker
          v-model:value="model.activityDateRange"
          type="daterange"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </n-form-item-gi>
      <n-form-item-gi label="活动组织部门" path="department">
        <n-input v-model:value="model.department" placeholder="请输入活动组织部门" />
      </n-form-item-gi>
      <n-form-item-gi label="活动录入日期" path="entryDate">
        <n-date-picker type="date" value-format="yyyy-MM-dd" v-model:formatted-value="model.entryDate" clearable />
      </n-form-item-gi>
      <n-form-item-gi label="录入人信息" path="entryUser">
        <n-input v-model:value="model.entryUser" placeholder="请输入录入人信息" />
      </n-form-item-gi>
      <n-form-item-gi label="活动状态" path="status">
        <n-select v-model:value="model.status" :options="statusOptions" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import type { ActivityForm, ActivityStatus } from '../src/types/activity'
import { statusOptions } from '../src/hooks/activity'

const model = defineModel<ActivityForm>({
  default: {
    title: '',
    activityDateRange: null,
    department: '',
    entryDate: '',
    entryUser: '',
    status: '未发布' as ActivityStatus
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入活动标题'
  },
  activityDateRange: {
    required: true,
    type: 'array',
    trigger: ['change', 'blur'],
    message: '请选择开展日期段'
  },
  department: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入活动组织部门'
  },
  entryDate: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择活动录入日期'
  },
  entryUser: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入录入人信息'
  },
  status: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择活动状态'
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
