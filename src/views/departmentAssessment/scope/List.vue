<template>
  <page :page-tabs="[{ label: '科室考评范围', value: '1' }]">
    <page-body>
      <page-body-header>
        <j-search
          v-model:value="scopePage.query.keywords"
          placeholder="输入科室考评组名称查询"
          @search="scopePage.onSearch"
          :reset="true"
          @reset="scopePage.onReset"
        />
        <n-space>
          <j-button type="info" round @click="scopePage.openAdd">新增</j-button>
        </n-space>
      </page-body-header>
      <page-body-container>
        <n-data-table
          class="department-assessment-scope-table"
          :columns="columns"
          :data="scopePage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="scopePage.rowKey"
          :loading="scopePage.loading.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="scopePage.query"
          :page-data="scopePage.pageData.value"
          @load-page="scopePage.loadPage"
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
import { useDepartmentAssessmentScopeModule } from './src/hooks/scope'
import type { DepartmentAssessmentScopeItem } from './src/types/scope'

const { scopePage } = useDepartmentAssessmentScopeModule()

const columns: DataTableColumns<DepartmentAssessmentScopeItem> = [
  {
    title: '科室名称',
    key: 'groupName',
    minWidth: 220,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        'span',
        {
          class: 'title-text title-text--link',
          onClick: () => scopePage.openView(row.id)
        },
        row.groupName
      )
    }
  },
  {
    title: '排序号',
    key: 'sortOrder',
    width: 120,
    align: 'center'
  },
  {
    title: '考评科室范围',
    key: 'departmentNames',
    minWidth: 360,
    render(row) {
      return row.departmentNames.join('、')
    }
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
            scopePage.openView(row.id)
          }
        },
        {
          label: '编辑',
          event() {
            scopePage.openEdit(row.id)
          }
        },
        {
          label: '删除',
          event() {
            scopePage.onDelete(row.id)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  scopePage.getPage()
})
</script>

<style scoped lang="scss">
:deep(.department-assessment-scope-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.department-assessment-scope-table .n-data-table-td) {
  padding: 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  border-color: #e4e7ed;
}

:deep(.department-assessment-scope-table .n-data-table-tr:hover .n-data-table-td) {
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
