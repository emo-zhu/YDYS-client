<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="72">
    <n-form-item label="用户名" path="userName">
      <n-input v-model:value="model.userName" placeholder="请输入用户名" />
    </n-form-item>
    <n-form-item label="工号" path="jobNumber">
      <n-input v-model:value="model.jobNumber" placeholder="请输入工号" />
    </n-form-item>
    <n-form-item label="姓名" path="realName">
      <n-input v-model:value="model.realName" placeholder="请输入姓名" />
    </n-form-item>
    <n-form-item label="性别" path="gender">
      <n-select v-model:value="model.gender" :options="genderOptions" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { genderOptions } from '../src/hooks/user'
import type { GenderType, UserForm } from '../src/types/user'

const model = defineModel<UserForm>({
  default: {
    userName: '',
    jobNumber: '',
    realName: '',
    gender: '女' as GenderType
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  userName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名'
  },
  jobNumber: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入工号'
  },
  realName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入姓名'
  },
  gender: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择性别'
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
