<template>
  <page :page-tabs="[{ label: '科室考评表', value: '1' }]">
    <page-body>
      <page-body-header>
        <j-search
          v-model:value="tablePage.query.keywords"
          placeholder="输入考评表名称查询"
          @search="tablePage.onSearch"
          :reset="true"
          @reset="tablePage.onReset"
        />
        <n-space>
          <j-button type="info" round @click="tablePage.openAdd">新增</j-button>
        </n-space>
      </page-body-header>
      <page-body-container>
        <n-data-table
          class="department-assessment-table"
          :columns="columns"
          :data="tablePage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="tablePage.rowKey"
          :loading="tablePage.loading.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="tablePage.query"
          :page-data="tablePage.pageData.value"
          :page-sizes="[{ label: '每页显示10行', value: 10 }, { label: '每页显示20行', value: 20 }, { label: '每页显示100行', value: 100 }, { label: '每页显示500行', value: 500 }, { label: '每页显示1000行', value: 1000 }, { label: '每页显示2000行', value: 2000 }]"
          @load-page="tablePage.loadPage"
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
import { JButton, renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useDepartmentAssessmentTableModule } from './src/hooks/table'
import type { DepartmentAssessmentTableItem } from './src/types/table'

const { tablePage } = useDepartmentAssessmentTableModule()

const columns: DataTableColumns<DepartmentAssessmentTableItem> = [
  {
    title: '序号',
    key: 'index',
    width: 72,
    render(_row, index) {
      const pageNum = tablePage.query.pageNum || 1
      const pageSize = tablePage.query.pageSize || 20
      return index + 1 + (pageNum - 1) * pageSize
    }
  },
  {
    title: '考评表名称',
    key: 'tableName',
    minWidth: 260,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        'span',
        {
          class: 'title-text title-text--link',
          onClick: () => tablePage.openView(row.id)
        },
        row.tableName
      )
    }
  },
  {
    title: '考评项数量',
    key: 'itemCount',
    width: 120,
    align: 'center'
  },
  {
    title: '操作时间',
    key: 'updatedAt',
    width: 180
  },
  {
    title: '操作',
    key: 'operate',
    width: 156,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '详情',
          event() {
            tablePage.openView(row.id)
          }
        },
        {
          label: '编辑',
          event() {
            tablePage.openEdit(row.id)
          }
        },
        {
          label: '删除',
          event() {
            tablePage.onDelete(row.id)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  tablePage.getPage()
})
</script>

<style scoped lang="scss">
:deep(.department-assessment-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.department-assessment-table .n-data-table-td) {
  padding: 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  border-color: #e4e7ed;
}

:deep(.department-assessment-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

.title-text {
  color: #303133;
}

.title-text--link {
  cursor: pointer;
}

.title-text--link:hover {
  color: #1677ff;
}
</style>