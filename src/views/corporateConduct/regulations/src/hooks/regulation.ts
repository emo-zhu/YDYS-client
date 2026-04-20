import { computed, reactive, ref } from 'vue'
import { RegulationApi, createDefaultRegulationForm } from '../api/regulation'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/regulation'
import type { RegulationFileType, RegulationForm, RegulationItem, RegulationPageData, RegulationPageQuery, TableRowKey } from '../types/regulation'

export const fileTypeOptions = [
  { label: '规章制度', value: '规章制度' },
  { label: '学习资料', value: '学习资料' }
]

const query = reactive<RegulationPageQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 10
})

const checkedRowKeys = ref<TableRowKey[]>([])
const pageData = ref<RegulationPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})
const pageLoading = ref(false)

const form = reactive<RegulationForm>(createDefaultRegulationForm())
const saveLoading = ref(false)

const detailInfo = ref<RegulationItem>()

const rowKey = (row: RegulationItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultRegulationForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await RegulationApi.getPage(query)
    const pageIds = new Set(pageData.value.records.map((item) => item.id))
    checkedRowKeys.value = checkedRowKeys.value.filter((key) => pageIds.has(Number(key)))
  } finally {
    pageLoading.value = false
  }
}

const loadPage = async () => {
  const pageSize = query.pageSize || 10
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
  query.pageNum = 1
  query.pageSize = 10
  checkedRowKeys.value = []
  await getPage()
}

const openAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const openEdit = async (id: number) => {
  currentEditId.value = id
  const row = await RegulationApi.getDetails({ id })
  if (!row) {
    return
  }
  Object.assign(form, row)
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailInfo.value = await RegulationApi.getDetails({ id })
  viewModal.open()
}

const saveOne = async () => {
  const title = (form.title || '').trim()
  if (!title) {
    window.$message?.warning('请输入标题')
    return false
  }

  saveLoading.value = true
  try {
    form.title = title
    form.publishDate = (form.publishDate || '').trim() || createDefaultRegulationForm().publishDate
    form.contentName = (form.contentName || `${title}.pdf`).trim()
    if (form.id) {
      await RegulationApi.editOne(form)
    } else {
      await RegulationApi.addOne(form)
      query.keywords = ''
      query.pageNum = 1
    }
    await getPage()
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

const removeByIds = async (ids: number[]) => {
  await RegulationApi.deleteBatch({ ids })
  checkedRowKeys.value = checkedRowKeys.value.filter((key) => !ids.includes(Number(key)))
  await getPage()
}

const onDelete = (id: number) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认删除该文件吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      removeByIds([id]).then(() => {
        window.$message?.success('删除成功')
      })
    }
  })
}

const onBatchDelete = () => {
  const ids = checkedRowKeys.value.map((key) => Number(key))
  if (ids.length === 0) {
    window.$message?.warning('请先选择要删除的数据')
    return
  }
  window.$dialog.info({
    title: '温馨提示',
    content: `确认删除选中的${ids.length}条数据吗？`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      removeByIds(ids).then(() => {
        window.$message?.success('删除成功')
      })
    }
  })
}

const onOpenContent = async (row: RegulationItem) => {
  await RegulationApi.increaseBrowseCount({ id: row.id })
  row.browseCount += 1
  if (detailInfo.value?.id === row.id) {
    detailInfo.value.browseCount = row.browseCount
  }
  window.$message?.info(`已打开：${row.contentName}`)
}

const editorTitle = computed(() => (form.id ? '编辑制度文件' : '新增制度文件'))

export function useRegulationModule() {
  return {
    regulationPage: {
      query,
      checkedRowKeys,
      pageData,
      loading: pageLoading,
      rowKey,
      getPage,
      loadPage,
      onSearch,
      onReset,
      openAdd,
      openEdit,
      openView,
      onDelete,
      onBatchDelete,
      onOpenContent
    },
    regulationSave: {
      form,
      loading: saveLoading,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    regulationView: {
      info: detailInfo,
      closeView
    }
  }
}
