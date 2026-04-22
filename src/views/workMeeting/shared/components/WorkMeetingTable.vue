<template>
  <n-data-table
    v-table-full-height="110"
    flex-height
    :columns="columns"
    :data="module.page.pageData.value.records"
    :single-line="false"
    :bordered="true"
    striped
    :pagination="false"
    :row-key="module.page.rowKey"
    :scroll-x="module.page.tableScrollX.value"
    :loading="module.page.loading.value"
    :expanded-row-keys="module.page.expandedRowKeys.value"
    @update:expanded-row-keys="module.page.onExpandedRowKeysUpdate"
    v-model:checked-row-keys="module.page.checkedRowKeys.value"
  />
</template>

<script lang="ts" setup>
import { renderOperation, renderTextButton } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { useWorkMeetingModule } from '../hooks'
import type { WorkMeetingItem, WorkMeetingType } from '../types'

const props = defineProps<{
  type: WorkMeetingType
}>()

const module = useWorkMeetingModule(props.type)

const columns: DataTableColumns<WorkMeetingItem> = [
  {
    type: 'expand',
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h('div', { class: 'expand-panel' }, [
        h('div', { class: 'expand-row' }, [
          h('span', { class: 'expand-row__label' }, '附件'),
          h(
            'span',
            { class: 'expand-row__value expand-row__value--link' },
            row.attachmentName || '-'
          )
        ]),
        h('div', { class: 'expand-row' }, [
          h('span', { class: 'expand-row__label' }, '备注'),
          h('span', { class: 'expand-row__value' }, row.remarks || '-')
        ])
      ])
    }
  },
  {
    type: 'selection',
    width: 56
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(row) {
      return h(
        'span',
        {
          class: [
            'status-tag',
            row.status === '完成' ? 'status-tag--finished' : 'status-tag--pending'
          ]
        },
        row.status
      )
    }
  },
  {
    title: '年度',
    key: 'assessmentYear',
    width: 120
  },
  {
    title: module.config.periodLabel || '周期',
    key: 'assessmentPeriod',
    width: 140
  },
  {
    title: '科室',
    key: 'departmentName',
    minWidth: 260,
    ellipsis: { tooltip: true }
  },
  {
    title: '填报人',
    key: 'reporterName',
    width: 160
  },
  {
    title: '填报人工号',
    key: 'reporterJobNo',
    width: 160
  },
  {
    title: '填报时间',
    key: 'reportTime',
    width: 160
  },
  {
    title: '附件',
    key: 'attachmentName',
    minWidth: 300,
    render(row) {
      return renderTextButton(row.attachmentName || '-', () => {
        module.page.onOpenAttachment(row)
      })
    }
  },
  {
    title: '操作',
    key: 'operate',
    fixed: 'right',
    width: 132,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '查看',
          event() {
            module.page.openView(row.id)
          }
        },
        {
          label: '删除',
          event() {
            module.page.onDelete(row.id)
          }
        }
      ])
    }
  }
]
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

.status-tag--finished {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.status-tag--pending {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

.expand-panel {
  display: grid;
  gap: 10px;
  padding: 4px 0;
}

.expand-row {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: start;
}

.expand-row__label {
  color: #606266;
  font-weight: 600;
}

.expand-row__value {
  color: #303133;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.expand-row__value--link {
  color: #1677ff;
}
</style>
