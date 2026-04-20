<template>
  <div class="commitment-card">
    <template v-if="model">
      <div class="commitment-card__header">
        <div class="commitment-card__title">{{ model.title }}</div>
        <span class="status-tag">{{ model.status }}</span>
      </div>

      <div class="commitment-card__content">
        <div class="info-row">
          <span class="info-row__label">开始时间：</span>
          <span class="info-row__value">{{ model.startTime || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="info-row__label">驳回理由：</span>
          <span class="info-row__value">{{ model.rejectReason || '-' }}</span>
        </div>
      </div>

      <div class="commitment-card__footer">
        <n-button type="info" :loading="loading" @click="emit('sign', model.id)">
          {{ model.signatureName ? '重新签署承诺书' : model.actionText }}
        </n-button>
      </div>
    </template>
    <div v-else class="commitment-card__empty">暂无承诺书数据</div>
  </div>
</template>

<script lang="ts" setup>
import type { PersonalCommitmentItem } from '../src/types/personalCommitment'

defineProps<{
  model?: PersonalCommitmentItem
  loading?: boolean
}>()

const emit = defineEmits<{
  (event: 'sign', id: number): void
}>()
</script>

<style scoped lang="scss">
.commitment-card {
  min-height: 216px;
  padding: 24px 28px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 12px rgb(0 0 0 / 4%);
}

.commitment-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.commitment-card__title {
  color: #303133;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 30px;
  padding: 0 14px;
  border-radius: 15px;
  color: #fff;
  background: linear-gradient(90deg, #49a5ff 0%, #1f78ff 100%);
  font-size: 14px;
}

.commitment-card__content {
  display: grid;
  gap: 18px;
  margin-bottom: 32px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

.info-row__label {
  color: #606266;
  font-size: 15px;
}

.info-row__value {
  color: #303133;
  font-size: 15px;
}

.commitment-card__footer {
  display: flex;
  justify-content: flex-start;
}

.commitment-card__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 168px;
  color: #909399;
  font-size: 14px;
}
</style>
