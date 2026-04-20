<template>
  <page :page-tabs="[{ label: '规章制度', value: '1' }]">
    <page-body>
      <page-body-container class="regulations-page">
        <div class="query-bar">
          <j-search
            v-model:value="query.keywords"
            placeholder="输入规章制度查询"
            @search="onSearch"
            :reset="true"
            @reset="onReset"
            class="regulations-search"
          />
        </div>

        <div class="toolbar">
          <n-space size="small">
            <n-button type="info" @click="openAddModal">新增</n-button>
            <n-button :disabled="checkedRowKeys.length === 0" @click="onBatchDelete">删除</n-button>
          </n-space>
        </div>

        <n-data-table
          class="regulations-table"
          :columns="columns"
          :data="pagedList"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="rowKey"
          v-model:checked-row-keys="checkedRowKeys"
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
      style="width: 620px"
      :mask-closable="false"
    >
      <n-form label-placement="left" label-width="84">
        <n-form-item label="文件类型">
          <n-select v-model:value="editorForm.fileType" :options="fileTypeOptions" />
        </n-form-item>
        <n-form-item label="标题">
          <n-input v-model:value="editorForm.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="发布时间">
          <n-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model:formatted-value="editorForm.publishDate"
            clearable
          />
        </n-form-item>
        <n-form-item label="发布内容">
          <n-input v-model:value="editorForm.contentName" placeholder="请输入发布内容文件名" />
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
import { renderOperation, renderTextButton } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { computed, h, reactive, ref } from 'vue'

type TableRowKey = number | string
type FileType = '规章制度' | '学习资料'

interface RegulationItem {
  id: number
  fileType: FileType
  title: string
  publishDate: string
  contentName: string
  browseCount: number
}

const fileTypeOptions = [
  { label: '规章制度', value: '规章制度' },
  { label: '学习资料', value: '学习资料' }
]

const sourceList = ref<RegulationItem[]>([
  {
    id: 1,
    fileType: '规章制度',
    title: '医务人员职业道德准则（2025年版）',
    publishDate: '2025-08-21',
    contentName: '医务人员职业道德准则（2025年版）.pdf',
    browseCount: 6
  },
  {
    id: 2,
    fileType: '学习资料',
    title: '医德医风口袋书-省卫健委发',
    publishDate: '2025-04-09',
    contentName: '省卫生健康委应急处----医德医风口袋书.pdf',
    browseCount: 20
  },
  {
    id: 3,
    fileType: '学习资料',
    title: '“人情往来”，还是违纪违法?',
    publishDate: '2025-02-18',
    contentName: '“人情往来”，还是违纪违法？.pdf',
    browseCount: 13
  },
  {
    id: 4,
    fileType: '规章制度',
    title: '国家卫健委《关于医务人员医德考评制度的指导意见（试行）》',
    publishDate: '2025-02-17',
    contentName: '国家卫健委关于建立医务人员医德考评制度的指导意见（试行）.pdf',
    browseCount: 18
  },
  {
    id: 5,
    fileType: '规章制度',
    title: '《湖北省医务人员医德考评实施办法》',
    publishDate: '2025-02-17',
    contentName: '2021省卫健委关于印发《湖北省医务人员医德考评实施办法》.pdf',
    browseCount: 0
  },
  {
    id: 6,
    fileType: '规章制度',
    title: '《关于印发医疗机构工作人员廉洁从业九项准则的通知》',
    publishDate: '2025-02-17',
    contentName: '关于印发医疗机构工作人员廉洁从业九项准则的通知.pdf',
    browseCount: 0
  },
  {
    id: 7,
    fileType: '规章制度',
    title: '《大型医院巡查工作方案（2023-2026）》',
    publishDate: '2025-02-17',
    contentName: '大型医院巡查工作方案（2023-2026）.pdf',
    browseCount: 0
  }
])

const query = reactive({
  keywords: '',
  pageNum: 1,
  pageSize: 10
})

const checkedRowKeys = ref<TableRowKey[]>([])

const editorVisible = ref(false)
const editingId = ref<number | null>(null)
const editorForm = reactive({
  fileType: '规章制度' as FileType,
  title: '',
  publishDate: '' as string | null,
  contentName: ''
})

const editorTitle = computed(() => (editingId.value ? '编辑制度文件' : '新增制度文件'))

const filteredList = computed(() => {
  const keywords = query.keywords.trim().toLowerCase()
  if (!keywords) {
    return sourceList.value
  }
  return sourceList.value.filter(
    (item) => item.title.toLowerCase().includes(keywords) || item.contentName.toLowerCase().includes(keywords)
  )
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

const rowKey = (row: RegulationItem) => row.id

const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const openAddModal = () => {
  editingId.value = null
  editorForm.fileType = '规章制度'
  editorForm.title = ''
  editorForm.publishDate = getToday()
  editorForm.contentName = ''
  editorVisible.value = true
}

const openEditModal = (row: RegulationItem) => {
  editingId.value = row.id
  editorForm.fileType = row.fileType
  editorForm.title = row.title
  editorForm.publishDate = row.publishDate
  editorForm.contentName = row.contentName
  editorVisible.value = true
}

const onSaveEditor = () => {
  const title = (editorForm.title || '').trim()
  if (!title) {
    window.$message?.warning('请输入标题')
    return
  }
  const publishDate = (editorForm.publishDate || getToday()).trim()
  const contentName = (editorForm.contentName || `${title}.pdf`).trim()
  const isEdit = editingId.value !== null
  if (isEdit) {
    const row = sourceList.value.find((item) => item.id === editingId.value)
    if (!row) {
      return
    }
    row.fileType = editorForm.fileType
    row.title = title
    row.publishDate = publishDate
    row.contentName = contentName
  } else {
    const nextId = sourceList.value.length ? Math.max(...sourceList.value.map((item) => item.id)) + 1 : 1
    sourceList.value.unshift({
      id: nextId,
      fileType: editorForm.fileType,
      title,
      publishDate,
      contentName,
      browseCount: 0
    })
    // 新增后清空筛选，确保新数据可见
    query.keywords = ''
  }
  query.pageNum = 1
  editorVisible.value = false
  onSearch()
  window.$message?.success('保存成功')
}

const removeByIds = (ids: number[]) => {
  sourceList.value = sourceList.value.filter((item) => !ids.includes(item.id))
  checkedRowKeys.value = checkedRowKeys.value.filter((key) => !ids.includes(Number(key)))
  loadPage()
}

const onDelete = (row: RegulationItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认删除该文件吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      removeByIds([row.id])
      window.$message.success('删除成功')
    }
  })
}

const onBatchDelete = () => {
  const ids = checkedRowKeys.value.map((key) => Number(key))
  if (ids.length === 0) {
    window.$message.warning('请先选择要删除的数据')
    return
  }
  window.$dialog.info({
    title: '温馨提示',
    content: `确认删除选中的${ids.length}条数据吗？`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      removeByIds(ids)
      window.$message.success('删除成功')
    }
  })
}

const onSearch = () => {
  query.pageNum = 1
  loadPage()
}

const onReset = () => {
  query.keywords = ''
  query.pageNum = 1
  query.pageSize = 10
  checkedRowKeys.value = []
  loadPage()
}

const onOpenContent = (row: RegulationItem) => {
  row.browseCount += 1
  window.$message.info(`已打开：${row.contentName}`)
}

const loadPage = () => {
  const pageSize = query.pageSize || 10
  const pages = Math.max(1, Math.ceil(filteredList.value.length / pageSize))
  if ((query.pageNum || 1) > pages) {
    query.pageNum = pages
  }
}

const columns: DataTableColumns<RegulationItem> = [
  {
    type: 'selection',
    width: 56
  },
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
    title: '文件类型',
    key: 'fileType',
    width: 110,
    render(row) {
      return h(
        'span',
        {
          class: ['file-type-tag', row.fileType === '规章制度' ? 'file-type-tag--rule' : 'file-type-tag--study']
        },
        row.fileType
      )
    }
  },
  {
    title: '标题',
    key: 'title',
    width: 420,
    ellipsis: { tooltip: true },
    render(row) {
      return h('span', { class: 'title-text' }, row.title)
    }
  },
  {
    title: '发布时间',
    key: 'publishDate',
    width: 160,
    sorter: 'default'
  },
  {
    title: '发布内容',
    key: 'contentName',
    minWidth: 360,
    render(row) {
      return renderTextButton(row.contentName, () => {
        onOpenContent(row)
      })
    }
  },
  {
    title: '浏览次数',
    key: 'browseCount',
    width: 96,
    align: 'center'
  },
  {
    title: '操作',
    key: 'operate',
    width: 96,
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
          label: '删除',
          event() {
            onDelete(row)
          }
        }
      ])
    }
  }
]
</script>

<style scoped lang="scss">
.regulations-page {
  padding: 8px 6px 4px;
}

.query-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

:deep(.regulations-search) {
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

:deep(.regulations-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.regulations-table .n-data-table-td) {
  padding: 14px 12px;
  font-size: 15px;
  color: #303133;
  line-height: 1.6;
  border-color: #e4e7ed;
}

:deep(.regulations-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

.file-type-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.4;
  border: 1px solid transparent;
}

.file-type-tag--rule {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

.file-type-tag--study {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.title-text {
  color: #303133;
  text-decoration: none;
}

</style>
