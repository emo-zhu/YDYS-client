import { computed, reactive, ref } from 'vue'
import { createDefaultPersonalCommitmentForm, PersonalCommitmentApi } from '../api/personalCommitment'
import { addModal, currentEditId, currentViewId, editModal, viewModal } from '../service/personalCommitment'
import type { PersonalCommitmentForm, PersonalCommitmentItem } from '../types/personalCommitment'

const info = ref<PersonalCommitmentItem>()
const loading = ref(false)

const form = reactive<PersonalCommitmentForm>(createDefaultPersonalCommitmentForm())
const saveLoading = ref(false)

const detailInfo = ref<PersonalCommitmentItem>()
const detailLoading = ref(false)

const resetForm = () => {
  Object.assign(form, createDefaultPersonalCommitmentForm())
}

const resolveTitle = (item?: PersonalCommitmentItem) => {
  if (!item) {
    return '医务人员廉洁行医承诺书'
  }
  return `${item.title} - ${item.personName} - ${item.personCode}`
}

const loadCurrent = async () => {
  loading.value = true
  try {
    info.value = await PersonalCommitmentApi.getCurrent()
  } finally {
    loading.value = false
  }
}

const initFormById = async (id: number) => {
  const current = await PersonalCommitmentApi.getDetails({ id })
  if (!current) {
    return
  }
  Object.assign(form, {
    id: current.id,
    signatureName: current.signatureName || current.personName
  })
}

const openAdd = async () => {
  await loadCurrent()
  const current = info.value
  if (!current) {
    return
  }
  currentEditId.value = current.id
  await initFormById(current.id)
  addModal.open()
}

const openEdit = async (id?: number) => {
  const targetId = id || info.value?.id
  if (!targetId) {
    return
  }
  currentEditId.value = targetId
  await initFormById(targetId)
  editModal.open()
}

const openView = async (id?: number) => {
  const targetId = id || info.value?.id
  if (!targetId) {
    return
  }
  currentViewId.value = targetId
  detailLoading.value = true
  try {
    detailInfo.value = await PersonalCommitmentApi.getDetails({ id: targetId })
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const saveOne = async () => {
  if (!form.signatureName.trim()) {
    window.$message?.warning('请输入个人签字')
    return false
  }

  saveLoading.value = true
  try {
    await PersonalCommitmentApi.signOne(form)
    await loadCurrent()
    if (currentViewId.value) {
      detailInfo.value = await PersonalCommitmentApi.getDetails({ id: currentViewId.value })
    }
    window.$message?.success('签署成功')
    return true
  } finally {
    saveLoading.value = false
  }
}

const closeAdd = () => {
  addModal.close()
  resetForm()
  currentEditId.value = null
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

const editorTitle = computed(() => resolveTitle(info.value))
const viewerTitle = computed(() => resolveTitle(detailInfo.value || info.value))

export function usePersonalCommitmentModule() {
  return {
    personalCommitmentPage: {
      info,
      loading,
      loadCurrent,
      openAdd,
      openEdit,
      openView
    },
    personalCommitmentSave: {
      form,
      loading: saveLoading,
      editorTitle,
      saveOne,
      closeAdd,
      closeEdit
    },
    personalCommitmentDetail: {
      info: detailInfo,
      loading: detailLoading,
      viewerTitle,
      closeView
    }
  }
}
