<template>
  <div class="detail-panel">
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-row__label">姓名</span>
        <span class="detail-row__value">{{ model?.staffName || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">工号</span>
        <span class="detail-row__value">{{ model?.staffNo || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">档案年度</span>
        <span class="detail-row__value">{{ model?.archiveYear || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">档案编号</span>
        <span class="detail-row__value">{{ model?.archiveCode || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">所属科室</span>
        <span class="detail-row__value">{{ model?.departmentName || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">岗位</span>
        <span class="detail-row__value">{{ model?.positionName || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">档案状态</span>
        <span class="detail-row__value">
          <span v-if="model" class="status-tag" :class="getStatusClass(model.archiveStatus)">
            {{ model.archiveStatus }}
          </span>
          <span v-else>-</span>
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">考评等级</span>
        <span class="detail-row__value">
          <span v-if="model" class="level-tag" :class="getLevelClass(model.assessmentLevel)">
            {{ model.assessmentLevel }}
          </span>
          <span v-else>-</span>
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">综合得分</span>
        <span class="detail-row__value">{{ model?.score ?? '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">更新时间</span>
        <span class="detail-row__value">{{ model?.updatedAt || '-' }}</span>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__title">年度档案概况</div>
      <div class="summary-cards">
        <div class="summary-card">
          <span class="summary-card__label">表扬次数</span>
          <strong class="summary-card__value">{{ model?.rewardCount ?? 0 }}</strong>
        </div>
        <div class="summary-card">
          <span class="summary-card__label">投诉次数</span>
          <strong class="summary-card__value">{{ model?.complaintCount ?? 0 }}</strong>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__title">表现亮点</div>
      <div class="detail-block">{{ model?.highlights || '-' }}</div>
    </div>

    <div class="detail-section">
      <div class="detail-section__title">整改计划</div>
      <div class="detail-block">{{ model?.improvementPlan || '-' }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getLevelClass, getStatusClass } from '../src/hooks/archive'
import type { StaffArchiveDetail } from '../src/types/archive'

defineProps<{
  model?: StaffArchiveDetail
}>()
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
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
  word-break: break-all;
}

.detail-section {
  display: grid;
  gap: 12px;
}

.detail-section__title {
  color: #303133;
  font-size: 15px;
  font-weight: 600;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}

.summary-card__label {
  color: #606266;
}

.summary-card__value {
  font-size: 24px;
  color: #1f2937;
}

.detail-block {
  padding: 14px 16px;
  border-radius: 10px;
  background: #f8fafc;
  color: #303133;
  line-height: 1.7;
  white-space: pre-wrap;
}

.status-tag,
.level-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid transparent;
}

.status-tag--done,
.level-tag--excellent {
  color: #389e0d;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.status-tag--progress,
.level-tag--good {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.status-tag--pending,
.level-tag--pass {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}
</style>
