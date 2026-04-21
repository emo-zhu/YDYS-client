import { computed, reactive, ref } from 'vue'
import { OrganizationalApi } from '../api/organizational'
import {
  addModal,
  currentDepartmentId,
  currentSummaryId,
  currentSummarySource,
  currentViewDepartmentId,
  departmentEditModal,
  summaryEditModal,
  viewModal
} from '../service/organizational'
import type {
  BasicRow,
  DepartmentForm,
  DepartmentPageData,
  DepartmentPageQuery,
  DepartmentRow,
  EditSource,
  SummaryForm,
  TableRowKey
} from '../types/organizational'

const leadershipRows = ref<BasicRow[]>([])
const officeRows = ref<BasicRow[]>([])
const departmentPageQuery = reactive<DepartmentPageQuery>({
  pageNum: 1,
  pageSize: 20
})
const departmentPageData = ref<DepartmentPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1
})
const expandedRowKeys = ref<TableRowKey[]>(['dept-1', 'dept-2'])

const summaryForm = reactive<SummaryForm>({
  label: '',
  value: ''
})
const departmentForm = reactive<DepartmentForm>({
  leader: '',
  secretary: '',
  members: ''
})
const viewDepartment = ref<DepartmentRow>()

const displayText = (value: string) => {
  const text = value.trim()
  return text || '--'
}

const initPage = async () => {
  const [leadership, office] = await Promise.all([
    OrganizationalApi.getSummaryList('leadership'),
    OrganizationalApi.getSummaryList('office')
  ])
  leadershipRows.value = leadership
  officeRows.value = office
  await getDepartmentPage()
}

const getDepartmentPage = async () => {
  departmentPageData.value = await OrganizationalApi.getDepartmentPage(departmentPageQuery)
}

const loadDepartmentPage = async () => {
  const pageSize = departmentPageQuery.pageSize || 20
  const total = departmentPageData.value.total || 0
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if ((departmentPageQuery.pageNum || 1) > pages) {
    departmentPageQuery.pageNum = pages
  }
  expandedRowKeys.value = []
  await getDepartmentPage()
}

const openSummaryEdit = (source: EditSource, row: BasicRow) => {
  currentSummarySource.value = source
  currentSummaryId.value = row.id
  summaryForm.label = row.label
  summaryForm.value = row.value
  summaryEditModal.open()
}

const saveSummaryEdit = async () => {
  const value = summaryForm.value.trim()
  if (!value) {
    window.$message?.warning('内容不能为空')
    return false
  }
  await OrganizationalApi.updateSummary(currentSummarySource.value, currentSummaryId.value, value)
  await initPage()
  window.$message?.success('保存成功')
  return true
}

const openDepartmentEdit = async (row: DepartmentRow) => {
  if (row.isIncludeRow) {
    return
  }
  currentDepartmentId.value = row.id
  departmentForm.leader = row.leader
  departmentForm.secretary = row.secretary
  departmentForm.members = row.members
  departmentEditModal.open()
}

const saveDepartmentEdit = async () => {
  await OrganizationalApi.updateDepartment(currentDepartmentId.value, {
    leader: departmentForm.leader.trim(),
    secretary: departmentForm.secretary.trim(),
    members: departmentForm.members.trim()
  })
  await getDepartmentPage()
  window.$message?.success('保存成功')
  return true
}

const openView = async (id: string) => {
  currentViewDepartmentId.value = id
  viewDepartment.value = await OrganizationalApi.getDepartmentOne(id)
  viewModal.open()
}

const closeSummaryEdit = () => {
  summaryEditModal.close()
}

const closeDepartmentEdit = () => {
  departmentEditModal.close()
}

const closeView = () => {
  viewModal.close()
  viewDepartment.value = undefined
}

const onExpandedRowKeysUpdate = (keys: TableRowKey[]) => {
  expandedRowKeys.value = keys
}

const expandAll = () => {
  expandedRowKeys.value = departmentPageData.value.records.filter((item) => item.children?.length).map((item) => item.id)
}

const collapseAll = () => {
  expandedRowKeys.value = []
}

const editingLabel = computed(() => summaryForm.label || '')

export function useOrganizationalModule() {
  return {
    organizationalPage: {
      leadershipRows,
      officeRows,
      departmentPageQuery,
      departmentPageData,
      expandedRowKeys,
      displayText,
      initPage,
      getDepartmentPage,
      loadDepartmentPage,
      openSummaryEdit,
      openDepartmentEdit,
      openView,
      onExpandedRowKeysUpdate,
      expandAll,
      collapseAll
    },
    organizationalEdit: {
      summaryForm,
      departmentForm,
      editingLabel,
      saveSummaryEdit,
      saveDepartmentEdit,
      closeSummaryEdit,
      closeDepartmentEdit
    },
    organizationalView: {
      viewDepartment,
      closeView
    },
    organizationalModal: {
      addModal,
      summaryEditModal,
      departmentEditModal,
      viewModal
    }
  }
}
