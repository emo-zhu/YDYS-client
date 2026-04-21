<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="112">
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="科室考评组名称" path="groupName" :span="2">
        <n-input v-model:value="model.groupName" placeholder="请输入科室考评组名称" maxlength="50" show-count />
      </n-form-item-gi>
      <n-form-item-gi label="科室考评排序号" path="sortOrder">
        <n-input-number v-model:value="model.sortOrder" :min="0" placeholder="请输入" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="考评科室统计范围" path="departmentIds" :span="2">
        <n-tree-select
          v-model:value="model.departmentIds"
          :options="departmentOptions"
          multiple
          clearable
          filterable
          checkable
          cascade
          placeholder="请选择"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules, TreeSelectOption } from 'naive-ui'
import { ref } from 'vue'
import type { DepartmentAssessmentScopeForm } from '../src/types/scope'

defineProps<{
  departmentOptions: TreeSelectOption[]
}>()

const model = defineModel<DepartmentAssessmentScopeForm>({
  default: {
    groupName: '',
    sortOrder: 0,
    departmentIds: []
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  groupName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入科室考评组名称'
  },
  sortOrder: {
    required: true,
    type: 'number',
    trigger: ['blur', 'change'],
    message: '请输入科室考评排序号'
  },
  departmentIds: {
    required: true,
    type: 'array',
    trigger: ['change', 'blur'],
    message: '请选择考评科室统计范围'
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
