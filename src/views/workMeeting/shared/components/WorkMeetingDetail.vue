<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">状态</span>
      <span class="detail-row__value">{{ model?.status || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">考核年度</span>
      <span class="detail-row__value">{{ model?.assessmentYear || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">{{ periodLabel }}</span>
      <span class="detail-row__value">{{ model?.assessmentPeriod || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">科室</span>
      <span class="detail-row__value">{{ model?.departmentName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">填报人</span>
      <span class="detail-row__value">{{ model?.reporterName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">填报人工号</span>
      <span class="detail-row__value">{{ model?.reporterJobNo || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">填报时间</span>
      <span class="detail-row__value">{{ model?.reportTime || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">附件</span>
      <span class="detail-row__value">{{ model?.attachmentName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">备注</span>
      <span class="detail-row__value">{{ model?.remarks || '-' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { workMeetingConfigMap } from '../config'
import type { WorkMeetingItem, WorkMeetingType } from '../types'

const props = defineProps<{
  model?: WorkMeetingItem
  type: WorkMeetingType
}>()

const periodLabel = computed(() => workMeetingConfigMap[props.type].periodLabel || '考核周期')
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
