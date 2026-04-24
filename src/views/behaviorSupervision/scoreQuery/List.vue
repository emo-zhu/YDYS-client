<template>
  <page
    v-model:value="scoreQueryPage.tabValue.value"
    :page-tabs="pageTabs"
    @update:value="scoreQueryPage.onTabChange"
  >
    <page-body v-if="scoreQueryPage.tabValue.value === 'mine'">
      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          :columns="mineColumns"
          :data="scoreQueryPage.minePageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="scoreQueryPage.rowKey"
          :scroll-x="scoreQueryPage.mineTableScrollX.value"
          :loading="scoreQueryPage.mineLoading.value"
          :expanded-row-keys="scoreQueryPage.mineExpandedRowKeys.value"
          @update:expanded-row-keys="scoreQueryPage.onMineExpandedRowKeysUpdate"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="scoreQueryPage.mineQuery"
          :page-data="scoreQueryPage.minePageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="scoreQueryPage.loadMinePage"
          :init="false"
        />
      </page-body-footer>
    </page-body>

    <page-body v-else>
      <page-body-header>
        <div class="toolbar">
          <div class="toolbar__row">
            <j-search
              v-model:value="scoreQueryPage.hospitalQuery.keywords"
              width="100%"
              placeholder="请输入姓名、工号"
              @search="scoreQueryPage.onHospitalSearch"
              :reset="true"
              @reset="scoreQueryPage.onHospitalReset"
              class="query-search"
            >
              <div class="search-addon search-addon--year">
                <n-select
                  v-model:value="scoreQueryPage.hospitalQuery.assessmentYear"
                  :options="scoreQueryPage.assessmentYearOptions"
                  clearable
                  placeholder="请选择考核年度"
                  class="search-select"
                />
              </div>
              <div class="search-addon search-addon--type">
                <n-select
                  v-model:value="scoreQueryPage.hospitalQuery.scoreType"
                  :options="scoreQueryPage.scoreTypeOptions"
                  clearable
                  placeholder="请选择加减分类型"
                  class="search-select"
                />
              </div>
              <div class="search-addon search-addon--month">
                <n-select
                  v-model:value="scoreQueryPage.hospitalQuery.assessmentMonth"
                  :options="scoreQueryPage.assessmentMonthOptions"
                  clearable
                  placeholder="请选择考核月度"
                  class="search-select"
                />
              </div>
            </j-search>
            <div class="toolbar__actions">
              <j-button round @click="scoreQueryPage.onExport">导出</j-button>
              <j-button round @click="scoreQueryPage.onSort">排序</j-button>
            </div>
          </div>
        </div>
      </page-body-header>
      <page-body-container>
        <n-data-table
          v-table-full-height="154"
          flex-height
          :columns="hospitalColumns"
          :data="scoreQueryPage.hospitalPageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="scoreQueryPage.rowKey"
          :scroll-x="scoreQueryPage.hospitalTableScrollX.value"
          :loading="scoreQueryPage.hospitalLoading.value"
          v-model:checked-row-keys="scoreQueryPage.hospitalCheckedRowKeys.value"
        />
        <div class="summary-bar">
          <span>合计金额：<em>{{ scoreQueryPage.hospitalSummary.value.amount.toFixed(2) }}</em></span>
          <span>合计加分：<em>{{ scoreQueryPage.hospitalSummary.value.plusScore.toFixed(2) }}</em></span>
          <span>合计减分：<em>{{ scoreQueryPage.hospitalSummary.value.minusScore.toFixed(2) }}</em></span>
        </div>
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="scoreQueryPage.hospitalQuery"
          :page-data="scoreQueryPage.hospitalPageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="scoreQueryPage.loadHospitalPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>
    <Edit />
    <View />
  </page>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { renderOperation, renderTextButton } from 'junegoo-ui'
import { h, onMounted } from 'vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useScoreQueryModule } from './src/hooks/scoreQuery'
import type { ScoreQueryHospitalItem, ScoreQueryMineItem } from './src/types/scoreQuery'

const { scoreQueryPage } = useScoreQueryModule()

const pageTabs = [
  { label: '我的日常考评', value: 'mine' },
  { label: '全院日常考评', value: 'hospital' },
]

const mineColumns: DataTableColumns<ScoreQueryMineItem> = [
  {
    type: 'expand',
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h('div', { class: 'expand-panel' }, [
        h('div', { class: 'expand-meta' }, [
          h('div', { class: 'expand-meta__item' }, [
            h('span', { class: 'expand-meta__label' }, '是否科室同步：'),
            h(
              'span',
              {
                class: ['meta-tag', row.departmentSync ? 'meta-tag--success' : 'meta-tag--danger'],
              },
              row.departmentSync ? '是' : '否',
            ),
          ]),
          h('div', { class: 'expand-meta__item' }, [
            h('span', { class: 'expand-meta__label' }, '科室加减分：'),
            h('span', { class: 'meta-tag meta-tag--warning' }, String(row.departmentScore)),
          ]),
          h('div', { class: 'expand-meta__item' }, [
            h('span', { class: 'expand-meta__label' }, '事件确定性日期：'),
            h('span', { class: 'expand-meta__value' }, row.confirmedDate || ''),
          ]),
          h('div', { class: 'expand-meta__item' }, [
            h('span', { class: 'expand-meta__label' }, '记录时间：'),
            h('span', { class: 'expand-meta__value' }, row.recordTime || ''),
          ]),
        ]),
        h('div', { class: 'expand-row expand-row--full' }, [
          h('span', { class: 'expand-row__label' }, '行为描述：'),
          h('span', { class: 'expand-row__value' }, row.behaviorDescription || ''),
        ]),
        h('div', { class: 'expand-row expand-row--full' }, [
          h('span', { class: 'expand-row__label' }, '事件概述：'),
          h('span', { class: 'expand-row__value' }, row.eventSummary || ''),
        ]),
        h('div', { class: 'expand-row expand-row--full' }, [
          h('span', { class: 'expand-row__label' }, '事件处理结果：'),
          h('span', { class: 'expand-row__value' }, row.handlingResult || ''),
        ]),
        h('div', { class: 'expand-row expand-row--full' }, [
          h('span', { class: 'expand-row__label' }, '佐证材料：'),
          h('span', { class: 'expand-row__value' }, row.evidenceMaterial || ''),
        ]),
      ])
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
    width: 180,
  },
  {
    title: '工号',
    key: 'jobNumber',
    width: 180,
  },
  {
    title: '事件发生科室',
    key: 'eventDepartment',
    width: 260,
    ellipsis: { tooltip: true },
  },
  {
    title: '加减分',
    key: 'score',
    width: 110,
    render(row) {
      return h(
        'span',
        {
          class: ['score-tag', row.score >= 0 ? 'score-tag--plus' : 'score-tag--minus'],
        },
        row.score > 0 ? `+ ${row.score}` : `- ${Math.abs(row.score)}`,
      )
    },
  },
  {
    title: '金额',
    key: 'amount',
    width: 120,
  },
  {
    title: '事件发生时间',
    key: 'eventTime',
    width: 160,
  },
]

const hospitalColumns: DataTableColumns<ScoreQueryHospitalItem> = [
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
      ])
    },
  },
  {
    type: 'selection',
    width: 56,
  },
  {
    title: '考核年度',
    key: 'assessmentYear',
    width: 120,
  },
  {
    title: '姓名',
    key: 'userName',
    width: 140,
    render(row) {
      return renderTextButton(row.userName, () => {
        scoreQueryPage.onOpenDetail(row)
      })
    },
  },
  {
    title: '工号',
    key: 'jobNumber',
    width: 120,
  },
  {
    title: '事件发生科室',
    key: 'eventDepartment',
    width: 220,
    ellipsis: { tooltip: true },
  },
  {
    title: '申报人',
    key: 'applicant',
    width: 180,
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
        {
          class: ['score-tag', row.score >= 0 ? 'score-tag--plus' : 'score-tag--minus'],
        },
        row.score > 0 ? `+ ${row.score}` : `- ${Math.abs(row.score)}`,
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
      return renderOperation([
        {
          label: '补充修改',
          event() {
            scoreQueryPage.onEdit(row)
          },
        },
        {
          label: '退回',
          event() {
            scoreQueryPage.onRollback(row)
          },
        },
        {
          label: '流程',
          event() {
            scoreQueryPage.onOpenProcess(row)
          },
        },
      ])
    },
  },
]

onMounted(() => {
  scoreQueryPage.init()
})
</script>

<style scoped lang="scss">
.search-addon {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.search-addon__label {
  color: #303133;
  font-size: 14px;
  white-space: nowrap;
}

.toolbar {
  display: grid;
  width: 100%;
}

.toolbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.toolbar__row--secondary {
  margin-top: 12px;
  align-items: flex-start;
}

.search-addon--year,
.search-addon--type,
.search-addon--month,
.search-addon--target {
  width: 150px;
}

.search-addon--date {
  width: 360px;
}

.search-addon--clause {
  width: 280px;
}

.search-select,
.date-range-picker {
  width: 100%;
}

.toolbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  white-space: nowrap;
}

.query-search {
  flex: 1;
  min-width: 0;
}

.query-search :deep(.search_box > .n-space) {
  width: 100%;
  flex-wrap: nowrap !important;
}

.query-search :deep(.select_group) {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.query-search :deep(.search-select) {
  width: 100%;
  min-width: 0;
}

.query-search :deep(.search-select .n-base-selection) {
  width: 100%;
}

.query-search :deep(.n-input) {
  flex: 1;
  min-width: 220px;
}

.query-search--secondary :deep(.search_box > .n-space) {
  align-items: flex-start;
}

.query-search--secondary :deep(.select_group) {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.query-search--secondary :deep(.n-input),
.query-search--secondary :deep(.n-button) {
  display: none;
}

@media (max-width: 1280px) {
  .toolbar__row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-addon {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .search-addon--year,
  .search-addon--type,
  .search-addon--month,
  .search-addon--target,
  .search-addon--clause,
  .search-addon--date {
    width: 100%;
  }

  .toolbar__actions {
    justify-content: flex-start;
  }
}

.summary-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 0 0;
  color: #606266;
  font-size: 14px;
}

.summary-bar em {
  color: #ff4d4f;
  font-style: normal;
  font-weight: 600;
}

.score-tag {
  display: inline-block;
  min-width: 48px;
  padding: 2px 10px;
  border-radius: 6px;
  text-align: center;
  line-height: 1.4;
  border: 1px solid transparent;
}

.score-tag--plus {
  color: #ff4d4f;
  background: #fff1f0;
  border-color: #ffccc7;
}

.score-tag--minus {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.expand-panel {
  display: grid;
  gap: 12px;
  padding: 4px 0;
}

.expand-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.expand-meta__item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.expand-meta__label,
.expand-row__label {
  color: #303133;
  white-space: nowrap;
}

.expand-meta__value,
.expand-row__value {
  color: #606266;
  word-break: break-all;
}

.expand-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.6;
}

.expand-row--full {
  width: 100%;
}

.meta-tag {
  display: inline-block;
  min-width: 28px;
  padding: 1px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  line-height: 1.4;
  text-align: center;
}

.meta-tag--success {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.meta-tag--danger {
  color: #ff4d4f;
  background: #fff1f0;
  border-color: #ffccc7;
}

.meta-tag--warning {
  color: #fa8c16;
  background: #fff7e6;
  border-color: #ffd591;
}

@media (max-width: 1480px) {
  .search-addon--year,
  .search-addon--type,
  .search-addon--month,
  .search-addon--target,
  .search-addon--clause,
  .search-addon--date {
    width: calc(50% - 6px);
  }
}
</style>
