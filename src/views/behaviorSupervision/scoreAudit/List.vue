<template>
  <page :page-tabs="[{ label: '日常加减分审核', value: '1' }]">
    <page-body>
      <page-body-header>
        <div class="query-toolbar">
          <span class="search-label">搜索条件：</span>
          <j-search
            v-model:value="scoreAuditPage.query.keywords"
            width="320px"
            placeholder="请输入姓名、工号"
            @search="scoreAuditPage.onSearch"
            :reset="true"
            @reset="scoreAuditPage.onReset"
            class="score-audit-search"
          />
        </div>
        <n-space :wrap="false" size="small" class="score-audit-actions">
          <j-button round :disabled="scoreAuditPage.batchApproveDisabled.value" @click="scoreAuditPage.onBatchApprove">
            批量审批
          </j-button>
          <j-button round :disabled="scoreAuditPage.batchRejectDisabled.value" @click="scoreAuditPage.onBatchReject">
            批量驳回
          </j-button>
        </n-space>
      </page-body-header>
      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          class="score-audit-table"
          :columns="columns"
          :data="scoreAuditPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="scoreAuditPage.rowKey"
          :scroll-x="scoreAuditPage.tableScrollX.value"
          :loading="scoreAuditPage.loading.value"
          v-model:checked-row-keys="scoreAuditPage.checkedRowKeys.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="scoreAuditPage.query"
          :page-data="scoreAuditPage.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="scoreAuditPage.loadPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>
    <View />
  </page>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { renderOperation, renderTextButton } from 'junegoo-ui'
import { h, onMounted } from 'vue'
import View from './View.vue'
import { useScoreAuditModule } from './src/hooks/scoreAudit'
import type { ScoreAuditItem } from './src/types/scoreAudit'

const { scoreAuditPage } = useScoreAuditModule()

const statusClassMap = {
  审核中: 'status-tag--reviewing',
  已通过: 'status-tag--approved',
  已驳回: 'status-tag--rejected',
} as const

const columns: DataTableColumns<ScoreAuditItem> = [
  {
    type: 'expand',
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h('div', { class: 'expand-panel' }, [
        h('div', { class: 'expand-row' }, [
          h('span', { class: 'expand-row__label' }, '行为描述：'),
          h('span', { class: 'expand-row__value' }, row.behaviorDescription || ''),
        ]),
        h('div', { class: 'expand-row' }, [
          h('span', { class: 'expand-row__label' }, '事件概述：'),
          h('span', { class: 'expand-row__value' }, row.eventSummary || ''),
        ]),
        h('div', { class: 'expand-row' }, [
          h('span', { class: 'expand-row__label' }, '佐证材料：'),
          h('span', { class: 'expand-row__value' }, row.evidenceMaterial || ''),
        ]),
        h('div', { class: 'expand-row' }, [
          h('span', { class: 'expand-row__label' }, '流程状态：'),
          h('span', { class: 'expand-row__value' }, row.processStatus || ''),
        ]),
      ])
    },
  },
  {
    type: 'selection',
    width: 56,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(row) {
      return h(
        'span',
        { class: ['status-tag', statusClassMap[row.status]] },
        scoreAuditPage.getStatusText(row.status),
      )
    },
  },
  {
    title: '考核年度',
    key: 'assessmentYear',
    width: 120,
  },
  {
    title: '姓名',
    key: 'userName',
    width: 160,
    ellipsis: { tooltip: true },
    render(row) {
      return renderTextButton(row.userName, () => {
        scoreAuditPage.onOpenDetail(row)
      })
    },
  },
  {
    title: '工号',
    key: 'jobNumber',
    width: 160,
    ellipsis: { tooltip: true },
  },
  {
    title: '事件发生科室',
    key: 'eventDepartment',
    width: 240,
    ellipsis: { tooltip: true },
  },
  {
    title: '申报人',
    key: 'applicant',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '加减分',
    key: 'score',
    width: 110,
    render(row) {
      return h('span', { class: 'score-tag' }, row.score > 0 ? `+ ${row.score}` : `${row.score}`)
    },
  },
  {
    title: '金额',
    key: 'amount',
    width: 110,
  },
  {
    title: '事件发生时间',
    key: 'eventTime',
    width: 160,
  },
  {
    title: '操作',
    key: 'operation',
    width: 220,
    fixed: 'right',
    align: 'center',
    render(row) {
      return renderOperation(
        row.status === '审核中'
          ? [
              {
                label: '编辑',
                event() {
                  scoreAuditPage.onEdit(row)
                },
              },
              {
                label: '审批',
                event() {
                  scoreAuditPage.onApprove(row)
                },
              },
              {
                label: '驳回',
                event() {
                  scoreAuditPage.onReject(row)
                },
              },
              {
                label: '流程',
                event() {
                  scoreAuditPage.onOpenProcess(row)
                },
              },
            ]
          : [
              {
                label: '详情',
                event() {
                  scoreAuditPage.onOpenDetail(row)
                },
              },
              {
                label: '流程',
                event() {
                  scoreAuditPage.onOpenProcess(row)
                },
              },
            ],
      )
    },
  },
]

onMounted(() => {
  scoreAuditPage.getPage()
})
</script>

<style scoped lang="scss">
.query-toolbar {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-label {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  margin-right: 8px;
}

.score-audit-search {
  flex: 1;
  min-width: 0;
}

.score-audit-search :deep(.n-input) {
  flex: 1;
  min-width: 220px;
}

.score-audit-actions {
  margin-left: 16px;
  flex-shrink: 0;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid transparent;
}

.status-tag--reviewing {
  color: #ff4d4f;
  background: #fff1f0;
  border-color: #ffccc7;
}

.status-tag--approved {
  color: #389e0d;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.status-tag--rejected {
  color: #d46b08;
  background: #fff7e6;
  border-color: #ffd591;
}

.score-tag {
  display: inline-block;
  min-width: 48px;
  padding: 2px 10px;
  color: #ff4d4f;
  background: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  text-align: center;
  line-height: 1.4;
}

.expand-panel {
  display: grid;
  gap: 8px;
  padding: 4px 0;
}

.expand-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.6;
  color: #606266;
}

.expand-row__label {
  flex-shrink: 0;
  color: #303133;
  font-weight: 500;
}

.expand-row__value {
  word-break: break-all;
}
</style>
