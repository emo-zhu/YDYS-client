<template>
  <n-form label-placement="left" label-width="88">
    <n-form-item label="科室负责人">
      <n-input v-model:value="model.leader" placeholder="请输入科室负责人" />
    </n-form-item>
    <n-form-item label="党支部书记">
      <n-input v-model:value="model.secretary" placeholder="请输入党支部书记" />
    </n-form-item>
    <n-form-item label="其他成员">
      <n-input
        v-model:value="model.members"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6 }"
        placeholder="请输入其他成员"
      />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { DepartmentForm } from '../src/types/organizational'

const model = defineModel<DepartmentForm>({
  default: {
    leader: '',
    secretary: '',
    members: ''
  }
})
</script>
