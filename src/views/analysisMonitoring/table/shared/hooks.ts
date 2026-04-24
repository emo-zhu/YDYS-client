import { computed, reactive, ref, type Ref } from 'vue'
import { AnalysisTableApi } from './api'
import {
  analysisTableConfigMap,
  assessmentMonthOptions,
  assessmentYearOptions
} from './config'
import type {
  AnalysisTableItem,
  AnalysisTablePageData,
  AnalysisTablePageQuery,
  AnalysisTableType,
  TableRowKey
} from './types'

interface AnalysisTableModuleState {
  query: AnalysisTablePageQuery
  checkedRowKeys: Ref<TableRowKey[]>
  pageData: Ref<AnalysisTablePageData>
  pageLoading: Ref<boolean>
}

const moduleStateMap = new Map<AnalysisTableType, AnalysisTableModuleState>()

const createDefaultPageData = (): AnalysisTablePageData => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})

const getModuleState = (type: AnalysisTableType) => {
  if (!moduleStateMap.has(type)) {
    moduleStateMap.set(type, {
      query: reactive<AnalysisTablePageQuery>({
        keywords: '',
        assessmentYear: null,
        assessmentMonth: null,
        pageNum: 1,
        pageSize: 10
      }),
      checkedRowKeys: ref<TableRowKey[]>([]),
      pageData: ref<AnalysisTablePageData>(createDefaultPageData()),
      pageLoading: ref(false)
    })
  }

  return moduleStateMap.get(type)!
}

export const useAnalysisTableModule = (type: AnalysisTableType) => {
  const config = analysisTableConfigMap[type]
  const state = getModuleState(type)

  const rowKey = (row: AnalysisTableItem) => row.id

  const getPage = async () => {
    state.pageLoading.value = true
    try {
      state.pageData.value = await AnalysisTableApi.getPage(type, state.query)
      const recordIds = new Set(state.pageData.value.records.map((item) => item.id))
      state.checkedRowKeys.value = state.checkedRowKeys.value.filter((key) =>
        recordIds.has(Number(key))
      )
    } finally {
      state.pageLoading.value = false
    }
  }

  const loadPage = async () => {
    const pageSize = state.query.pageSize || 10
    const total = state.pageData.value.total || 0
    const pages = Math.max(1, Math.ceil(total / pageSize))
    if ((state.query.pageNum || 1) > pages) {
      state.query.pageNum = pages
    }
    await getPage()
  }

  const onSearch = async () => {
    state.query.pageNum = 1
    await getPage()
  }

  const onReset = async () => {
    state.query.keywords = ''
    state.query.assessmentYear = null
    state.query.assessmentMonth = null
    state.query.pageNum = 1
    state.query.pageSize = 10
    state.checkedRowKeys.value = []
    await getPage()
  }

  const onExport = async () => {
    const list = await AnalysisTableApi.getList(type)
    if (list.length === 0) {
      window.$message?.warning('暂无可导出的数据')
      return
    }

    window.$message?.success('导出成功')
  }

  const tableScrollX = computed(() => {
    let width = 56 + 120 + 120 + 120 + 120 + 120 + 120 + 120 + 120
    if (config.firstColumnTitle) {
      width += 180
    }
    if (config.showJobNo) {
      width += 120
    }
    if (config.showDepartment) {
      width += 160
    }
    if (config.showPersonCount) {
      width += 120
    }
    if (config.showAmount) {
      width += 120
    }
    return width
  })

  return {
    config,
    options: {
      assessmentYearOptions,
      assessmentMonthOptions
    },
    page: {
      query: state.query,
      checkedRowKeys: state.checkedRowKeys,
      pageData: state.pageData,
      loading: state.pageLoading,
      rowKey,
      tableScrollX,
      getPage,
      loadPage,
      onSearch,
      onReset,
      onExport
    }
  }
}
