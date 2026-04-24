import type {
  BehaviorRuleForm,
  BehaviorRuleDetail,
  BehaviorRuleItem,
  BehaviorRuleOption,
  BehaviorRuleTabValue,
  BehaviorRuleUserOption,
} from '../types/rules'

export const ruleTypeOptions: BehaviorRuleOption[] = [
  { label: '规则分类', value: 'category' },
  { label: '规则明细', value: 'detail' },
]

export const ruleTargetOptions: BehaviorRuleOption[] = [
  { label: '人员', value: 'person' },
  { label: '科室', value: 'department' },
]

export const plusRuleCategoryOptions: BehaviorRuleOption<number>[] = [
  { label: '优秀行为', value: 1 },
  { label: '加分', value: 2 },
]

export const plusRuleAttributeOptions: BehaviorRuleOption[] = [
  { label: '表扬奖励', value: 'praise' },
  { label: '专项贡献', value: 'contribution' },
  { label: '主动服务', value: 'service' },
]

export const minusRuleCategoryOptions: BehaviorRuleOption<number>[] = [
  { label: '违反工作纪律', value: 11 },
  { label: '患者投诉', value: 12 },
  { label: '违反九项准则', value: 13 },
  { label: '迟到', value: 14 },
]

export const minusRuleAttributeOptions: BehaviorRuleOption[] = [
  { label: '纪律扣分', value: 'discipline' },
  { label: '投诉扣分', value: 'complaint' },
  { label: '准则扣分', value: 'standard' },
]

export const ruleUserOptions: BehaviorRuleUserOption[] = [
  { label: '张雅婷', value: 'user-1', department: '党委办公室' },
  { label: '钟晟', value: 'user-2', department: '医务部' },
  { label: '王弘炜', value: 'user-3', department: '神经科' },
]

export const scoreTypeOptions: BehaviorRuleOption[] = [
  { label: '固定分值', value: 'fixed' },
  { label: '区间分值', value: 'range' },
]

let plusRuleStore: BehaviorRuleItem[] = [
  {
    id: 1,
    ruleName: '优秀行为',
    ruleAttribute: '加分',
    creator: '张雅婷',
    reviewer: '钟晟',
    fixedScore: 0,
    minScore: 0,
    maxScore: 0,
    ruleTarget: '个人',
    description: '用于登记服务表扬、拾金不昧、主动帮扶等正向行为。',
    applicationScope: '适用于日常行为监督场景下的个人加分。',
  },
  {
    id: 2,
    ruleName: '加分',
    ruleAttribute: '加分',
    creator: '张雅婷',
    reviewer: '钟晟',
    fixedScore: 0,
    minScore: 0,
    maxScore: 0,
    ruleTarget: '个人',
    description: '用于补录一般性加分条款，后续可继续新增子规则。',
    applicationScope: '适用于尚未细分的通用加分规则维护。',
  },
]

let minusRuleStore: BehaviorRuleItem[] = [
  {
    id: 11,
    ruleName: '违反工作纪律',
    ruleAttribute: '减分',
    creator: '张雅婷',
    reviewer: '钟晟',
    fixedScore: 0,
    minScore: 0,
    maxScore: 0,
    ruleTarget: '个人',
    syncMinusScore: false,
    description: '用于登记迟到、早退、脱岗等纪律类扣分规则。',
    applicationScope: '适用于个人纪律考核。',
  },
  {
    id: 12,
    ruleName: '患者投诉',
    ruleAttribute: '减分',
    creator: '张雅婷',
    reviewer: '钟晟',
    fixedScore: 0,
    minScore: 0,
    maxScore: 0,
    ruleTarget: '个人',
    syncMinusScore: false,
    description: '投诉经核实后按照情节进行扣分。',
    applicationScope: '适用于服务投诉、满意度问题等场景。',
  },
  {
    id: 13,
    ruleName: '违反九项准则',
    ruleAttribute: '减分',
    creator: '张雅婷',
    reviewer: '钟晟',
    fixedScore: 0,
    minScore: 0,
    maxScore: 0,
    ruleTarget: '个人',
    syncMinusScore: false,
    description: '对违反医德医风九项准则的行为进行统一扣分。',
    applicationScope: '适用于违反行业规范和院内制度的行为。',
  },
  {
    id: 14,
    ruleName: '迟到',
    ruleAttribute: '减分',
    creator: '张雅婷',
    reviewer: '钟晟',
    fixedScore: 0,
    minScore: 0,
    maxScore: 0,
    ruleTarget: '个人',
    syncMinusScore: false,
    description: '对日常考勤迟到行为进行扣分处理。',
    applicationScope: '适用于考勤管理相关扣分。',
  },
]

const cloneList = (list: BehaviorRuleItem[]) => list.map((item) => ({ ...item }))
const optionLabelMap = <T extends string | number>(options: BehaviorRuleOption<T>[]) =>
  new Map(options.map((item) => [item.value, item.label]))

const categoryLabelMap = optionLabelMap(plusRuleCategoryOptions)
const minusCategoryLabelMap = optionLabelMap(minusRuleCategoryOptions)
const targetLabelMap = optionLabelMap(ruleTargetOptions)
const attributeLabelMap = optionLabelMap(plusRuleAttributeOptions)
const minusAttributeLabelMap = optionLabelMap(minusRuleAttributeOptions)
const userLabelMap = optionLabelMap(ruleUserOptions)
const ruleTypeLabelMap = optionLabelMap(ruleTypeOptions)
const scoreTypeLabelMap = optionLabelMap(scoreTypeOptions)

export const createDefaultRuleForm = (parentRuleId: number | null = 1): BehaviorRuleForm => ({
  ruleType: 'detail',
  targetType: 'person',
  ruleName: '',
  parentRuleId,
  ruleAttribute: null,
  departmentSync: false,
  creatorId: null,
  reviewerId: null,
  scoreType: 'fixed',
  fixedScore: 0,
  minScore: null,
  maxScore: null,
  limitAccumulated: false,
  allowDepartmentReport: true,
  fillAmount: false,
  effectiveDate: '2026-04-23',
})

const normalizeRule = (tab: BehaviorRuleTabValue, form: BehaviorRuleForm, id: number): BehaviorRuleItem => {
  const fixedScore = form.scoreType === 'fixed' ? Number(form.fixedScore || 0) : 0
  const minScore = form.scoreType === 'range' ? Number(form.minScore || 0) : 0
  const maxScore = form.scoreType === 'range' ? Number(form.maxScore || 0) : fixedScore
  const categoryMap = tab === 'plus' ? categoryLabelMap : minusCategoryLabelMap
  const ruleAttributeMap = tab === 'plus' ? attributeLabelMap : minusAttributeLabelMap

  return {
    id,
    parentRuleId: form.parentRuleId,
    ruleName: form.ruleName.trim(),
    ruleAttribute: form.ruleAttribute ? ruleAttributeMap.get(form.ruleAttribute) || '' : '',
    creator: form.creatorId ? userLabelMap.get(form.creatorId) || '' : '',
    reviewer: form.reviewerId ? userLabelMap.get(form.reviewerId) || '' : '',
    fixedScore,
    minScore,
    maxScore,
    ruleTarget: targetLabelMap.get(form.targetType) || '',
    departmentSync: tab === 'plus' ? form.departmentSync : undefined,
    syncMinusScore: tab === 'minus' ? form.departmentSync : undefined,
    effectiveDate: form.effectiveDate || '',
    description: `${categoryMap.get(form.parentRuleId || 0) || (tab === 'plus' ? '加分规则' : '减分规则')}下的${tab === 'plus' ? '加分' : '减分'}明细。`,
    applicationScope:
      form.targetType === 'person'
        ? `适用于人员日常${tab === 'plus' ? '加分' : '减分'}规则。`
        : `适用于科室日常${tab === 'plus' ? '加分' : '减分'}规则。`,
  }
}

export namespace BehaviorRuleApi {
  export const getList = async (tab: BehaviorRuleTabValue): Promise<BehaviorRuleItem[]> => {
    return cloneList(tab === 'plus' ? plusRuleStore : minusRuleStore)
  }

  export const getDetails = async (tab: BehaviorRuleTabValue, id: number): Promise<BehaviorRuleDetail | undefined> => {
    const target = (tab === 'plus' ? plusRuleStore : minusRuleStore).find((item) => item.id === id)
    if (!target) {
      return undefined
    }

    return {
      ...target,
      ruleTypeName: ruleTypeLabelMap.get('detail') || '规则明细',
      scoreTypeName: target.fixedScore ? scoreTypeLabelMap.get('fixed') || '固定分值' : scoreTypeLabelMap.get('range') || '区间分值',
      limitAccumulated: false,
      allowDepartmentReport: true,
      fillAmount: false,
    }
  }

  export const addRule = async (tab: BehaviorRuleTabValue, form: BehaviorRuleForm) => {
    const store = tab === 'plus' ? plusRuleStore : minusRuleStore
    const nextId = Math.max(...store.map((item) => item.id), 0) + 1
    const nextRule = normalizeRule(tab, form, nextId)
    if (tab === 'plus') {
      plusRuleStore = [nextRule, ...plusRuleStore]
    } else {
      minusRuleStore = [nextRule, ...minusRuleStore]
    }
    return nextId
  }

  export const editRule = async (tab: BehaviorRuleTabValue, form: BehaviorRuleForm & { id: number }) => {
    const store = tab === 'plus' ? plusRuleStore : minusRuleStore
    const index = store.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    const nextRule = normalizeRule(tab, form, form.id)
    if (tab === 'plus') {
      plusRuleStore[index] = nextRule
      plusRuleStore = [...plusRuleStore]
    } else {
      minusRuleStore[index] = nextRule
      minusRuleStore = [...minusRuleStore]
    }
  }

  export const validateRuleName = async (tab: BehaviorRuleTabValue, { id, ruleName }: { id?: number; ruleName: string }) => {
    return (tab === 'plus' ? plusRuleStore : minusRuleStore).some((item) => item.ruleName === ruleName && item.id !== id)
  }

  export const createFormFromRule = (tab: BehaviorRuleTabValue, row: BehaviorRuleItem): BehaviorRuleForm => {
    const categoryOptions = tab === 'plus' ? plusRuleCategoryOptions : minusRuleCategoryOptions
    const attributeOptions = tab === 'plus' ? plusRuleAttributeOptions : minusRuleAttributeOptions
    const parentRuleId = categoryOptions.some((item) => item.value === row.parentRuleId)
      ? row.parentRuleId || categoryOptions[0]?.value || null
      : categoryOptions[0]?.value || null
    const ruleAttribute = attributeOptions.find((item) => item.label === row.ruleAttribute)?.value || null

    return {
      ...createDefaultRuleForm(parentRuleId),
      id: row.id,
      ruleName: row.ruleName,
      parentRuleId,
      ruleAttribute,
      targetType: row.ruleTarget === '科室' ? 'department' : 'person',
      departmentSync: tab === 'plus' ? Boolean(row.departmentSync) : Boolean(row.syncMinusScore),
      creatorId: ruleUserOptions.find((item) => item.label === row.creator)?.value || null,
      reviewerId: ruleUserOptions.find((item) => item.label === row.reviewer)?.value || null,
      scoreType: row.fixedScore ? 'fixed' : 'range',
      fixedScore: row.fixedScore,
      minScore: row.fixedScore ? null : row.minScore,
      maxScore: row.fixedScore ? null : row.maxScore,
      effectiveDate: row.effectiveDate || '2026-04-23',
    }
  }
}
