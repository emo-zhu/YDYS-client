<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">活动标题</span>
      <span class="detail-row__value">{{ model?.title || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">活动状态</span>
      <span class="detail-row__value">{{ model?.status || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">活动开展时间</span>
      <span class="detail-row__value">{{ activityDateText }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">活动组织部门</span>
      <span class="detail-row__value">{{ model?.department || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">活动录入日期</span>
      <span class="detail-row__value">{{ model?.entryDate || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">录入人信息</span>
      <span class="detail-row__value">{{ model?.entryUser || '-' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ActivityItem } from '../src/types/activity'
import { getActivityDateText } from '../src/api/activity'

const props = defineProps<{
  model?: ActivityItem
}>()

const activityDateText = computed(() => {
  if (!props.model) {
    return '-'
  }
  return getActivityDateText(props.model)
})
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
