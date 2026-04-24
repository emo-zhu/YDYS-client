import { StepModalFactory } from 'junegoo-ui'
import { reactive, ref } from 'vue'
import { AnnualRuleApi } from './api'
import type {
  AnnualRuleItem,
  AnnualRulePageData,
  AnnualRulePageQuery,
  AnnualRuleType,
  AssessmentTableForm,
  AssessmentTableItem,
  AssessmentUnitForm,
  AssessmentUnitItem,
  TableRowKey
} from './types'

const createPageData = <T extends object>(): AnnualRulePageData<T> => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})

const createAnnualRuleModuleState = (type: AnnualRuleType) => {
  const addModal = reactive(new StepModalFactory())
  const editModal = reactive(new StepModalFactory())
  const query = reactive<AnnualRulePageQuery>({
    keywords: '',
    pageNum: 1,
    pageSize: 10
  })
  const unitForm = reactive<AssessmentUnitForm>({
    unitName: '',
    departmentType: null,
    departmentLeader: null,
    branchSecretary: null,
    otherMembers: [],
    auditUser: null,
    includedDepartments: []
  })
  const tableForm = reactive<AssessmentTableForm>({
    name: ''
  })
  const pageData = ref<AnnualRulePageData<AnnualRuleItem>>(createPageData<AnnualRuleItem>())
  const loading = ref(false)
  const expandedRowKeys = ref<TableRowKey[]>(type === 'grade' ? [1, 2, 3, 4] : [])
  const departmentTypeOptions = [
    { label: '临床', value: '临床' },
    { label: '医技', value: '医技' },
    { label: '医管', value: '医管' },
    { label: '行政', value: '行政' },
    { label: '后勤', value: '后勤' }
  ]
  const userOptions = [
    { label: '敖辉', value: '敖辉' },
    { label: '张雅婷', value: '张雅婷' },
    { label: '毕亚雯', value: '毕亚雯' },
    { label: '周路', value: '周路' },
    { label: '周小兵', value: '周小兵' },
    { label: '顾锦丽', value: '顾锦丽' },
    { label: '王娇', value: '王娇' }
  ]
  const departmentOptions = [
    { label: '人事处', value: '人事处' },
    { label: '院长办公室', value: '院长办公室' },
    { label: '财务处', value: '财务处' },
    { label: '后勤处', value: '后勤处' },
    { label: '医务处', value: '医务处' },
    { label: '护理部', value: '护理部' },
    { label: '消化内科', value: '消化内科' },
    { label: '心血管内科', value: '心血管内科' }
  ]

  const resetUnitForm = () => {
    Object.assign(unitForm, {
      id: undefined,
      unitName: '',
      departmentType: null,
      departmentLeader: null,
      branchSecretary: null,
      otherMembers: [],
      auditUser: null,
      includedDepartments: []
    })
  }

  const resetTableForm = () => {
    Object.assign(tableForm, {
      id: undefined,
      name: ''
    })
  }

  const fillTableForm = (row: AssessmentTableItem) => {
    Object.assign(tableForm, {
      id: row.id,
      name: row.name
    })
  }

  const fillUnitForm = (row: AssessmentUnitItem) => {
    Object.assign(unitForm, {
      id: row.id,
      unitName: row.unitName,
      departmentType: row.departmentType || null,
      departmentLeader: row.departmentLeader || null,
      branchSecretary: row.branchSecretary || null,
      otherMembers: row.otherMembers ? row.otherMembers.split(',') : [],
      auditUser: row.auditUser || null,
      includedDepartments: row.includedDepartments ? row.includedDepartments.split(',') : []
    })
  }

  const getPage = async () => {
    loading.value = true
    try {
      pageData.value = await AnnualRuleApi.getPage<AnnualRuleItem>(type, query)
    } finally {
      loading.value = false
    }
  }

  const loadPage = async () => {
    const pageSize = query.pageSize || 10
    const pages = Math.max(1, Math.ceil((pageData.value.total || 0) / pageSize))
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
    query.keywords = ''
    query.pageNum = 1
    query.pageSize = 10
    await getPage()
  }

  const onRefresh = async () => {
    await getPage()
    window.$message?.success('刷新成功')
  }

  const onTodo = (action: string) => {
    window.$message?.info(`${action}功能待接口联调后接入`)
  }

  const openAdd = () => {
    if (type === 'unit') {
      resetUnitForm()
      addModal.open()
      return
    }

    if (type === 'table') {
      resetTableForm()
      addModal.open()
      return
    }

    onTodo('新增')
  }

  const openTableAdd = () => {
    resetTableForm()
    addModal.open()
  }

  const closeAdd = () => {
    addModal.close()
    resetUnitForm()
    resetTableForm()
  }

  const saveAdd = () => {
    window.$message?.success('保存成功')
    closeAdd()
  }

  const openEdit = (row: AssessmentUnitItem) => {
    fillUnitForm(row)
    editModal.open()
  }

  const openTableEdit = (row: AssessmentTableItem) => {
    fillTableForm(row)
    editModal.open()
  }

  const closeEdit = () => {
    editModal.close()
    resetUnitForm()
    resetTableForm()
  }

  const saveEdit = () => {
    window.$message?.success('保存成功')
    closeEdit()
  }

  return {
    type,
    addModal,
    editModal,
    query,
    tableForm,
    unitForm,
    pageData,
    loading,
    expandedRowKeys,
    departmentTypeOptions,
    userOptions,
    departmentOptions,
    rowKey: (row: AnnualRuleItem) => row.id,
    getPage,
    loadPage,
    onSearch,
    onReset,
    onRefresh,
    onTodo,
    openAdd,
    openTableAdd,
    closeAdd,
    saveAdd,
    openEdit,
    openTableEdit,
    closeEdit,
    saveEdit
  }
}

const moduleMap = new Map<AnnualRuleType, ReturnType<typeof createAnnualRuleModuleState>>()

export const useAnnualRuleModule = (type: AnnualRuleType) => {
  if (!moduleMap.has(type)) {
    moduleMap.set(type, createAnnualRuleModuleState(type))
  }

  return moduleMap.get(type)!
}
