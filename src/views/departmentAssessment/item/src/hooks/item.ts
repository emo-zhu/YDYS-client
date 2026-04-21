import { computed, reactive, ref } from 'vue'
import { clauseOptions, createDefaultItemForm, DepartmentAssessmentItemApi, itemTypeOptions } from '../api/item'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/item'
import type {
  DepartmentAssessmentItem,
  DepartmentAssessmentItemForm,
  DepartmentAssessmentItemPageData,
  DepartmentAssessmentItemPageQuery
} from '../types/item'

const query = reactive<DepartmentAssessmentItemPageQuery>({
  keywords: '',
  pageNum: 1,
  pageSize: 20
})

const pageData = ref<DepartmentAssessmentItemPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  current: 1,
  size: 20,
  pages: 1
})
const pageLoading = ref(false)

const form = reactive<DepartmentAssessmentItemForm>(createDefaultItemForm())
const saveLoading = ref(false)

const detailInfo = ref<DepartmentAssessmentItem>()
const detailLoading = ref(false)

const rowKey = (row: DepartmentAssessmentItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultItemForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await DepartmentAssessmentItemApi.getPage(query)
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
  const info = await DepartmentAssessmentItemApi.getDetails({ id })
  if (!info) {
    return
  }
  Object.assign(form, {
    ...info,
    clauseIds: [...info.clauseIds]
  })
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailLoading.value = true
  try {
    detailInfo.value = await DepartmentAssessmentItemApi.getDetails({ id })
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const saveOne = async () => {
  const itemName = form.itemName?.trim() || ''
  const isDuplicate = await DepartmentAssessmentItemApi.validateDuplicateName({
    id: form.id,
    itemName
  })
  if (isDuplicate) {
    window.$message?.warning('考评项名称不能重复')
    return false
  }

  saveLoading.value = true
  try {
    if (form.id) {
      await DepartmentAssessmentItemApi.editOne(form)
    } else {
      await DepartmentAssessmentItemApi.addOne(form)
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
    content: '确认删除该科室考评项目吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      DepartmentAssessmentItemApi.deleteOne({ id }).then(() => {
        loadPage().then(() => {
          window.$message?.success('删除成功')
        })
      })
    }
  })
}

const editorTitle = computed(() => (form.id ? '编辑科室考评项目' : '新增科室考评项目'))

export function useDepartmentAssessmentItemModule() {
  return {
    itemPage: {
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
    itemSave: {
      form,
      loading: saveLoading,
      itemTypeOptions,
      clauseOptions,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    itemDetail: {
      info: detailInfo,
      loading: detailLoading,
      closeView
    }
  }
}
