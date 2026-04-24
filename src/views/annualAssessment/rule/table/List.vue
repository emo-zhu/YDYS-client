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
import { renderOperation, renderTextButton } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { onMounted } from 'vue'
import { useAnnualRuleModule } from '../shared/hooks'
import type { AssessmentTableItem } from '../shared/types'

defineProps<{
  embedded?: boolean
}>()

const module = useAnnualRuleModule('table')

const columns: DataTableColumns<AssessmentTableItem> = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    render(_row, index) {
      return index + 1
    }
  },
  {
    title: '考评表名称',
    key: 'name',
    minWidth: 260,
    ellipsis: { tooltip: true },
    render(row) {
      return renderTextButton(row.name, () => module.onTodo('查看'))
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    minWidth: 220
  },
  {
    title: '修改时间',
    key: 'updateTime',
    minWidth: 220
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
            module.openTableEdit(row)
          }
        },
        {
          label: '删除',
          event() {
            module.onTodo(`删除${row.name}`)
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
