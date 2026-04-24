<template>
  <n-data-table
    v-table-full-height="110"
    flex-height
    :columns="columns"
    :data="module.pageData.value.records"
    :single-line="false"
    :bordered="true"
    striped
    :pagination="false"
    :row-key="module.rowKey"
    :loading="module.loading.value"
  />
</template>

<script lang="ts" setup>
import { renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import { useAnnualRuleModule } from '../shared/hooks'
import type { AssessmentUnitItem } from '../shared/types'

defineProps<{
  embedded?: boolean
}>()

const module = useAnnualRuleModule('unit')

const columns: DataTableColumns<AssessmentUnitItem> = [
  {
    type: 'expand',
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h('div', { class: 'annual-rule-expand' }, `包含科室：${row.includedDepartments || '-'}`)
    }
  },
  {
    title: '考评单元名称',
    key: 'unitName',
    minWidth: 180,
    ellipsis: { tooltip: true }
  },
  {
    title: '科室类型',
    key: 'departmentType',
    minWidth: 160
  },
  {
    title: '科室负责人',
    key: 'departmentLeader',
    minWidth: 160
  },
  {
    title: '党支部书记',
    key: 'branchSecretary',
    minWidth: 160
  },
  {
    title: '其他成员',
    key: 'otherMembers',
    minWidth: 180,
    ellipsis: { tooltip: true }
  },
  {
    title: '审核用户',
    key: 'auditUser',
    minWidth: 200,
    ellipsis: { tooltip: true }
  },
  {
    title: '操作',
    key: 'operate',
    width: 170,
    fixed: 'right',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          event() {
            module.openEdit(row)
          }
        },
        {
          label: '删除',
          event() {
            module.onTodo(`删除${row.unitName}`)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  module.getPage()
})
</script>

<style scoped lang="scss">
:deep(.annual-rule-expand) {
  color: #555;
  padding: 4px 12px;
}
</style>
