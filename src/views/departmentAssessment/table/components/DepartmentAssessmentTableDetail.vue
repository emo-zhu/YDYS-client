<template>
  <div class="detail-panel">
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-row__label">考评表名称</span>
        <span class="detail-row__value">{{ model?.tableName || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">操作时间</span>
        <span class="detail-row__value">{{ model?.updatedAt || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-row__label">考评项数量</span>
        <span class="detail-row__value">{{ model?.itemCount ?? '-' }}</span>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section__title">考评项预览</div>
      <n-data-table
        class="preview-table"
        :columns="columns"
        :data="model?.items || []"
        :single-line="false"
        :bordered="true"
        :pagination="false"
        size="small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import type { DepartmentAssessmentRuleTableDetail, DepartmentAssessmentTableRuleItem } from '../src/types/table'

defineProps<{
  model?: DepartmentAssessmentRuleTableDetail
}>()

const columns: DataTableColumns<DepartmentAssessmentTableRuleItem> = [
  {
    title: '排序号',
    key: 'sort',
    width: 88,
    align: 'center'
  },
  {
    title: '考评项名称',
    key: 'itemName',
    minWidth: 220,
    ellipsis: { tooltip: true }
  },
  {
    title: '考评项类型',
    key: 'itemTypeName',
    width: 140
  },
  {
    title: '固定分',
    key: 'fixedScore',
    width: 96,
    render(row) {
      return row.fixedScore ?? '-'
    }
  },
  {
    title: '最低分',
    key: 'minScore',
    width: 96,
    render(row) {
      return row.minScore ?? '-'
    }
  },
  {
    title: '最高分',
    key: 'maxScore',
    width: 96,
    render(row) {
      return row.maxScore ?? '-'
    }
  }
]
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

:deep(.preview-table .n-data-table-th) {
  background: #f8fafc;
  font-weight: 600;
}
</style>
