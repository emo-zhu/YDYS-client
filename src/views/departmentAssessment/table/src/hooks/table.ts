import { computed, reactive, ref } from 'vue'
import { createDefaultTableForm, DepartmentAssessmentTableApi } from '../api/table'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/table'
import type {
  DepartmentAssessmentRuleTableDetail,
  DepartmentAssessmentTableForm,
  DepartmentAssessmentTableItem,
  DepartmentAssessmentTablePageData,
  DepartmentAssessmentTablePageQuery
} from '../types/table'

const query = reactive<DepartmentAssessmentTablePageQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 20
})

const pageData = ref<DepartmentAssessmentTablePageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1
})
const pageLoading = ref(false)

const form = reactive<DepartmentAssessmentTableForm>(createDefaultTableForm())
const saveLoading = ref(false)

const detailInfo = ref<DepartmentAssessmentRuleTableDetail>()
const detailLoading = ref(false)

const rowKey = (row: DepartmentAssessmentTableItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultTableForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await DepartmentAssessmentTableApi.getPage(query)
  } finally {
    pageLoading.value = false
  }
}

const loadPage = async () => {
  const pageSize = query.pageSize || 20
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
  query.pageSize = 20
  await getPage()
}

const openAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const openEdit = async (id: number) => {
  currentEditId.value = id
  const info = await DepartmentAssessmentTableApi.getDetails({ id })
  if (!info) {
    return
  }
  Object.assign(form, {
    id: info.id,
    tableName: info.tableName
  })
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailLoading.value = true
  try {
    detailInfo.value = await DepartmentAssessmentTableApi.getDetails({ id })
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const saveOne = async () => {
  const tableName = form.tableName?.trim() || ''
  const isDuplicate = await DepartmentAssessmentTableApi.validateDuplicateName({
    id: form.id,
    tableName
  })
  if (isDuplicate) {
    window.$message?.warning('考评表名称不能重复')
    return false
  }

  saveLoading.value = true
  try {
    if (form.id) {
      await DepartmentAssessmentTableApi.editOne(form)
    } else {
      await DepartmentAssessmentTableApi.addOne(form)
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
    content: '确认删除该科室考评表吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      DepartmentAssessmentTableApi.deleteOne({ id }).then(() => {
        loadPage().then(() => {
          window.$message?.success('删除成功')
        })
      })
    }
  })
}

const editorTitle = computed(() => (form.id ? '编辑科室考评表' : '新增科室考评表'))

export function useDepartmentAssessmentTableModule() {
  return {
    tablePage: {
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
    tableSave: {
      form,
      loading: saveLoading,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    tableDetail: {
      info: detailInfo,
      loading: detailLoading,
      closeView
    }
  }
}
