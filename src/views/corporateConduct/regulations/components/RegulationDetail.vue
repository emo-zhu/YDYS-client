<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">文件类型</span>
      <span class="detail-row__value">{{ model?.fileType || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">标题</span>
      <span class="detail-row__value">{{ model?.title || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">发布时间</span>
      <span class="detail-row__value">{{ model?.publishDate || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">发布内容</span>
      <span class="detail-row__value">{{ model?.contentName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">浏览次数</span>
      <span class="detail-row__value">{{ model?.browseCount ?? '-' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RegulationItem } from '../src/types/regulation'

defineProps<{
  model?: RegulationItem
}>()
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: 84px 1fr;
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
