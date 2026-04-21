import { computed, reactive, ref } from 'vue'
import type { TreeSelectOption } from 'naive-ui'
import { createDefaultScopeForm, DepartmentAssessmentScopeApi } from '../api/scope'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/scope'
import type {
  DepartmentAssessmentScopeForm,
  DepartmentAssessmentScopeItem,
  DepartmentAssessmentScopePageData,
  DepartmentAssessmentScopePageQuery
} from '../types/scope'

const query = reactive<DepartmentAssessmentScopePageQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 10
})

const pageData = ref<DepartmentAssessmentScopePageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})
const pageLoading = ref(false)

const departmentOptions = ref<TreeSelectOption[]>([])

const form = reactive<DepartmentAssessmentScopeForm>(createDefaultScopeForm())
const saveLoading = ref(false)

const detailInfo = ref<DepartmentAssessmentScopeItem>()
const detailLoading = ref(false)

const rowKey = (row: DepartmentAssessmentScopeItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultScopeForm())
}

const ensureDepartmentOptions = async () => {
  if (departmentOptions.value.length) {
    return
  }
  departmentOptions.value = await DepartmentAssessmentScopeApi.getDepartmentOptions()
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await DepartmentAssessmentScopeApi.getPage(query)
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
  query.keywords = ''
  query.pageNum = 1
  query.pageSize = 10
  await getPage()
}

const openAdd = async () => {
  await ensureDepartmentOptions()
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const openEdit = async (id: number) => {
  await ensureDepartmentOptions()
  currentEditId.value = id
  const info = await DepartmentAssessmentScopeApi.getDetails({ id })
  if (!info) {
    return
  }
  Object.assign(form, {
    id: info.id,
    groupName: info.groupName,
    sortOrder: info.sortOrder,
    departmentIds: [...info.departmentIds]
  })
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailLoading.value = true
  try {
    detailInfo.value = await DepartmentAssessmentScopeApi.getDetails({ id })
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const saveOne = async () => {
  const groupName = form.groupName?.trim() || ''
  const isDuplicate = await DepartmentAssessmentScopeApi.validateDuplicateName({
    id: form.id,
    groupName
  })
  if (isDuplicate) {
    window.$message?.warning('科室考评组名称不能重复')
    return false
  }

  saveLoading.value = true
  try {
    if (form.id) {
      await DepartmentAssessmentScopeApi.editOne(form)
    } else {
      await DepartmentAssessmentScopeApi.addOne(form)
      query.keywords = ''
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
    content: '确认删除该科室考评范围吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      DepartmentAssessmentScopeApi.deleteOne({ id }).then(() => {
        loadPage().then(() => {
          window.$message?.success('删除成功')
        })
      })
    }
  })
}

const editorTitle = computed(() => (form.id ? '编辑科室考评范围' : '新增科室考评范围'))

export function useDepartmentAssessmentScopeModule() {
  return {
    scopePage: {
      query,
      pageData,
      loading: pageLoading,
      rowKey,
      getPage,
      loadPage,
      onSearch,
      onReset,
      openAdd,
      openEdit,
      openView,
      onDelete
    },
    scopeSave: {
      form,
      loading: saveLoading,
      departmentOptions,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    scopeDetail: {
      info: detailInfo,
      loading: detailLoading,
      closeView
    }
  }
}
