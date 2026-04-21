<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="96">
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="考评表名称" path="tableName" :span="2">
        <n-input v-model:value="model.tableName" placeholder="请输入考评表名称" maxlength="50" show-count />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import type { DepartmentAssessmentTableForm } from '../src/types/table'

const model = defineModel<DepartmentAssessmentTableForm>({
  default: {
    tableName: ''
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  tableName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入考评表名称'
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
