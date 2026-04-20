import { computed, reactive, ref } from 'vue'
import { createDefaultUserForm, UserApi } from '../api/user'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/user'
import type { UserForm, UserItem, UserPageData, UserPageQuery } from '../types/user'

export const genderOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]

const query = reactive<UserPageQuery>({
  name: '',
  pageNum: 1,
  pageSize: 10
})

const pageData = ref<UserPageData>({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  size: 10,
  pages: 1
})
const pageLoading = ref(false)

const form = reactive<UserForm>(createDefaultUserForm())
const saveLoading = ref(false)

const detailInfo = ref<UserItem>()

const rowKey = (row: UserItem) => row.id

const resetForm = () => {
  Object.assign(form, createDefaultUserForm())
}

const getPage = async () => {
  pageLoading.value = true
  try {
    pageData.value = await UserApi.getPage(query)
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
  query.name = ''
  query.pageNum = 1
  query.pageSize = 10
  await getPage()
}

const openAdd = () => {
  currentEditId.value = null
  resetForm()
  addModal.open()
}

const openEdit = async (id: number) => {
  currentEditId.value = id
  const row = await UserApi.getDetails({ id })
  if (!row) {
    return
  }
  Object.assign(form, row)
  editModal.open()
}

const openView = async (id: number) => {
  currentViewId.value = id
  detailInfo.value = await UserApi.getDetails({ id })
  viewModal.open()
}

const saveOne = async () => {
  saveLoading.value = true
  try {
    if (form.id) {
      await UserApi.editOne(form)
    } else {
      await UserApi.addOne(form)
    }
    await onSearch()
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
    content: '确认删除该用户吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      UserApi.deleteOne({ id }).then(() => {
        loadPage().then(() => {
          window.$message?.success('删除成功')
        })
      })
    }
  })
}

const onResetPassword = () => {
  window.$dialog.info({
    title: '温馨提示',
    content: '确认重置该用户密码吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      window.$message?.success('密码已重置')
    }
  })
}

const editorTitle = computed(() => (form.id ? '编辑用户' : '新增用户'))
const tableScrollX = computed(() => 72 + 180 + 120 + 120 + 80 + 88)

export function useUserModule() {
  return {
    userPage: {
      query,
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
      onResetPassword
    },
    userSave: {
      form,
      loading: saveLoading,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    userView: {
      info: detailInfo,
      closeView
    }
  }
}
