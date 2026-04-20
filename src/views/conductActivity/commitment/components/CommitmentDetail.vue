<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">报告名称</span>
      <span class="detail-row__value">{{ model?.reportName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">状态</span>
      <span class="detail-row__value">{{ model?.status || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">发起人</span>
      <span class="detail-row__value">{{ model?.initiator || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">开始时间</span>
      <span class="detail-row__value">{{ model?.startTime || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">结束时间</span>
      <span class="detail-row__value">{{ model?.endTime || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">应填报科室</span>
      <span class="detail-row__value">{{ model?.targetDepartmentCount ?? '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">已填报科室</span>
      <span class="detail-row__value">{{ model?.submittedDepartmentCount ?? '-' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommitmentItem } from '../src/types/commitment'

defineProps<{
  model?: CommitmentItem
}>()
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
