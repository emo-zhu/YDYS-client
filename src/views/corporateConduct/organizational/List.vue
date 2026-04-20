<template>
  <page :page-tabs="[{ label: '组织体系', value: '1' }]">
    <page-body>
      <page-body-container class="organizational-page">
        <section class="org-section">
          <div class="org-section__head">
            <h3 class="org-section__title">行风建设工作领导小组</h3>
          </div>
          <n-data-table
            class="org-table summary-table"
            :columns="leadershipColumns"
            :data="organizationalPage.leadershipRows.value"
            :show-header="false"
            :single-line="false"
            :pagination="false"
            :bordered="true"
            :row-key="basicRowKey"
          />
        </section>
        <section class="org-section">
          <div class="org-section__head">
            <h3 class="org-section__title">行风建设领导小组办公室</h3>
          </div>
          <n-data-table
            class="org-table summary-table"
            :columns="officeColumns"
            :data="organizationalPage.officeRows.value"
            :show-header="false"
            :single-line="false"
            :pagination="false"
            :bordered="true"
            :row-key="basicRowKey"
          />
        </section>
        <section class="org-section">
          <div class="org-section__head">
            <h3 class="org-section__title">各科室行风建设小组</h3>
            <n-space size="small" class="org-section__actions">
              <n-button quaternary type="info" size="small" @click="organizationalPage.expandAll">展开全部</n-button>
              <n-button quaternary type="info" size="small" @click="organizationalPage.collapseAll">收起全部</n-button>
            </n-space>
          </div>
          <n-data-table
            class="org-table dept-table"
            :columns="departmentColumns"
            :data="organizationalPage.departmentPageData.value.records"
            :single-line="false"
            :pagination="false"
            :bordered="true"
            :row-key="departmentRowKey"
            :expanded-row-keys="organizationalPage.expandedRowKeys.value"
            @update:expanded-row-keys="organizationalPage.onExpandedRowKeysUpdate"
          />
        </section>
      </page-body-container>
      <page-body-footer class="org-page-footer">
        <j-pagination
          v-model:page-query="organizationalPage.departmentPageQuery"
          :page-data="organizationalPage.departmentPageData.value"
          @load-page="organizationalPage.loadDepartmentPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>

    <Edit />
    <View />
  </page>
</template>

<script lang="ts" setup>
import { renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useOrganizationalModule } from './src/hooks/organizational'
import type { BasicRow, DepartmentRow } from './src/types/organizational'

const { organizationalPage } = useOrganizationalModule()

const basicRowKey = (row: BasicRow) => row.id
const departmentRowKey = (row: DepartmentRow) => row.id

const createSummaryColumns = (source: 'leadership' | 'office'): DataTableColumns<BasicRow> => [
  {
    title: '岗位',
    key: 'label',
    width: 160
  },
  {
    title: '内容',
    key: 'value'
  },
  {
    title: '操作',
    key: 'operate',
    width: 90,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          event() {
            organizationalPage.openSummaryEdit(source, row)
          }
        }
      ])
    }
  }
]

const leadershipColumns = createSummaryColumns('leadership')
const officeColumns = createSummaryColumns('office')

const departmentColumns: DataTableColumns<DepartmentRow> = [
  {
    title: '考评单元名称',
    key: 'name',
    width: 340,
    render(row) {
      if (row.isIncludeRow) {
        return h('span', { class: 'include-text' }, row.name)
      }
      return h(
        'span',
        {
          class: 'dept-name-link',
          onClick: () => organizationalPage.openView(row.id)
        },
        row.name
      )
    }
  },
  {
    title: '科室负责人',
    key: 'leader',
    width: 260,
    render(row) {
      if (row.isIncludeRow) {
        return ''
      }
      return organizationalPage.displayText(row.leader)
    }
  },
  {
    title: '党支部书记',
    key: 'secretary',
    width: 260,
    render(row) {
      if (row.isIncludeRow) {
        return ''
      }
      return organizationalPage.displayText(row.secretary)
    }
  },
  {
    title: '其他成员',
    key: 'members',
    width: 260,
    render(row) {
      if (row.isIncludeRow) {
        return ''
      }
      return organizationalPage.displayText(row.members)
    }
  },
  {
    title: '操作',
    key: 'operate',
    width: 100,
    align: 'center',
    render(row) {
      if (row.isIncludeRow) {
        return '-'
      }
      return renderOperation([
        {
          label: '编辑',
          event() {
            organizationalPage.openDepartmentEdit(row)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  organizationalPage.initPage()
})
</script>

<style scoped lang="scss">
.organizational-page {
  padding: 8px 6px 4px;
}

.org-section {
  margin-bottom: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.org-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f7f9fc;
  border-bottom: 1px solid #e3e6ed;
}

.org-section__title {
  margin: 0;
  position: relative;
  padding-left: 12px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.5px;
  color: #1e293b;
}

.org-section__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: #2d8cf0;
}

.org-section__actions {
  flex-shrink: 0;
}

.org-page-footer {
  padding-top: 2px;
}

.include-text {
  color: #606266;
  font-size: 14px;
}

.dept-name-link {
  color: #303133;
  cursor: pointer;
}

.dept-name-link:hover {
  color: #1677ff;
}

:deep(.org-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.org-table .n-data-table-td) {
  padding: 14px 16px;
  font-size: 15px;
  color: #303133;
  line-height: 1.7;
  border-color: #e4e7ed;
}

:deep(.org-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

:deep(.summary-table .n-data-table-td) {
  vertical-align: top;
}

:deep(.dept-table .n-data-table-td) {
  vertical-align: middle;
}

:deep(.org-table .n-data-table-expand-trigger) {
  margin-right: 6px;
}
</style>
