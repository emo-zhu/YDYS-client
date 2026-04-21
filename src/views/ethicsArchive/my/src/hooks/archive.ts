import { computed, reactive, ref } from 'vue'
import { createDefaultArchiveForm, EthicsArchiveApi } from '../api/archive'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/archive'
import type {
  EthicsArchiveDetail,
  EthicsArchiveForm,
  EthicsArchiveItem,
  EthicsArchiveLevel,
  EthicsArchivePageData,
  EthicsArchivePageQuery,
  EthicsArchiveStatus,
} from '../types/archive'

export const archiveYearOptions = [
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
]

export const archiveStatusOptions = [
  { label: '已归档', value: '已归档' },
  { label: '待完善', value: '待完善' },
  { label: '审核中', value: '审核中' },
]

export const assessmentLevelOptions = [
  { label: '优秀', value: '优秀' },
  { label: '良好', value: '良好' },
  { label: '合格', value: '合格' },
]

const query = reactive<EthicsArchivePageQuery>({
  keywords: '',
  archiveYear: null,
  pageNum: 1,
  pageSize: 20,
})

const pageData = ref<EthicsArchivePageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1,
})
const pageLoading = ref(false)

const form = reactive<EthicsArchiveForm>(createDefaultArchiveForm())
const saveLoading = ref(false)
const detailInfo = ref<EthicsArchiveDetail>()
const expandedRowKeys = ref<number[]>([])

const rowKey = (row: EthicsArchiveItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultArchiveForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await EthicsArchiveApi.getPage(query)
  } finally {
    pageLoading.value = false
  }
}

const loadPage = async () => {
  const pageSize = query.pageSize || 20
  const total = pageData.value.total || 0
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if ((query.pageNum || 1) > pages) {
    query.pageNum = pages
  }
  await getPage()
}

const onSearch = async () => {
  query.pageNum = 1
  await getPage()
}

const onReset = async () => {
  query.keywords = ''
  query.archiveYear = null
  query.pageNum = 1
  query.pageSize = 20
  await getPage()
}

const openAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const openEdit = async (_id: number) => {
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailInfo.value = await EthicsArchiveApi.getDetails({ id })
  viewModal.open()
}

const saveOne = async () => {
  saveLoading.value = true
  try {
    window.$message?.success('保存成功')
    return true
  } finally {
    saveLoading.value = false
  }
}

const closeAdd = () => {
  addModal.close()
  resetForm()
}

const closeEdit = () => {
  editModal.close()
  resetForm()
  currentEditId.value = null
}

const closeView = () => {
  viewModal.close()
  detailInfo.value = undefined
  currentViewId.value = null
}

const onDelete = (_id: number) => {}

const onDownload = (row: EthicsArchiveItem) => {
  window.$message?.success(`开始下载：${row.downloadFileName}`)
}

const onExpandedRowKeysUpdate = (keys: Array<string | number>) => {
  expandedRowKeys.value = keys.map((key) => Number(key))
}

const editorTitle = computed(() => (form.id ? '编辑我的医德档案' : '新增我的医德档案'))

export const getStatusClass = (status?: EthicsArchiveStatus) => {
  if (status === '已归档') {
    return 'status-tag--done'
  }
  if (status === '审核中') {
    return 'status-tag--progress'
  }
  return 'status-tag--pending'
}

export const getLevelClass = (level?: EthicsArchiveLevel | string) => {
  if (level === '优秀') {
    return 'level-tag--excellent'
  }
  if (level === '良好') {
    return 'level-tag--good'
  }
  return 'level-tag--pass'
}

export function useEthicsArchiveModule() {
  return {
    archivePage: {
      query,
      pageData,
      loading: pageLoading,
      rowKey,
      expandedRowKeys,
      getPage,
      loadPage,
      onSearch,
      onReset,
      openAdd,
      openEdit,
      openView,
      onDelete,
      onDownload,
      onExpandedRowKeysUpdate,
    },
    archiveSave: {
      form,
      loading: saveLoading,
      editorTitle,
      closeAdd,
      closeEdit,
      saveOne,
    },
    archiveDetail: {
      info: detailInfo,
      closeView,
    },
  }
}
