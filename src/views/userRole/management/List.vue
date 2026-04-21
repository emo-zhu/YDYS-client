<template>
  <page :page-tabs="[{ label: '管理用户列表', value: '1' }]">
    <page-body>
      <page-body-header>
          <j-search
            v-model:value="userPage.query.name"
            placeholder="输入姓名查询"
            @search="userPage.onSearch"
            :reset="true"
            @reset="userPage.onReset"
          />
        <n-space>
          <j-button type="info" round @click="userPage.openAdd">新增</j-button>
          </n-space>
      </page-body-header>
      <page-body-container>
        <n-data-table
          class="management-table"
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
          :page-sizes="[{ label: '每页显示10行', value: 10 }, { label: '每页显示20行', value: 20 }, { label: '每页显示100行', value: 100 }, { label: '每页显示500行', value: 500 }, { label: '每页显示1000行', value: 1000 }, { label: '每页显示2000行', value: 2000 }]"
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
import { JButton, renderOperation } from 'junegoo-ui'
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
      const pageSize = userPage.query.pageSize || 20
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

:deep(.management-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.management-table .n-data-table-td) {
  padding: 10px 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  border-color: #e4e7ed;
}

:deep(.management-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

:deep(.management-table .user-name-text) {
  color: #303133;
}

:deep(.management-table .user-name-text--link) {
  cursor: pointer;
}

:deep(.management-table .user-name-text--link:hover) {
  color: #1677ff;
}
</style>