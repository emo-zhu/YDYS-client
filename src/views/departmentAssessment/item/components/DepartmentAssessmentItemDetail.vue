<template>
  <div class="detail-panel">
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-row__label">考评项名称</span>
        <span class="detail-row__value">{{ model?.itemName || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">排序号</span>
        <span class="detail-row__value">{{ model?.sortOrder ?? '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">考评项类型</span>
        <span class="detail-row__value">{{ model?.itemTypeName || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">固定分</span>
        <span class="detail-row__value">{{ model?.fixedScore ?? '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">最低分</span>
        <span class="detail-row__value">{{ model?.minScore ?? '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">最高分</span>
        <span class="detail-row__value">{{ model?.maxScore ?? '-' }}</span>
      </div>
      <div class="detail-row detail-row--top">
        <span class="detail-row__label">加减分条款</span>
        <div class="detail-row__value detail-row__value--tags">
          <n-tag v-for="name in model?.clauseNames || []" :key="name" size="small" type="info" round>
            {{ name }}
          </n-tag>
          <span v-if="!model?.clauseNames?.length">-</span>
        </div>
      </div>
      <div class="detail-row detail-row--top">
        <span class="detail-row__label">考评项说明</span>
        <span class="detail-row__value">{{ model?.description || '-' }}</span>
      </div>
      <div class="detail-row detail-row--top">
        <span class="detail-row__label">计算分公式</span>
        <span class="detail-row__value">{{ model?.formula || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DepartmentAssessmentItem } from '../src/types/item'

defineProps<{
  model?: DepartmentAssessmentItem
}>()
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 20px;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 12px;
  align-items: start;
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
  white-space: pre-wrap;
  word-break: break-all;
}

.detail-row__value--tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
