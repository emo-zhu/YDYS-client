<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">科室考评组名称</span>
      <span class="detail-row__value">{{ model?.groupName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">科室考评排序号</span>
      <span class="detail-row__value">{{ model?.sortOrder ?? '-' }}</span>
    </div>
    <div class="detail-row detail-row--top">
      <span class="detail-row__label">考评科室统计范围</span>
      <div class="detail-row__value detail-row__value--tags">
        <n-tag v-for="name in model?.departmentNames || []" :key="name" type="info" size="small" round>
          {{ name }}
        </n-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DepartmentAssessmentScopeItem } from '../src/types/scope'

defineProps<{
  model?: DepartmentAssessmentScopeItem
}>()
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 14px;
}

.detail-row {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 12px;
  align-items: center;
}

.detail-row--top {
  align-items: start;
}

.detail-row__label {
  color: #606266;
  font-weight: 600;
}

.detail-row__value {
  color: #303133;
  line-height: 1.6;
  word-break: break-all;
}

.detail-row__value--tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
