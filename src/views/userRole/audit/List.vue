<template>
  <page :page-tabs="[{ label: '审核用户列表', value: '1' }]">
    <page-body>
      <page-body-container class="audit-page">
        <div class="query-bar">
          <j-search
            v-model:value="userPage.query.name"
            placeholder="输入姓名查询"
            @search="userPage.onSearch"
            :reset="true"
            @reset="userPage.onReset"
            class="audit-search"
          />
        </div>

        <div class="toolbar">
          <n-space size="small">
            <n-button type="info" @click="userPage.openAdd">新增</n-button>
          </n-space>
        </div>

        <n-data-table
          class="audit-table"
          :columns="columns"
          :data="userPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="userPage.rowKey"
          :scroll-x="userPage.tableScrollX.value"
          :loading="userPage.loading.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="userPage.query"
          :page-data="userPage.pageData.value"
          @load-page="userPage.loadPage"
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
import { useUserModule } from './src/hooks/user'
import type { UserItem } from './src/types/user'

const { userPage } = useUserModule()

const columns: DataTableColumns<UserItem> = [
  {
    title: '序号',
    key: 'index',
    width: 72,
    render(_row, index) {
      const pageNum = userPage.query.pageNum || 1
      const pageSize = userPage.query.pageSize || 10
      return index + 1 + (pageNum - 1) * pageSize
    }
  },
  {
    title: '用户名',
    key: 'userName',
    width: 180,
    sorter: 'default',
    render(row) {
      return h(
        'span',
        {
          class: 'user-name-text user-name-text--link',
          onClick: () => userPage.openView(row.id)
        },
        row.userName
      )
    }
  },
  {
    title: '工号',
    key: 'jobNumber',
    width: 120,
    sorter: 'default'
  },
  {
    title: '姓名',
    key: 'realName',
    width: 120,
    sorter: 'default'
  },
  {
    title: '性别',
    key: 'gender',
    width: 80
  },
  {
    title: '操作',
    key: 'operate',
    width: 88,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          event() {
            userPage.openEdit(row.id)
          }
        },
        {
          label: '重置密码',
          event() {
            userPage.onResetPassword()
          }
        },
        {
          label: '删除',
          event() {
            userPage.onDelete(row.id)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  userPage.getPage()
})
</script>

<style scoped lang="scss">
.audit-page {
  padding: 8px 6px 4px;
}

.query-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

:deep(.audit-search) {
  width: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

:deep(.audit-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.audit-table .n-data-table-td) {
  padding: 10px 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  border-color: #e4e7ed;
}

:deep(.audit-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

:deep(.audit-table .user-name-text) {
  color: #303133;
}

:deep(.audit-table .user-name-text--link) {
  cursor: pointer;
}

:deep(.audit-table .user-name-text--link:hover) {
  color: #1677ff;
}
</style>
