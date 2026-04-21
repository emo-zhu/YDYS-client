import type {
  DepartmentAssessmentItem,
  DepartmentAssessmentItemForm,
  DepartmentAssessmentItemOption,
  DepartmentAssessmentItemPageData,
  DepartmentAssessmentItemPageQuery,
  DepartmentAssessmentItemType
} from '../types/item'

export const itemTypeOptions: DepartmentAssessmentItemOption[] = [
  { label: '固定分', value: 'fixed' },
  { label: '加减分', value: 'plusMinus' },
  { label: '加减分上限', value: 'plusMinusWithCap' },
  { label: '区间分', value: 'range' },
  { label: '公式分', value: 'formula' }
]

export const clauseOptions: DepartmentAssessmentItemOption[] = [
  { label: '患者投诉扣分', value: 'clause-1' },
  { label: '表扬加分', value: 'clause-2' },
  { label: '违规检查扣分', value: 'clause-3' },
  { label: '专项督查加分', value: 'clause-4' }
]

const clauseMap = new Map(clauseOptions.map((item) => [item.value, item.label]))
const itemTypeMap = new Map(itemTypeOptions.map((item) => [item.value, item.label]))

const resolveClauseNames = (ids: string[]) => ids.map((id) => clauseMap.get(id)).filter(Boolean) as string[]

const cloneItem = (item: DepartmentAssessmentItem): DepartmentAssessmentItem => ({
  ...item,
  clauseIds: [...item.clauseIds],
  clauseNames: [...item.clauseNames]
})

let itemStore: DepartmentAssessmentItem[] = [
  {
    id: 1,
    itemName: '文明服务落实情况',
    sortOrder: 1,
    itemType: 'fixed',
    itemTypeName: '固定分',
    fixedScore: 10,
    minScore: undefined,
    maxScore: undefined,
    clauseIds: [],
    clauseNames: [],
    description: '检查门诊、病区文明用语、首问负责及服务态度落实情况。',
    formula: ''
  },
  {
    id: 2,
    itemName: '投诉整改完成率',
    sortOrder: 2,
    itemType: 'range',
    itemTypeName: '区间分',
    fixedScore: undefined,
    minScore: 0,
    maxScore: 15,
    clauseIds: [],
    clauseNames: [],
    description: '根据投诉整改闭环及时率和整改效果综合计分。',
    formula: ''
  },
  {
    id: 3,
    itemName: '加减分综合项',
    sortOrder: 3,
    itemType: 'plusMinusWithCap',
    itemTypeName: '加减分上限',
    fixedScore: undefined,
    minScore: undefined,
    maxScore: 20,
    clauseIds: ['clause-1', 'clause-2'],
    clauseNames: resolveClauseNames(['clause-1', 'clause-2']),
    description: '按通报、投诉、表扬等加减分条款综合核算。',
    formula: ''
  },
  {
    id: 4,
    itemName: '公式核算项',
    sortOrder: 4,
    itemType: 'formula',
    itemTypeName: '公式分',
    fixedScore: undefined,
    minScore: undefined,
    maxScore: undefined,
    clauseIds: [],
    clauseNames: [],
    description: '按多个考评项结果进行综合换算。',
    formula: '[投诉整改完成率]+[文明服务落实情况]*0.5'
  }
]

export const createDefaultItemForm = (): DepartmentAssessmentItemForm => ({
  itemName: '',
  sortOrder: 0,
  itemType: undefined,
  fixedScore: undefined,
  minScore: undefined,
  maxScore: undefined,
  clauseIds: [],
  clauseNames: [],
  description: '',
  formula: ''
})

const normalizeItem = (form: DepartmentAssessmentItemForm, id: number): DepartmentAssessmentItem => {
  const clauseIds = [...(form.clauseIds || [])]
  const itemType = form.itemType as DepartmentAssessmentItemType
  return {
    id,
    itemName: form.itemName?.trim() || '',
    sortOrder: Number(form.sortOrder || 0),
    itemType,
    itemTypeName: itemTypeMap.get(itemType) || '',
    fixedScore: form.fixedScore === undefined || form.fixedScore === null ? undefined : Number(form.fixedScore),
    minScore: form.minScore === undefined || form.minScore === null ? undefined : Number(form.minScore),
    maxScore: form.maxScore === undefined || form.maxScore === null ? undefined : Number(form.maxScore),
    clauseIds,
    clauseNames: resolveClauseNames(clauseIds),
    description: form.description?.trim() || '',
    formula: form.formula?.trim() || ''
  }
}

export namespace DepartmentAssessmentItemApi {
  export const getPage = async (query: DepartmentAssessmentItemPageQuery): Promise<DepartmentAssessmentItemPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const keywords = query.keywords.trim()
    const filtered = itemStore.filter((item) => !keywords || item.itemName.includes(keywords))
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = filtered.slice(start, end).map(cloneItem)
    const total = filtered.length

    return {
      records,
      total,
      pageNum,
      pageSize,
      current: pageNum,
      size: pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize))
    }
  }

  export const getDetails = async ({ id }: { id?: number | null }) => {
    const target = itemStore.find((item) => item.id === id)
    return target ? cloneItem(target) : undefined
  }

  export const addOne = async (form: DepartmentAssessmentItemForm) => {
    const nextId = itemStore.length ? Math.max(...itemStore.map((item) => item.id)) + 1 : 1
    const nextItem = normalizeItem(form, nextId)
    itemStore = [nextItem, ...itemStore]
    return nextId
  }

  export const editOne = async (form: DepartmentAssessmentItemForm) => {
    const index = itemStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    itemStore[index] = normalizeItem(form, Number(form.id))
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    itemStore = itemStore.filter((item) => item.id !== id)
  }

  export const validateDuplicateName = async ({ id, itemName }: { id?: number; itemName: string }) => {
    return itemStore.some((item) => item.itemName === itemName && item.id !== id)
  }
}
