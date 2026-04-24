<template>
  <page :page-tabs="[{ label: '个人加分申报', value: '1' }]">
    <page-body>
      <page-body-header>
        <j-search
          v-model:value="personalApplyPage.query.keywords"
          placeholder="请输入姓名、工号"
          @search="personalApplyPage.onSearch"
          :reset="true"
          @reset="personalApplyPage.onReset"
        />
        <n-space>
          <j-button type="info" round @click="personalApplyPage.onAdd">
            新增
          </j-button>
          <j-button
            round
            :disabled="personalApplyPage.checkedRowKeys.value.length === 0"
            @click="personalApplyPage.onBatchDelete"
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
          :data="personalApplyPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="personalApplyPage.rowKey"
          :scroll-x="personalApplyPage.tableScrollX.value"
          :loading="personalApplyPage.loading.value"
          :expanded-row-keys="personalApplyPage.expandedRowKeys.value"
          @update:expanded-row-keys="personalApplyPage.onExpandedRowKeysUpdate"
          v-model:checked-row-keys="personalApplyPage.checkedRowKeys.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="personalApplyPage.query"
          :page-data="personalApplyPage.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="personalApplyPage.loadPage"
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
import { renderOperation, renderTextButton } from 'junegoo-ui'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { usePersonalApplyModule } from './src/hooks/personalApply'
import type { PersonalApplyItem } from './src/types/personalApply'

const { personalApplyPage } = usePersonalApplyModule()

const statusClassMap = {
  驳回: 'status-tag--rejected',
  待审核: 'status-tag--pending',
  已通过: 'status-tag--approved',
} as const

const columns: DataTableColumns<PersonalApplyItem> = [
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
        {
          class: ['status-tag', statusClassMap[row.status]],
        },
        personalApplyPage.getStatusText(row.status),
      )
    },
  },
  {
    title: '考核年度',
    key: 'assessmentYear',
    width: 140,
  },
  {
    title: '姓名',
    key: 'userName',
    width: 140,
    render(row) {
      return renderTextButton(row.userName, () => {
        personalApplyPage.onView(row)
      })
    }
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
    title: '审核人',
    key: 'reviewer',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '加减分',
    key: 'score',
    width: 120,
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
  {
    title: '操作',
    key: 'operation',
    width: 188,
    fixed: 'right',
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          event() {
            personalApplyPage.onEdit(row)
          }
        },
        {
          label: '提交',
          event() {
            personalApplyPage.onSubmit(row)
          }
        },
        {
          label: '删除',
          event() {
            personalApplyPage.onDelete(row)
          }
        },
        {
          label: '流程',
          event() {
            personalApplyPage.onOpenProcess(row)
          }
        }
      ])
    },
  },
]

onMounted(async () => {
  await personalApplyPage.getPage()
  const firstRow = personalApplyPage.pageData.value.records[0]
  if (firstRow) {
    personalApplyPage.expandedRowKeys.value = [firstRow.id]
  }
})
</script>

<style scoped lang="scss">
.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid transparent;
}

.status-tag--rejected {
  color: #ff4d4f;
  background: #fff2f0;
  border-color: #ffccc7;
}

.status-tag--pending {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

.status-tag--approved {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.score-tag {
  display: inline-block;
  min-width: 46px;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  border: 1px solid transparent;
}

.score-tag--plus {
  color: #ff4d4f;
  background: #fff2f0;
  border-color: #ffccc7;
}

.score-tag--minus {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.expand-panel {
  display: grid;
  gap: 12px;
  padding: 4px 0;
}

.expand-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.expand-meta__item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.expand-meta__label {
  color: #606266;
  white-space: nowrap;
}

.expand-meta__value {
  color: #303133;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid transparent;
}

.meta-tag--danger {
  color: #ff4d4f;
  background: #fff2f0;
  border-color: #ffccc7;
}

.meta-tag--warning {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

.meta-tag--success {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.expand-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  align-items: start;
}

.expand-row--full {
  width: 100%;
}

.expand-row__label {
  color: #606266;
  font-weight: 600;
  white-space: nowrap;
}

.expand-row__value {
  color: #303133;
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 1280px) {
  .expand-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
