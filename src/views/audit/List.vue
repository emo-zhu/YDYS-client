<template>
  <page :page-tabs="[{ label: '审核用户列表', value: '1' }]">
    <page-body>
      <page-body-container class="audit-page">
        <div class="query-bar">
          <j-search
            v-model:value="query.name"
            placeholder="输入姓名查询"
            @search="onSearch"
            :reset="true"
            @reset="onReset"
            class="audit-search"
          />
        </div>

        <div class="toolbar">
          <n-space size="small">
            <n-button type="info" @click="openAddModal">新增</n-button>
          </n-space>
        </div>

        <n-data-table
          class="audit-table"
          :columns="columns"
          :data="pagedList"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="rowKey"
          :scroll-x="tableScrollX"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="query"
          :page-data="pageData"
          @load-page="loadPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>

    <n-modal
      v-model:show="editorVisible"
      preset="card"
      :title="editorTitle"
      style="width: 560px"
      :mask-closable="false"
    >
      <n-form label-placement="left" label-width="72">
        <n-form-item label="用户名">
          <n-input v-model:value="editorForm.userName" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="工号">
          <n-input v-model:value="editorForm.jobNumber" placeholder="请输入工号" />
        </n-form-item>
        <n-form-item label="姓名">
          <n-input v-model:value="editorForm.realName" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="性别">
          <n-select v-model:value="editorForm.gender" :options="genderOptions" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="editor-footer">
          <n-button @click="editorVisible = false">取消</n-button>
          <n-button type="info" @click="onSaveEditor">保存</n-button>
        </div>
      </template>
    </n-modal>
  </page>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { computed, h, reactive, ref } from 'vue'
import { renderOperation } from 'junegoo-ui'

type GenderType = '男' | '女'

interface UserItem {
  id: number
  userName: string
  jobNumber: string
  realName: string
  gender: GenderType
}

const genderOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]

const sourceList = ref<UserItem[]>([
  { id: 1, userName: '儿科学系党总支', jobNumber: '3958', realName: '冯晓萍', gender: '女' },
  { id: 2, userName: '妇产科学系党总支', jobNumber: '3119', realName: '关力', gender: '女' },
  { id: 3, userName: '内科学习党总支', jobNumber: '0006', realName: '尹会民', gender: '男' },
  { id: 4, userName: '内科学党总支', jobNumber: '0164', realName: '尹海云', gender: '女' },
  { id: 5, userName: '外科学系党总支', jobNumber: '1266', realName: '高文杰', gender: '男' },
  { id: 6, userName: '医技党总支', jobNumber: '6351', realName: '彭凡恩', gender: '男' }
])

const query = reactive({
  name: '',
  pageNum: 1,
  pageSize: 10
})

const editorVisible = ref(false)
const editingId = ref<number | null>(null)
const editorForm = reactive({
  userName: '',
  jobNumber: '',
  realName: '',
  gender: '女' as GenderType
})

const editorTitle = computed(() => (editingId.value ? '编辑用户' : '新增用户'))

const filteredList = computed(() => {
  const keyword = query.name.trim()
  if (!keyword) {
    return sourceList.value
  }
  return sourceList.value.filter((item) => item.realName.includes(keyword) || item.userName.includes(keyword))
})

const pagedList = computed(() => {
  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  return filteredList.value.slice(start, end)
})

const pageData = computed(() => {
  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const total = filteredList.value.length
  return {
    records: pagedList.value,
    total,
    pageNum,
    pageSize,
    current: pageNum,
    size: pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize))
  }
})

const rowKey = (row: UserItem) => row.id

const onSearch = () => {
  query.pageNum = 1
  loadPage()
}

const onReset = () => {
  query.name = ''
  query.pageNum = 1
  query.pageSize = 10
  loadPage()
}

const loadPage = () => {
  const pageSize = query.pageSize || 10
  const pages = Math.max(1, Math.ceil(filteredList.value.length / pageSize))
  if ((query.pageNum || 1) > pages) {
    query.pageNum = pages
  }
}

const openAddModal = () => {
  editingId.value = null
  editorForm.userName = ''
  editorForm.jobNumber = ''
  editorForm.realName = ''
  editorForm.gender = '女'
  editorVisible.value = true
}

const openEditModal = (row: UserItem) => {
  editingId.value = row.id
  editorForm.userName = row.userName
  editorForm.jobNumber = row.jobNumber
  editorForm.realName = row.realName
  editorForm.gender = row.gender
  editorVisible.value = true
}

const onSaveEditor = () => {
  const userName = editorForm.userName.trim()
  const jobNumber = editorForm.jobNumber.trim()
  const realName = editorForm.realName.trim()
  if (!userName || !jobNumber || !realName) {
    window.$message.warning('用户名、工号、姓名不能为空')
    return
  }
  if (editingId.value) {
    const row = sourceList.value.find((item) => item.id === editingId.value)
    if (!row) {
      return
    }
    row.userName = userName
    row.jobNumber = jobNumber
    row.realName = realName
    row.gender = editorForm.gender
  } else {
    const nextId = sourceList.value.length ? Math.max(...sourceList.value.map((item) => item.id)) + 1 : 1
    sourceList.value.unshift({
      id: nextId,
      userName,
      jobNumber,
      realName,
      gender: editorForm.gender
    })
  }
  editorVisible.value = false
  onSearch()
  window.$message.success('保存成功')
}

const onDelete = (row: UserItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认删除该用户吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      sourceList.value = sourceList.value.filter((item) => item.id !== row.id)
      loadPage()
      window.$message.success('删除成功')
    }
  })
}

const onResetPassword = (_row: UserItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认重置该用户密码吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      window.$message.success('密码已重置')
    }
  })
}

const columns: DataTableColumns<UserItem> = [
  {
    title: '序号',
    key: 'index',
    width: 72,
    render(_row, index) {
      const pageNum = query.pageNum || 1
      const pageSize = query.pageSize || 10
      return index + 1 + (pageNum - 1) * pageSize
    }
  },
  {
    title: '用户名',
    key: 'userName',
    width: 180,
    sorter: 'default',
    render(row) {
      return h('span', { class: 'user-name-text' }, row.userName)
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
            openEditModal(row)
          }
        },
        {
          label: '重置密码',
          event() {
            onResetPassword(row)
          }
        },
        {
          label: '删除',
          event() {
            onDelete(row)
          }
        }
      ])
    }
  }
]

const tableScrollX = computed(() => {
  return columns.reduce((total, item) => total + Number(item.width || 0), 0)
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

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  text-decoration: none;
}
</style>
