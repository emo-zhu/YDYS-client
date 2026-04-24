import { computed, reactive, ref } from 'vue'
import {
  BehaviorRuleApi,
  createDefaultRuleForm,
  minusRuleAttributeOptions,
  minusRuleCategoryOptions,
  plusRuleAttributeOptions,
  plusRuleCategoryOptions,
  ruleTargetOptions,
  ruleTypeOptions,
  ruleUserOptions,
  scoreTypeOptions,
} from '../api/rules'
import { addModal, editModal, viewModal } from '../service/rules'
import type { BehaviorRuleDetail, BehaviorRuleForm, BehaviorRuleItem, BehaviorRuleTabValue } from '../types/rules'

const tabValue = ref<BehaviorRuleTabValue>('plus')
const plusRules = ref<BehaviorRuleItem[]>([])
const minusRules = ref<BehaviorRuleItem[]>([])
const loading = ref(false)
const addLoading = ref(false)
const form = reactive<BehaviorRuleForm>(createDefaultRuleForm())
const formTab = ref<BehaviorRuleTabValue>('plus')
const detailInfo = ref<BehaviorRuleDetail>()
const detailLoading = ref(false)

const rowKey = (row: BehaviorRuleItem) => row.id

const loadRules = async (tab: BehaviorRuleTabValue) => {
  loading.value = true
  try {
    const data = await BehaviorRuleApi.getList(tab)
    if (tab === 'plus') {
      plusRules.value = data
      return
    }
    minusRules.value = data
  } finally {
    loading.value = false
  }
}

const onTabChange = async (value: string) => {
  tabValue.value = value as BehaviorRuleTabValue
  if (tabValue.value === 'plus' && plusRules.value.length === 0) {
    await loadRules('plus')
    return
  }
  if (tabValue.value === 'minus' && minusRules.value.length === 0) {
    await loadRules('minus')
  }
}

const init = async () => {
  await loadRules(tabValue.value)
}

const resetForm = (parentRuleId: number | null = 1) => {
  Object.assign(form, createDefaultRuleForm(parentRuleId))
}

const onAdd = () => {
  formTab.value = tabValue.value
  resetForm((tabValue.value === 'plus' ? plusRuleCategoryOptions : minusRuleCategoryOptions)[0]?.value || null)
  addModal.open()
}

const onAddChild = (row: BehaviorRuleItem) => {
  formTab.value = tabValue.value
  resetForm(row.id)
  addModal.open()
}

const onEdit = async (row: BehaviorRuleItem) => {
  formTab.value = tabValue.value
  Object.assign(form, BehaviorRuleApi.createFormFromRule(tabValue.value, row))
  editModal.open()
}

const onView = async (row: BehaviorRuleItem) => {
  detailLoading.value = true
  try {
    detailInfo.value = await BehaviorRuleApi.getDetails(tabValue.value, row.id)
  } finally {
    detailLoading.value = false
  }
  viewModal.open()
}

const onDisable = (row: BehaviorRuleItem) => {
  window.$dialog.info({
    title: '温馨提示',
    content: `确认废止“${row.ruleName}”吗？`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick() {
      window.$message?.success('已废止')
    },
  })
}

const onOpenAnnualLimit = () => {
  window.$message?.info('当前年度总加分最高限：100 分')
}

const onExport = () => {
  window.$message?.success(`${tabValue.value === 'plus' ? '加分' : '减分'}规则导出成功`)
}

const onRefresh = async () => {
  await loadRules(tabValue.value)
  window.$message?.success('刷新成功')
}

const closeAdd = () => {
  addModal.close()
  resetForm()
}

const saveAdd = async () => {
  const ruleName = form.ruleName.trim()
  const isDuplicate = await BehaviorRuleApi.validateRuleName(formTab.value, { ruleName })
  if (isDuplicate) {
    window.$message?.warning('规则名称不能重复')
    return false
  }

  addLoading.value = true
  try {
    await BehaviorRuleApi.addRule(formTab.value, form)
    await loadRules(formTab.value)
    window.$message?.success('保存成功')
    return true
  } finally {
    addLoading.value = false
  }
}

const closeEdit = () => {
  editModal.close()
  resetForm()
}

const saveEdit = async () => {
  if (!form.id) {
    return false
  }

  const ruleName = form.ruleName.trim()
  const isDuplicate = await BehaviorRuleApi.validateRuleName(formTab.value, { id: form.id, ruleName })
  if (isDuplicate) {
    window.$message?.warning('规则名称不能重复')
    return false
  }

  addLoading.value = true
  try {
    await BehaviorRuleApi.editRule(formTab.value, form as BehaviorRuleForm & { id: number })
    await loadRules(formTab.value)
    window.$message?.success('保存成功')
    return true
  } finally {
    addLoading.value = false
  }
}

const closeView = () => {
  viewModal.close()
  detailInfo.value = undefined
}

const activeRules = computed(() => (tabValue.value === 'plus' ? plusRules.value : minusRules.value))
const tableScrollX = computed(() => {
  if (tabValue.value === 'plus') {
    return 56 + 240 + 160 + 150 + 150 + 110 + 110 + 110 + 160 + 180
  }
  return 56 + 240 + 160 + 150 + 150 + 110 + 110 + 110 + 160 + 140 + 180
})

export function useBehaviorRuleModule() {
  return {
    rulesPage: {
      tabValue,
      plusRules,
      minusRules,
      activeRules,
      loading,
      tableScrollX,
      rowKey,
      init,
      onTabChange,
      onAdd,
      onAddChild,
      onEdit,
      onView,
      onDisable,
      onOpenAnnualLimit,
      onExport,
      onRefresh,
    },
    rulesSave: {
      form,
      formTab,
      loading: addLoading,
      editorTitle: computed(() => `${form.id ? '编辑' : '新增'}${formTab.value === 'plus' ? '加分' : '减分'}规则`),
      ruleTypeOptions,
      ruleTargetOptions,
      plusRuleCategoryOptions,
      minusRuleCategoryOptions,
      plusRuleAttributeOptions,
      minusRuleAttributeOptions,
      ruleUserOptions,
      scoreTypeOptions,
      saveAdd,
      saveEdit,
      closeAdd,
      closeEdit,
    },
    rulesDetail: {
      info: detailInfo,
      loading: detailLoading,
      closeView,
    },
  }
}
