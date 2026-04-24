import { computed, reactive, ref } from 'vue'
import {
  assessmentYearOptions,
  clauseOptions,
  createDefaultScoreEntryForm,
  reportTargetOptions,
  ScoreEntryApi,
} from '../api/scoreEntry'
import { addModal, currentAddMode, currentEditId, editModal, viewModal } from '../service/scoreEntry'
import type {
  ScoreEntryForm,
  ScoreEntryItem,
  ScoreEntryMode,
  ScoreEntryPageData,
  ScoreEntryQuery,
  ScoreEntryStatus,
  TableRowKey,
} from '../types/scoreEntry'

const query = reactive<ScoreEntryQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 10,
})

const pageData = ref<ScoreEntryPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1,
})

const loading = ref(false)
const checkedRowKeys = ref<TableRowKey[]>([])
const form = reactive<ScoreEntryForm>(createDefaultScoreEntryForm())
const saveLoading = ref(false)
const detailInfo = ref<ScoreEntryItem>()

const rowKey = (row: ScoreEntryItem) => row.id

const resetForm = (mode: ScoreEntryMode = currentAddMode.value) => {
  Object.assign(form, createDefaultScoreEntryForm(mode))
}

const getPage = async () => {
  loading.value = true
  try {
    pageData.value = await ScoreEntryApi.getPage(query)
    const rowIds = new Set(pageData.value.records.map((item) => item.id))
    checkedRowKeys.value = checkedRowKeys.value.filter((key) => rowIds.has(Number(key)))
  } finally {
    loading.value = false
  }
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

const loadPage = async () => {
  const pageSize = query.pageSize || 10
  const total = pageData.value.total || 0
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if ((query.pageNum || 1) > pages) {
    query.pageNum = pages
  }
  await getPage()
}

const getSelectedRows = () => {
  const idSet = new Set(checkedRowKeys.value.map((key) => Number(key)))
  return pageData.value.records.filter((item) => idSet.has(item.id))
}

const openAdd = (mode: ScoreEntryMode) => {
  currentEditId.value = null
  currentAddMode.value = mode
  resetForm(mode)
  addModal.open()
}

const openEdit = async (row: ScoreEntryItem) => {
  currentEditId.value = row.id
  currentAddMode.value = row.behaviorType
  const detail = await ScoreEntryApi.getDetails({ id: row.id })
  if (!detail) {
    return
  }
  Object.assign(form, detail)
  editModal.open()
}

const openView = (row: ScoreEntryItem) => {
  detailInfo.value = row
  viewModal.open()
}

const closeView = () => {
  viewModal.close()
  detailInfo.value = undefined
}

const saveOne = async () => {
  saveLoading.value = true
  try {
    if (form.id) {
      await ScoreEntryApi.editOne(form as ScoreEntryForm & { id: number })
    } else {
      await ScoreEntryApi.addOne(form)
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
  resetForm('plus')
}

const closeEdit = () => {
  editModal.close()
  resetForm('plus')
  currentEditId.value = null
}

const onSubmit = (row: ScoreEntryItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认提交 ${row.userName} 的录入记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreEntryApi.submitOne({ id: row.id })
      await getPage()
      window.$message?.success('提交成功')
    },
  })
}

const onWithdraw = (row: ScoreEntryItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认撤回 ${row.userName} 的录入记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreEntryApi.withdrawOne({ id: row.id })
      await getPage()
      window.$message?.success('撤回成功')
    },
  })
}

const onDelete = (row: ScoreEntryItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认删除 ${row.userName} 的录入记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreEntryApi.deleteOne({ id: row.id })
      const currentPage = query.pageNum || 1
      const currentCount = pageData.value.records.length
      if (currentPage > 1 && currentCount <= 1) {
        query.pageNum = currentPage - 1
      }
      await getPage()
      window.$message?.success('删除成功')
    },
  })
}

const onBatchImport = () => {
  window.$message?.info('待补充批量导入流程')
}

const onBatchDelete = () => {
  const ids = checkedRowKeys.value.map((key) => Number(key))
  if (!ids.length) {
    window.$message?.warning('请先选择要删除的数据')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认删除选中的 ${ids.length} 条录入记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreEntryApi.deleteBatch({ ids })
      checkedRowKeys.value = []
      await loadPage()
      window.$message?.success('删除成功')
    },
  })
}

const onBatchSubmit = () => {
  const rows = getSelectedRows().filter((item) => item.status === '驳回')
  if (!rows.length) {
    window.$message?.warning('请选择状态为驳回的数据进行批量报审')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认批量报审选中的 ${rows.length} 条记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreEntryApi.submitBatch({ ids: rows.map((item) => item.id) })
      checkedRowKeys.value = []
      await getPage()
      window.$message?.success('批量报审成功')
    },
  })
}

const onBatchWithdraw = () => {
  const rows = getSelectedRows().filter((item) => item.status === '审核中')
  if (!rows.length) {
    window.$message?.warning('请选择状态为审核中的数据进行批量撤回')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认批量撤回选中的 ${rows.length} 条记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreEntryApi.withdrawBatch({ ids: rows.map((item) => item.id) })
      checkedRowKeys.value = []
      await getPage()
      window.$message?.success('批量撤回成功')
    },
  })
}

const onOpenProcess = (row: ScoreEntryItem) => {
  window.$message?.info(`待补充流程页面：${row.processStatus}`)
}

const tableScrollX = computed(() => 56 + 56 + 56 + 120 + 120 + 160 + 180 + 260 + 180 + 110 + 110 + 160 + 220)
const selectedRows = computed(() => getSelectedRows())
const batchSubmitDisabled = computed(() => !selectedRows.value.some((item) => item.status === '驳回'))
const batchWithdrawDisabled = computed(() => !selectedRows.value.some((item) => item.status === '审核中'))
const editorTitle = computed(() => {
  const prefix = form.behaviorType === 'minus' ? '减分' : '加分'
  return form.id ? `编辑${prefix}行为` : `新增${prefix}行为`
})
const scoreSignText = (status: ScoreEntryStatus) => status

export function useScoreEntryModule() {
  return {
    scoreEntryPage: {
      query,
      pageData,
      loading,
      checkedRowKeys,
      rowKey,
      tableScrollX,
      batchSubmitDisabled,
      batchWithdrawDisabled,
      getPage,
      loadPage,
      onSearch,
      onReset,
      openAdd,
      openEdit,
      openView,
      onSubmit,
      onWithdraw,
      onDelete,
      onBatchImport,
      onBatchDelete,
      onBatchSubmit,
      onBatchWithdraw,
      onOpenProcess,
      getStatusText: scoreSignText,
    },
    scoreEntrySave: {
      form,
      loading: saveLoading,
      editorTitle,
      assessmentYearOptions,
      clauseOptions,
      reportTargetOptions,
      saveOne,
      closeAdd,
      closeEdit,
    },
    scoreEntryView: {
      info: detailInfo,
      closeView,
    },
  }
}
