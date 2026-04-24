import { computed, reactive, ref } from 'vue'
import {
  assessmentYearOptions,
  clauseOptions,
  createDefaultPersonalApplyForm,
  PersonalApplyApi,
  reportTargetOptions
} from '../api/personalApply'
import { addModal, currentEditId, editModal, viewModal } from '../service/personalApply'
import type {
  PersonalApplyForm,
  PersonalApplyItem,
  PersonalApplyPageData,
  PersonalApplyQuery,
  PersonalApplyStatus,
  TableRowKey
} from '../types/personalApply'

const query = reactive<PersonalApplyQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 10
})

const pageData = ref<PersonalApplyPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})

const loading = ref(false)
const checkedRowKeys = ref<TableRowKey[]>([])
const expandedRowKeys = ref<TableRowKey[]>([])
const form = reactive<PersonalApplyForm>(createDefaultPersonalApplyForm())
const saveLoading = ref(false)
const detailInfo = ref<PersonalApplyItem>()

const rowKey = (row: PersonalApplyItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultPersonalApplyForm())
}

const getPage = async () => {
  loading.value = true
  try {
    pageData.value = await PersonalApplyApi.getPage(query)
    const rowIds = new Set(pageData.value.records.map((item) => item.id))
    checkedRowKeys.value = checkedRowKeys.value.filter((key) => rowIds.has(Number(key)))
    expandedRowKeys.value = expandedRowKeys.value.filter((key) => rowIds.has(Number(key)))
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
  expandedRowKeys.value = []
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

const onExpandedRowKeysUpdate = (keys: TableRowKey[]) => {
  expandedRowKeys.value = keys
}

const getStatusText = (status: PersonalApplyStatus) => status

const onAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const onEdit = async (row: PersonalApplyItem) => {
  currentEditId.value = row.id
  const detail = await PersonalApplyApi.getDetails({ id: row.id })
  if (!detail) {
    return
  }
  Object.assign(form, detail)
  editModal.open()
}

const onView = (row: PersonalApplyItem) => {
  detailInfo.value = row
  viewModal.open()
}

const onOpenProcess = (row: PersonalApplyItem) => {
  window.$message?.info(`待补充流程页面：${row.processStatus || row.eventSummary}`)
}

const saveOne = async () => {
  saveLoading.value = true
  try {
    if (form.id) {
      await PersonalApplyApi.editOne(form as PersonalApplyForm & { id: number })
    } else {
      await PersonalApplyApi.addOne(form)
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
}

const onSubmit = (row: PersonalApplyItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认提交 ${row.userName} 的行为监督记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await PersonalApplyApi.submitOne({ id: row.id })
      await getPage()
      window.$message?.success('提交成功')
    }
  })
}

const removeByIds = async (ids: number[]) => {
  await PersonalApplyApi.deleteBatch({ ids })
  checkedRowKeys.value = checkedRowKeys.value.filter((key) => !ids.includes(Number(key)))
  await loadPage()
}

const onDelete = (row: PersonalApplyItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认删除 ${row.userName} 的行为监督记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await PersonalApplyApi.deleteOne({ id: row.id })
      const currentPage = query.pageNum || 1
      const currentCount = pageData.value.records.length
      if (currentPage > 1 && currentCount <= 1) {
        query.pageNum = currentPage - 1
      }
      await getPage()
      window.$message?.success('删除成功')
    }
  })
}

const onBatchDelete = () => {
  const ids = checkedRowKeys.value.map((key) => Number(key))
  if (!ids.length) {
    window.$message?.warning('请先选择要删除的数据')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认删除选中的 ${ids.length} 条行为监督记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await removeByIds(ids)
      window.$message?.success('删除成功')
    }
  })
}

const tableScrollX = computed(() => 56 + 56 + 120 + 140 + 140 + 120 + 220 + 180 + 120 + 120 + 160 + 240)

export function usePersonalApplyModule() {
  return {
    personalApplyPage: {
      query,
      pageData,
      loading,
      checkedRowKeys,
      expandedRowKeys,
      rowKey,
      tableScrollX,
      getPage,
      loadPage,
      onSearch,
      onReset,
      onExpandedRowKeysUpdate,
      onAdd,
      onEdit,
      onView,
      onOpenProcess,
      onSubmit,
      onDelete,
      onBatchDelete,
      getStatusText
    },
    personalApplySave: {
      form,
      loading: saveLoading,
      assessmentYearOptions,
      clauseOptions,
      reportTargetOptions,
      saveOne,
      closeAdd,
      closeEdit
    },
    personalApplyDetail: {
      info: detailInfo,
      closeView
    }
  }
}
