<template>
  <div class="detail-panel">
    <div class="detail-row">
      <span class="detail-row__label">用户名</span>
      <span class="detail-row__value">{{ model?.userName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">工号</span>
      <span class="detail-row__value">{{ model?.jobNumber || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">姓名</span>
      <span class="detail-row__value">{{ model?.realName || '-' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-row__label">性别</span>
      <span class="detail-row__value">{{ model?.gender || '-' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserItem } from '../src/types/user'

defineProps<{
  model?: UserItem
}>()
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: 72px 1fr;
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
}
</style>
