import { computed, reactive, ref } from 'vue'
import { ActivityApi, createDefaultActivityForm, formatDate, getActivityDateText, getToday, normalizeDate } from '../api/activity'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/activity'
import type { ActivityForm, ActivityItem, ActivityPageData, ActivityPageQuery, ActivityStatus, TableRowKey } from '../types/activity'

export const statusOptions = [
  { label: '已发布', value: '已发布' },
  { label: '未发布', value: '未发布' }
]

const createDefaultPageData = (): ActivityPageData => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1
})

const query = reactive<ActivityPageQuery>({
  title: '',
  dateRange: null,
  pageNum: 1,
  pageSize: 20
})

const checkedRowKeys = ref<TableRowKey[]>([])
const pageData = ref<ActivityPageData>(createDefaultPageData())
const pageLoading = ref(false)

const form = reactive<ActivityForm>(createDefaultActivityForm())
const saveLoading = ref(false)

const detailInfo = ref<ActivityItem>()
const detailLoading = ref(false)

const rowKey = (row: ActivityItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultActivityForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await ActivityApi.getPage(query)
    const recordIds = new Set(pageData.value.records.map((item) => item.id))
    checkedRowKeys.value = checkedRowKeys.value.filter((key) => recordIds.has(Number(key)))
  } finally {
    pageLoading.value = false
  }
}

const loadPage = () => {
  const pageSize = query.pageSize || 20
  const total = pageData.value.total || 0
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if ((query.pageNum || 1) > pages) {
    query.pageNum = pages
  }
  return getPage()
}

const onSearch = () => {
  query.pageNum = 1
  return getPage()
}

const onReset = () => {
  query.title = ''
  query.dateRange = null
  query.pageNum = 1
  query.pageSize = 20
  checkedRowKeys.value = []
  return getPage()
}

const openAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const initFormById = async (id: number) => {
  const info = await ActivityApi.getDetails({ id })
  if (!info) {
    return
  }
  Object.assign(form, {
    ...info,
    activityDateRange: [normalizeDate(info.activityStartDate), normalizeDate(info.activityEndDate)]
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
    detailInfo.value = await ActivityApi.getDetails({ id })
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const saveOne = async () => {
  saveLoading.value = true
  try {
    if (form.id) {
      await ActivityApi.editOne(form)
    } else {
      await ActivityApi.addOne(form)
      query.title = ''
      query.dateRange = null
      query.pageNum = 1
    }
    await getPage()
    window.$message?.success('保存成功')
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
  await ActivityApi.deleteBatch({ ids })
  checkedRowKeys.value = checkedRowKeys.value.filter((key) => !ids.includes(Number(key)))
  await getPage()
}

const onDelete = (id: number) => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认删除该活动吗？',
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
    content: `确认删除选中的${ids.length}条活动数据吗？`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      removeByIds(ids).then(() => {
        window.$message?.success('删除成功')
      })
    }
  })
}

const onUpdateStatus = (row: ActivityItem, status: ActivityStatus) => {
  const actionText = status === '已发布' ? '发布' : '取消发布'
  window.$dialog.info({
    title: '温馨提示',
    content: `确认${actionText}该活动吗？`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      ActivityApi.updateStatus({ id: row.id, status }).then(() => {
        row.status = status
        window.$message?.success(`${actionText}成功`)
      })
    }
  })
}

const onExport = async () => {
  const list = await ActivityApi.getList(query)
  if (list.length === 0) {
    window.$message?.warning('暂无可导出的活动数据')
    return
  }
  const header = ['活动状态', '行风活动主题', '活动开展时间', '活动组织部门', '活动录入日期', '录入人信息']
  const rows = list.map((item) => [
    item.status,
    item.title,
    getActivityDateText(item),
    item.department,
    item.entryDate,
    item.entryUser
  ])
  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `开展活动-${getToday()}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
  window.$message?.success('导出成功')
}

const tableScrollX = computed(() => 56 + 120 + 320 + 170 + 180 + 160 + 240 + 188)
const editorTitle = computed(() => (form.id ? '编辑活动' : '新增活动'))

export function useActivityPage() {
  return {
    query,
    checkedRowKeys,
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
    onBatchDelete,
    onUpdateStatus,
    onExport
  }
}

export function useActivitySave() {
  return {
    form,
    loading: saveLoading,
    editorTitle,
    resetForm,
    initFormById,
    saveOne,
    closeAdd,
    closeEdit
  }
}

export function useActivityDetail() {
  return {
    info: detailInfo,
    loading: detailLoading,
    closeView
  }
}

export function useActivityModule() {
  return {
    activityPage: useActivityPage(),
    activitySave: useActivitySave(),
    activityDetail: useActivityDetail()
  }
}
