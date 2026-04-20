<template>
  <n-form label-placement="left" label-width="72">
    <n-form-item label="内容">
      <n-input v-model:value="model.value" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 3, maxRows: 8 }" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { SummaryForm } from '../src/types/organizational'

const model = defineModel<SummaryForm>({
  default: {
    label: '',
    value: ''
  }
})
</script>
