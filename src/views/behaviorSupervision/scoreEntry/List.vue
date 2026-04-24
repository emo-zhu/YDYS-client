<template>
  <page :page-tabs="[{ label: '日常加减分录入', value: '1' }]">
    <page-body>
      <page-body-header>
        <div class="query-toolbar">
          <!-- <span class="search-label">搜索条件：</span> -->
          <j-search
            v-model:value="scoreEntryPage.query.keywords"
            width="320px"
            placeholder="请输入姓名、工号"
            @search="scoreEntryPage.onSearch"
            :reset="true"
            @reset="scoreEntryPage.onReset"
            class="score-entry-search"
          />
        </div>
        <n-space :wrap="false" size="small" class="score-entry-actions">
          <j-button type="info" round @click="scoreEntryPage.openAdd('plus')">新增加分行为</j-button>
          <j-button type="info" round @click="scoreEntryPage.openAdd('minus')">新增减分行为</j-button>
          <j-button round @click="scoreEntryPage.onBatchImport">批量导入</j-button>
          <j-button round :disabled="scoreEntryPage.batchSubmitDisabled.value" @click="scoreEntryPage.onBatchSubmit">
            批量报审
          </j-button>
          <j-button round :disabled="scoreEntryPage.batchWithdrawDisabled.value" @click="scoreEntryPage.onBatchWithdraw">
            批量撤回
          </j-button>
          <j-button
            round
            :disabled="scoreEntryPage.checkedRowKeys.value.length === 0"
            @click="scoreEntryPage.onBatchDelete"
          >
            删除
          </j-button>
        </n-space>
      </page-body-header>
      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          :columns="columns"
          :data="scoreEntryPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="scoreEntryPage.rowKey"
          :scroll-x="scoreEntryPage.tableScrollX.value"
          :loading="scoreEntryPage.loading.value"
          v-model:checked-row-keys="scoreEntryPage.checkedRowKeys.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="scoreEntryPage.query"
          :page-data="scoreEntryPage.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="scoreEntryPage.loadPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>
    <Add />
    <Edit />
    <View />
  </page>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import { renderOperation } from 'junegoo-ui'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useScoreEntryModule } from './src/hooks/scoreEntry'
import type { ScoreEntryItem } from './src/types/scoreEntry'

const { scoreEntryPage } = useScoreEntryModule()

const statusClassMap = {
  审核中: 'status-tag--reviewing',
  驳回: 'status-tag--rejected',
} as const

const columns: DataTableColumns<ScoreEntryItem> = [
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
        scoreEntryPage.getStatusText(row.status),
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
  },
  {
    title: '工号',
    key: 'jobNumber',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '事件发生科室',
    key: 'eventDepartment',
    width: 260,
    ellipsis: { tooltip: true },
  },
  {
    title: '审核人',
    key: 'reviewer',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '加减分',
    key: 'score',
    width: 110,
    render(row) {
      return h(
        'span',
        { class: ['score-tag', row.score > 0 ? 'score-tag--plus' : 'score-tag--minus'] },
        row.score > 0 ? `+ ${row.score}` : `${row.score}`,
      )
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
                label: '详情',
                event() {
                  scoreEntryPage.openView(row)
                },
              },
              {
                label: '撤回',
                event() {
                  scoreEntryPage.onWithdraw(row)
                },
              },
              {
                label: '流程',
                event() {
                  scoreEntryPage.onOpenProcess(row)
                },
              },
            ]
          : [
              {
                label: '编辑',
                event() {
                  scoreEntryPage.openEdit(row)
                },
              },
              {
                label: '提交',
                event() {
                  scoreEntryPage.onSubmit(row)
                },
              },
              {
                label: '删除',
                event() {
                  scoreEntryPage.onDelete(row)
                },
              },
              {
                label: '流程',
                event() {
                  scoreEntryPage.onOpenProcess(row)
                },
              },
            ],
      )
    },
  },
]

onMounted(() => {
  scoreEntryPage.getPage()
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

.score-entry-search {
  max-width: 100%;
}

.score-entry-actions {
  flex-wrap: nowrap;
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
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.status-tag--rejected {
  color: #ff4d4f;
  background: #fff2f0;
  border-color: #ffccc7;
}

.score-tag {
  display: inline-block;
  min-width: 56px;
  padding: 2px 10px;
  text-align: center;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
}

.score-tag--plus {
  color: #ff4d4f;
  background: #fff1f0;
}

.score-tag--minus {
  color: #52c41a;
  background: #f6ffed;
}

.expand-panel {
  display: grid;
  gap: 10px;
  padding: 4px 0;
}

.expand-row {
  display: flex;
  align-items: flex-start;
  line-height: 1.7;
  color: #606266;
}

.expand-row__label {
  flex-shrink: 0;
  color: #303133;
}

.expand-row__value {
  min-width: 0;
  margin-left: 4px;
}
</style>
