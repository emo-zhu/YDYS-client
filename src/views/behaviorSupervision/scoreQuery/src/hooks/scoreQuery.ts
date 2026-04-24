import { computed, reactive, ref } from 'vue'
import {
  assessmentYearOptions,
  assessmentMonthOptions,
  createSupplementFormFromRow,
  scoreTypeOptions,
  ScoreQueryApi,
  supplementClauseOptions,
  targetTypeOptions,
} from '../api/scoreQuery'
import { supplementModal, viewModal } from '../service/scoreQuery'
import type {
  ScoreQueryHospitalItem,
  ScoreQueryHospitalQuery,
  ScoreQueryHospitalSummary,
  ScoreQueryMineItem,
  ScoreQueryMineQuery,
  ScoreQueryPageData,
  ScoreQuerySupplementForm,
  ScoreQueryTabValue,
  TableRowKey,
} from '../types/scoreQuery'

const tabValue = ref<ScoreQueryTabValue>('mine')

const mineQuery = reactive<ScoreQueryMineQuery>({
  pageNum: 1,
  pageSize: 10,
})

const hospitalQuery = reactive<ScoreQueryHospitalQuery>({
  assessmentYear: null,
  scoreType: null,
  assessmentMonth: null,
  recordDateRange: null,
  targetType: null,
  clauseId: null,
  keywords: '',
  pageNum: 1,
  pageSize: 10,
})

const minePageData = ref<ScoreQueryPageData<ScoreQueryMineItem>>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1,
})

const hospitalPageData = ref<ScoreQueryPageData<ScoreQueryHospitalItem>>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1,
})

const hospitalSummary = ref<ScoreQueryHospitalSummary>({
  amount: 0,
  plusScore: 0,
  minusScore: 0,
})

const mineLoading = ref(false)
const hospitalLoading = ref(false)
const supplementLoading = ref(false)
const mineExpandedRowKeys = ref<TableRowKey[]>([])
const hospitalCheckedRowKeys = ref<TableRowKey[]>([])
const supplementForm = reactive<ScoreQuerySupplementForm>(createSupplementFormFromRow())
const detailInfo = ref<ScoreQueryHospitalItem>()

const rowKey = (row: ScoreQueryMineItem | ScoreQueryHospitalItem) => row.id

const loadMinePage = async () => {
  mineLoading.value = true
  try {
    minePageData.value = await ScoreQueryApi.getMinePage(mineQuery)
    const rowIds = new Set(minePageData.value.records.map((item) => item.id))
    mineExpandedRowKeys.value = mineExpandedRowKeys.value.filter((key) => rowIds.has(Number(key)))
  } finally {
    mineLoading.value = false
  }
}

const loadHospitalPage = async () => {
  hospitalLoading.value = true
  try {
    const { pageData, summary } = await ScoreQueryApi.getHospitalPage(hospitalQuery)
    hospitalPageData.value = pageData
    hospitalSummary.value = summary
    const rowIds = new Set(hospitalPageData.value.records.map((item) => item.id))
    hospitalCheckedRowKeys.value = hospitalCheckedRowKeys.value.filter((key) => rowIds.has(Number(key)))
  } finally {
    hospitalLoading.value = false
  }
}

const onMineExpandedRowKeysUpdate = (keys: TableRowKey[]) => {
  mineExpandedRowKeys.value = keys
}

const onHospitalSearch = async () => {
  hospitalQuery.pageNum = 1
  await loadHospitalPage()
}

const onHospitalReset = async () => {
  hospitalQuery.assessmentYear = null
  hospitalQuery.scoreType = null
  hospitalQuery.assessmentMonth = null
  hospitalQuery.recordDateRange = null
  hospitalQuery.targetType = null
  hospitalQuery.clauseId = null
  hospitalQuery.keywords = ''
  hospitalQuery.pageNum = 1
  hospitalQuery.pageSize = 10
  hospitalCheckedRowKeys.value = []
  await loadHospitalPage()
}

const onTabChange = async (value: string) => {
  tabValue.value = value as ScoreQueryTabValue
  if (tabValue.value === 'mine' && minePageData.value.records.length === 0) {
    await loadMinePage()
    const firstRow = minePageData.value.records[0]
    if (firstRow) {
      mineExpandedRowKeys.value = [firstRow.id]
    }
    return
  }

  if (tabValue.value === 'hospital' && hospitalPageData.value.records.length === 0) {
    await loadHospitalPage()
  }
}

const init = async () => {
  await loadMinePage()
  const firstRow = minePageData.value.records[0]
  if (firstRow) {
    mineExpandedRowKeys.value = [firstRow.id]
  }
}

const onExport = () => {
  window.$message?.info('待补充导出功能')
}

const onSort = () => {
  window.$message?.info('待补充排序功能')
}

const onOpenDetail = (row: ScoreQueryHospitalItem) => {
  detailInfo.value = row
  viewModal.open()
}

const onEdit = (row: ScoreQueryHospitalItem) => {
  Object.assign(supplementForm, createSupplementFormFromRow(row))
  supplementModal.open()
}

const closeSupplement = () => {
  supplementModal.close()
  Object.assign(supplementForm, createSupplementFormFromRow())
}

const closeView = () => {
  viewModal.close()
  detailInfo.value = undefined
}

const saveSupplement = async () => {
  supplementLoading.value = true
  try {
    await ScoreQueryApi.saveSupplement(supplementForm)
    await loadHospitalPage()
    window.$message?.success('保存成功')
    return true
  } finally {
    supplementLoading.value = false
  }
}

const onRollback = (row: ScoreQueryHospitalItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认退回 ${row.userName} 的日常考评记录吗？`,
    positiveText: '确认',
    negativeText: '取消',
    async onPositiveClick() {
      window.$message?.success('已退回')
    },
  })
}

const onOpenProcess = (row: ScoreQueryHospitalItem) => {
  window.$message?.info(`待补充流程页面：${row.processStatus}`)
}

const mineTableScrollX = computed(() => 56 + 120 + 180 + 180 + 260 + 110 + 120 + 160)
const hospitalTableScrollX = computed(() => 56 + 56 + 120 + 140 + 120 + 220 + 180 + 180 + 110 + 110 + 160 + 220)

export function useScoreQueryModule() {
  return {
    scoreQueryPage: {
      tabValue,
      mineQuery,
      hospitalQuery,
      minePageData,
      hospitalPageData,
      hospitalSummary,
      mineLoading,
      hospitalLoading,
      mineExpandedRowKeys,
      hospitalCheckedRowKeys,
      assessmentYearOptions,
      assessmentMonthOptions,
      scoreTypeOptions,
      targetTypeOptions,
      clauseOptions: supplementClauseOptions.map((item) => ({
        label: item.label,
        value: item.value,
      })),
      rowKey,
      mineTableScrollX,
      hospitalTableScrollX,
      init,
      onTabChange,
      loadMinePage,
      loadHospitalPage,
      onMineExpandedRowKeysUpdate,
      onHospitalSearch,
      onHospitalReset,
      onExport,
      onSort,
      onOpenDetail,
      onEdit,
      onRollback,
      onOpenProcess,
    },
    scoreQuerySupplement: {
      form: supplementForm,
      loading: supplementLoading,
      assessmentYearOptions,
      supplementClauseOptions,
      save: saveSupplement,
      close: closeSupplement,
    },
    scoreQueryDetail: {
      info: detailInfo,
      closeView,
    },
  }
}
