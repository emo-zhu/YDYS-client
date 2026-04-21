import { computed, reactive, ref, type Ref } from 'vue'
import { createDefaultWorkMeetingForm, WorkMeetingApi } from './api'
import {
  workMeetingAssessmentYearOptions,
  workMeetingConfigMap,
  workMeetingDepartmentOptions
} from './config'
import { getWorkMeetingService } from './service'
import type {
  TableRowKey,
  WorkMeetingForm,
  WorkMeetingItem,
  WorkMeetingPageData,
  WorkMeetingPageQuery,
  WorkMeetingType
} from './types'

interface WorkMeetingModuleState {
  query: WorkMeetingPageQuery
  checkedRowKeys: Ref<TableRowKey[]>
  expandedRowKeys: Ref<TableRowKey[]>
  pageData: Ref<WorkMeetingPageData>
  pageLoading: Ref<boolean>
  form: WorkMeetingForm
  saveLoading: Ref<boolean>
  detailInfo: Ref<WorkMeetingItem | undefined>
  detailLoading: Ref<boolean>
}

const moduleStateMap = new Map<WorkMeetingType, WorkMeetingModuleState>()

const createDefaultPageData = (): WorkMeetingPageData => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1
})

const getModuleState = (type: WorkMeetingType) => {
  if (!moduleStateMap.has(type)) {
    moduleStateMap.set(type, {
      query: reactive<WorkMeetingPageQuery>({
        assessmentYear: null,
        assessmentPeriod: null,
        departmentName: null,
        pageNum: 1,
        pageSize: 20
      }),
      checkedRowKeys: ref<TableRowKey[]>([]),
      expandedRowKeys: ref<TableRowKey[]>([]),
      pageData: ref<WorkMeetingPageData>(createDefaultPageData()),
      pageLoading: ref(false),
      form: reactive<WorkMeetingForm>(createDefaultWorkMeetingForm(type)),
      saveLoading: ref(false),
      detailInfo: ref<WorkMeetingItem>(),
      detailLoading: ref(false)
    })
  }

  return moduleStateMap.get(type)!
}

export const useWorkMeetingModule = (type: WorkMeetingType) => {
  const config = workMeetingConfigMap[type]
  const state = getModuleState(type)
  const service = getWorkMeetingService(type)

  const rowKey = (row: WorkMeetingItem) => row.id

  const resetForm = () => {
    Object.assign(state.form, createDefaultWorkMeetingForm(type))
  }

  const getPage = async () => {
    state.pageLoading.value = true
    try {
      state.pageData.value = await WorkMeetingApi.getPage(type, state.query)
      const recordIds = new Set(state.pageData.value.records.map((item) => item.id))
      state.checkedRowKeys.value = state.checkedRowKeys.value.filter((key) =>
        recordIds.has(Number(key))
      )
      state.expandedRowKeys.value = state.expandedRowKeys.value.filter((key) =>
        recordIds.has(Number(key))
      )
    } finally {
      state.pageLoading.value = false
    }
  }

  const loadPage = async () => {
    const pageSize = state.query.pageSize || 20
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
    state.query.assessmentYear = null
    state.query.assessmentPeriod = null
    state.query.departmentName = null
    state.query.pageNum = 1
    state.query.pageSize = 20
    state.checkedRowKeys.value = []
    state.expandedRowKeys.value = []
    await getPage()
  }

  const openAdd = () => {
    service.currentEditId.value = null
    resetForm()
    service.addModal.open()
  }

  const initFormById = async (id: number) => {
    const info = await WorkMeetingApi.getDetails(type, { id })
    if (!info) {
      return
    }
    Object.assign(state.form, info)
  }

  const openEdit = async (id: number) => {
    service.currentEditId.value = id
    await initFormById(id)
    service.editModal.open()
  }

  const openView = async (id: number) => {
    service.currentViewId.value = id
    state.detailLoading.value = true
    try {
      state.detailInfo.value = await WorkMeetingApi.getDetails(type, { id })
    } finally {
      state.detailLoading.value = false
    }
    service.viewModal.open()
  }

  const saveOne = async () => {
    state.saveLoading.value = true
    try {
      if (state.form.id) {
        await WorkMeetingApi.editOne(type, state.form)
      } else {
        await WorkMeetingApi.addOne(type, state.form)
        state.query.pageNum = 1
      }

      await getPage()
      window.$message?.success('保存成功')
      return true
    } finally {
      state.saveLoading.value = false
    }
  }

  const closeAdd = () => {
    service.addModal.close()
    resetForm()
  }

  const closeEdit = () => {
    service.editModal.close()
    resetForm()
    service.currentEditId.value = null
  }

  const closeView = () => {
    service.viewModal.close()
    state.detailInfo.value = undefined
    service.currentViewId.value = null
  }

  const removeByIds = async (ids: number[]) => {
    await WorkMeetingApi.deleteBatch(type, { ids })
    state.checkedRowKeys.value = state.checkedRowKeys.value.filter(
      (key) => !ids.includes(Number(key))
    )
    await loadPage()
  }

  const onDelete = (id: number) => {
    window.$dialog.info({
      title: '温馨提示',
      content: `确认删除该${config.title}填报记录吗？`,
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
    const ids = state.checkedRowKeys.value.map((key) => Number(key))
    if (ids.length === 0) {
      window.$message?.warning('请先选择要删除的数据')
      return
    }

    window.$dialog.info({
      title: '温馨提示',
      content: `确认删除选中的${ids.length}条${config.title}数据吗？`,
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick() {
        removeByIds(ids).then(() => {
          window.$message?.success('删除成功')
        })
      }
    })
  }

  const onExpandedRowKeysUpdate = (keys: TableRowKey[]) => {
    state.expandedRowKeys.value = keys
  }

  const onOpenAttachment = (row: WorkMeetingItem) => {
    window.$message?.info(`附件：${row.attachmentName}`)
  }

  const onExport = async () => {
    const list = await WorkMeetingApi.getList(type, state.query)
    if (list.length === 0) {
      window.$message?.warning('暂无可导出的数据')
      return
    }

    const header = [
      '状态',
      '年度',
      '周期',
      '科室',
      '填报人',
      '填报人工号',
      '填报时间',
      '附件'
    ]
    const rows = list.map((item) => [
      item.status,
      item.assessmentYear,
      item.assessmentPeriod,
      item.departmentName,
      item.reporterName,
      item.reporterJobNo,
      item.reportTime,
      item.attachmentName
    ])

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${config.title}-填报记录.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    window.$message?.success('导出成功')
  }

  const editorTitle = computed(() =>
    state.form.id ? `编辑${config.title}` : `新增${config.title}`
  )

  const tableScrollX = computed(() =>
    56 + 56 + 120 + 120 + 120 + 260 + 160 + 160 + 160 + 300 + 132
  )

  return {
    config,
    modal: service,
    options: {
      assessmentYearOptions: workMeetingAssessmentYearOptions,
      departmentOptions: workMeetingDepartmentOptions,
      periodOptions: config.periodOptions
    },
    page: {
      query: state.query,
      checkedRowKeys: state.checkedRowKeys,
      expandedRowKeys: state.expandedRowKeys,
      pageData: state.pageData,
      loading: state.pageLoading,
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
      onExpandedRowKeysUpdate,
      onOpenAttachment,
      onExport
    },
    save: {
      form: state.form,
      loading: state.saveLoading,
      editorTitle,
      closeAdd,
      closeEdit,
      saveOne
    },
    detail: {
      info: state.detailInfo,
      loading: state.detailLoading,
      closeView
    }
  }
}
