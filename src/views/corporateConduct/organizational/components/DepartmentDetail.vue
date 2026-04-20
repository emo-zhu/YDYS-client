<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">考评单元名称</span>
      <span class="detail-row__value">{{ model?.name || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">科室负责人</span>
      <span class="detail-row__value">{{ displayText(model?.leader) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">党支部书记</span>
      <span class="detail-row__value">{{ displayText(model?.secretary) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">其他成员</span>
      <span class="detail-row__value">{{ displayText(model?.members) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DepartmentRow } from '../src/types/organizational'

defineProps<{
  model?: DepartmentRow
}>()

const displayText = (value?: string) => {
  const text = (value || '').trim()
  return text || '--'
}
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 12px;
  align-items: start;
}

.detail-row__label {
  color: #606266;
  font-weight: 600;
}

.detail-row__value {
  color: #303133;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
