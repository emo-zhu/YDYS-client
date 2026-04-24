import { computed, reactive, ref } from 'vue'
import { ScoreAuditApi } from '../api/scoreAudit'
import { viewModal } from '../service/scoreAudit'
import type { ScoreAuditItem, ScoreAuditPageData, ScoreAuditQuery, ScoreAuditStatus, TableRowKey } from '../types/scoreAudit'

const query = reactive<ScoreAuditQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 10,
})

const pageData = ref<ScoreAuditPageData>({
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
const detailInfo = ref<ScoreAuditItem>()

const rowKey = (row: ScoreAuditItem) => row.id

const getSelectedRows = () => {
  const idSet = new Set(checkedRowKeys.value.map((key) => Number(key)))
  return pageData.value.records.filter((item) => idSet.has(item.id))
}

const getPage = async () => {
  loading.value = true
  try {
    pageData.value = await ScoreAuditApi.getPage(query)
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

const approveByIds = async (ids: number[]) => {
  await ScoreAuditApi.approveBatch({ ids })
  checkedRowKeys.value = checkedRowKeys.value.filter((key) => !ids.includes(Number(key)))
  await getPage()
}

const rejectByIds = async (ids: number[]) => {
  await ScoreAuditApi.rejectBatch({ ids })
  checkedRowKeys.value = checkedRowKeys.value.filter((key) => !ids.includes(Number(key)))
  await getPage()
}

const onOpenDetail = (row: ScoreAuditItem) => {
  detailInfo.value = row
  viewModal.open()
}

const onEdit = (row: ScoreAuditItem) => {
  window.$message?.info(`待补充编辑页：${row.userName}`)
}

const onApprove = (row: ScoreAuditItem) => {
  if (row.status !== '审核中') {
    window.$message?.warning('当前记录已处理')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认审批通过 ${row.userName} 的加减分记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreAuditApi.approveOne({ id: row.id })
      await getPage()
      window.$message?.success('审批成功')
    },
  })
}

const onReject = (row: ScoreAuditItem) => {
  if (row.status !== '审核中') {
    window.$message?.warning('当前记录已处理')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认驳回 ${row.userName} 的加减分记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await ScoreAuditApi.rejectOne({ id: row.id })
      await getPage()
      window.$message?.success('驳回成功')
    },
  })
}

const onBatchApprove = () => {
  const rows = getSelectedRows().filter((item) => item.status === '审核中')
  if (!rows.length) {
    window.$message?.warning('请选择状态为审核中的数据进行批量审批')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认批量审批选中的 ${rows.length} 条记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await approveByIds(rows.map((item) => item.id))
      window.$message?.success('批量审批成功')
    },
  })
}

const onBatchReject = () => {
  const rows = getSelectedRows().filter((item) => item.status === '审核中')
  if (!rows.length) {
    window.$message?.warning('请选择状态为审核中的数据进行批量驳回')
    return
  }

  window.$dialog.info({
    title: '温馨提示',
    content: `确认批量驳回选中的 ${rows.length} 条记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      await rejectByIds(rows.map((item) => item.id))
      window.$message?.success('批量驳回成功')
    },
  })
}

const onOpenProcess = (row: ScoreAuditItem) => {
  window.$message?.info(`待补充流程页面：${row.processStatus}`)
}

const getStatusText = (status: ScoreAuditStatus) => status
const closeView = () => {
  viewModal.close()
  detailInfo.value = undefined
}

const selectedRows = computed(() => getSelectedRows())
const batchApproveDisabled = computed(() => !selectedRows.value.some((item) => item.status === '审核中'))
const batchRejectDisabled = computed(() => !selectedRows.value.some((item) => item.status === '审核中'))
const tableScrollX = computed(() => 56 + 56 + 120 + 120 + 160 + 160 + 240 + 180 + 110 + 110 + 160 + 220)

export function useScoreAuditModule() {
  return {
    scoreAuditPage: {
      query,
      pageData,
      loading,
      checkedRowKeys,
      rowKey,
      tableScrollX,
      batchApproveDisabled,
      batchRejectDisabled,
      getPage,
      loadPage,
      onSearch,
      onReset,
      onOpenDetail,
      onEdit,
      onApprove,
      onReject,
      onBatchApprove,
      onBatchReject,
      onOpenProcess,
      getStatusText,
    },
    scoreAuditDetail: {
      info: detailInfo,
      closeView,
    },
  }
}
