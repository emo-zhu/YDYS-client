import type {
  PersonalApplyForm,
  PersonalApplyItem,
  PersonalApplyOption,
  PersonalApplyPageData,
  PersonalApplyQuery,
  PersonalApplyStatus
} from '../types/personalApply'

interface PersonalApplyClauseConfig {
  label: string
  value: string
  score: number
}

interface PersonalApplyTargetConfig extends PersonalApplyOption {
  userName: string
  jobNumber: string
  department: string
}

export const assessmentYearOptions: PersonalApplyOption[] = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' }
]

export const clauseOptions: PersonalApplyClauseConfig[] = [
  { label: '拒收红包、购物卡等财物的', value: 'clause-1', score: 10 },
  { label: '患者表扬服务态度优秀的', value: 'clause-2', score: 8 },
  { label: '主动拾金不昧并上交的', value: 'clause-3', score: 5 }
]

export const reportTargetOptions: PersonalApplyTargetConfig[] = [
  {
    label: '张雅婷 - 6420',
    value: 'user-6420',
    userName: '张雅婷',
    jobNumber: '6420',
    department: '党委办公室'
  },
  {
    label: '周小兵 - 6361',
    value: 'user-6361',
    userName: '周小兵',
    jobNumber: '6361',
    department: '门诊部'
  },
  {
    label: '尹颖超 - 6376',
    value: 'user-6376',
    userName: '尹颖超',
    jobNumber: '6376',
    department: '护理部'
  }
]

let personalApplyStore: PersonalApplyItem[] = [
  {
    id: 1,
    status: '驳回',
    assessmentYear: '2025',
    userName: '张雅婷',
    jobNumber: '6420',
    eventDepartment: '住院部',
    reviewer: '张雅婷 - 6420',
    score: 10,
    departmentSync: false,
    departmentScore: 0,
    amount: 0,
    eventTime: '2025-07-08',
    confirmedDate: '',
    recordTime: '2025-07-24',
    behaviorDescription: '拒收红包、购物卡等财物的',
    eventSummary: '1fds1',
    handlingResult: '',
    evidenceMaterial: '',
    evidenceMaterialValue: '',
    processStatus: '已驳回，待补充佐证材料后重新提交。'
  }
]

const cloneItem = (item: PersonalApplyItem): PersonalApplyItem => ({ ...item })

const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createDefaultPersonalApplyForm = (): PersonalApplyForm => ({
  assessmentYear: '2026',
  clauseId: null,
  score: 0,
  reportTargetId: null,
  eventTime: null,
  eventDepartment: '党委办公室',
  eventSummary: '',
  evidenceMaterials: ''
})

const parseUploadNames = (value?: string) => {
  if (!value) {
    return ''
  }

  try {
    const files = JSON.parse(value) as Array<{ name?: string }>
    return files
      .map((item) => item.name || '')
      .filter(Boolean)
      .join('、')
  } catch {
    return value
  }
}

const createItemFromForm = (form: PersonalApplyForm, id: number): PersonalApplyItem => {
  const clause = clauseOptions.find((item) => item.value === form.clauseId)
  const target = reportTargetOptions.find((item) => item.value === form.reportTargetId)

  return {
    id,
    status: '驳回',
    assessmentYear: form.assessmentYear,
    userName: target?.userName || '',
    jobNumber: target?.jobNumber || '',
    eventDepartment: form.eventDepartment || target?.department || '',
    reviewer: target ? `${target.userName} - ${target.jobNumber}` : '',
    score: Number(form.score || 0),
    departmentSync: false,
    departmentScore: 0,
    amount: 0,
    eventTime: form.eventTime || '',
    confirmedDate: '',
    recordTime: getToday(),
    behaviorDescription: clause?.label || '',
    eventSummary: form.eventSummary,
    handlingResult: '',
    evidenceMaterial: parseUploadNames(form.evidenceMaterials),
    evidenceMaterialValue: form.evidenceMaterials,
    processStatus: '已保存，待提交审核。'
  }
}

const filterList = (query: PersonalApplyQuery) => {
  const keyword = query.keywords.trim().toLowerCase()

  return personalApplyStore.filter((item) => {
    if (!keyword) {
      return true
    }

    return [item.userName, item.jobNumber, item.eventDepartment, item.reviewer]
      .some((field) => field.toLowerCase().includes(keyword))
  })
}

export namespace PersonalApplyApi {
  export const getPage = async (
    query: PersonalApplyQuery
  ): Promise<PersonalApplyPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const filteredList = filterList(query)
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = filteredList.slice(start, end).map(cloneItem)
    const total = filteredList.length

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

  export const deleteBatch = async ({ ids }: { ids: number[] }) => {
    personalApplyStore = personalApplyStore.filter((item) => !ids.includes(item.id))
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    personalApplyStore = personalApplyStore.filter((item) => item.id !== id)
  }

  export const submitOne = async ({ id }: { id: number }) => {
    personalApplyStore = personalApplyStore.map((item) => {
      if (item.id !== id) {
        return item
      }

      return {
        ...item,
        status: '待审核' as PersonalApplyStatus,
        processStatus: '已重新提交，待审核人处理。'
      }
    })
  }

  export const getDetails = async ({ id }: { id: number }) => {
    const target = personalApplyStore.find((item) => item.id === id)
    if (!target) {
      return undefined
    }

    const clause = clauseOptions.find((item) => item.label === target.behaviorDescription)
    const reportTarget = reportTargetOptions.find(
      (item) => item.userName === target.userName && item.jobNumber === target.jobNumber
    )

    return {
      id: target.id,
      assessmentYear: target.assessmentYear,
      clauseId: clause?.value || null,
      score: target.score,
      reportTargetId: reportTarget?.value || null,
      eventTime: target.eventTime || null,
      eventDepartment: target.eventDepartment,
      eventSummary: target.eventSummary,
      evidenceMaterials: target.evidenceMaterialValue || ''
    } satisfies PersonalApplyForm
  }

  export const addOne = async (form: PersonalApplyForm) => {
    const nextId = personalApplyStore.length
      ? Math.max(...personalApplyStore.map((item) => item.id)) + 1
      : 1

    personalApplyStore = [createItemFromForm(form, nextId), ...personalApplyStore]
    return nextId
  }

  export const editOne = async (form: PersonalApplyForm & { id: number }) => {
    const index = personalApplyStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }

    personalApplyStore[index] = createItemFromForm(form, form.id)
    personalApplyStore = [...personalApplyStore]
  }
}
