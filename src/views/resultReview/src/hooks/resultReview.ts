import { reactive, ref } from 'vue'
import { createDefaultResultReviewForm, ResultReviewApi } from '../api/resultReview'
import {
  addModal,
  currentEditId,
  currentViewId,
  editModal,
  RESULT_REVIEW_STATUS_TEXT,
  viewModal
} from '../service/resultReview'
import type {
  ResultReviewItem,
  ResultReviewMutationForm,
  ResultReviewPageData,
  ResultReviewPageQuery,
  ResultReviewStatus
} from '../types/resultReview'

const query = reactive<ResultReviewPageQuery>({
  keywords: '',
  operateDateRange: null,
  pageNum: 1,
  pageSize: 10
})

const pageData = ref<ResultReviewPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})

const loading = ref(false)
const saveLoading = ref(false)

const form = reactive<ResultReviewMutationForm>(createDefaultResultReviewForm())
const detailInfo = ref<ResultReviewItem>()

const rowKey = (row: ResultReviewItem) => row.id

export const reviewYearOptions = Array.from({ length: 8 }).map((_, index) => {
  const year = 2021 + index
  return {
    label: String(year),
    value: year
  }
})

const resetForm = () => {
  Object.assign(form, createDefaultResultReviewForm())
}

const getPage = async () => {
  loading.value = true
  try {
    pageData.value = await ResultReviewApi.getPage(query)
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
  query.operateDateRange = null
  query.pageNum = 1
  query.pageSize = 10
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

const getStatusText = (status: ResultReviewStatus) => RESULT_REVIEW_STATUS_TEXT[status] || status

const onAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const onEdit = async (id: number) => {
  currentEditId.value = id
  const detail = await ResultReviewApi.getDetail({ id })
  if (!detail) {
    window.$message?.warning('未找到对应记录')
    return
  }
  Object.assign(form, detail)
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailInfo.value = await ResultReviewApi.getDetail({ id })
  if (!detailInfo.value) {
    currentViewId.value = null
    window.$message?.warning('未找到对应记录')
    return
  }
  viewModal.open()
}

const saveOne = async () => {
  const businessTitle = (form.businessTitle || '').trim()
  if (!businessTitle) {
    window.$message?.warning('请输入审查业务标题')
    return false
  }
  if (!form.reviewYears || form.reviewYears.length === 0) {
    window.$message?.warning('请选择审查时间范围')
    return false
  }
  if (!form.operateDate) {
    window.$message?.warning('请选择审查操作时间')
    return false
  }

  saveLoading.value = true
  try {
    form.businessTitle = businessTitle
    form.reviewYears = [...form.reviewYears].sort((a, b) => a - b)

    if (currentEditId.value) {
      await ResultReviewApi.editOne({
        id: currentEditId.value,
        ...form
      })
    } else {
      await ResultReviewApi.addOne(form)
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

const onExport = async (id: number) => {
  const data = await ResultReviewApi.exportOne({ id })
  window.$message?.success(`导出成功：${data.fileName}`)
}

const onDelete = (id: number) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认删除该条审查记录吗？',
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ResultReviewApi.deleteOne({ id })
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

const onOpenTitle = (row: ResultReviewItem) => {
  openView(row.id)
}

export function useResultReviewModule() {
  return {
    resultReviewPage: {
      query,
      pageData,
      loading,
      rowKey,
      getPage,
      loadPage,
      onSearch,
      onReset,
      onAdd,
      onEdit,
      openView,
      onExport,
      onDelete,
      onOpenTitle,
      getStatusText
    },
    resultReviewSave: {
      form,
      loading: saveLoading,
      closeAdd,
      closeEdit,
      saveOne
    },
    resultReviewView: {
      info: detailInfo,
      closeView
    }
  }
}
