import { computed, reactive, ref } from 'vue'
import { CommitmentApi, createDefaultCommitmentForm, normalizeDateTime } from '../api/commitment'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/commitment'
import type { CommitmentForm, CommitmentItem, CommitmentPageData, CommitmentPageQuery, CommitmentStatus } from '../types/commitment'

export const statusOptions = [
  { label: '进行中', value: '进行中' },
  { label: '已结束', value: '已结束' }
]

const query = reactive<CommitmentPageQuery>({
  reportName: '',
  dateRange: null,
  pageNum: 1,
  pageSize: 10
})

const pageData = ref<CommitmentPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})
const pageLoading = ref(false)

const form = reactive<CommitmentForm>(createDefaultCommitmentForm())
const saveLoading = ref(false)

const detailInfo = ref<CommitmentItem>()
const detailLoading = ref(false)

const rowKey = (row: CommitmentItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultCommitmentForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await CommitmentApi.getPage(query)
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
  query.reportName = ''
  query.dateRange = null
  query.pageNum = 1
  query.pageSize = 10
  await getPage()
}

const openAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const initFormById = async (id: number) => {
  const info = await CommitmentApi.getDetails({ id })
  if (!info) {
    return
  }
  Object.assign(form, {
    ...info,
    timeRange: [normalizeDateTime(info.startTime), normalizeDateTime(info.endTime)]
  })
}

const openEdit = async (id: number) => {
  currentEditId.value = id
  await initFormById(id)
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailLoading.value = true
  try {
    detailInfo.value = await CommitmentApi.getDetails({ id })
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const saveOne = async () => {
  saveLoading.value = true
  try {
    if (form.id) {
      await CommitmentApi.editOne(form)
    } else {
      await CommitmentApi.addOne(form)
      query.reportName = ''
      query.dateRange = null
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

const onDelete = (id: number) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认删除该自查自纠报告吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      CommitmentApi.deleteOne({ id }).then(() => {
        loadPage().then(() => {
          window.$message?.success('删除成功')
        })
      })
    }
  })
}

const onEnd = (row: CommitmentItem) => {
  if (row.status === '已结束') {
    return
  }
  window.$dialog.info({
    title: '温馨提示',
    content: '确认结束该自查自纠报告吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      CommitmentApi.updateStatus({ id: row.id, status: '已结束' }).then(() => {
        row.status = '已结束'
        if (detailInfo.value?.id === row.id) {
          detailInfo.value.status = '已结束'
        }
        window.$message?.success('结束成功')
      })
    }
  })
}

const editorTitle = computed(() => (form.id ? '编辑自查自纠报告' : '新增自查自纠报告'))
const tableScrollX = computed(() => 120 + 320 + 260 + 240 + 240 + 180 + 180 + 172)

export function useCommitmentModule() {
  return {
    commitmentPage: {
      query,
      pageData,
      loading: pageLoading,
      rowKey,
      tableScrollX,
      getPage,
      loadPage,
      onSearch,
      onReset,
      openAdd,
      openEdit,
      openView,
      onDelete,
      onEnd
    },
    commitmentSave: {
      form,
      loading: saveLoading,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    commitmentDetail: {
      info: detailInfo,
      loading: detailLoading,
      closeView
    }
  }
}
