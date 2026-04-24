import type {
  ScoreEntryClauseOption,
  ScoreEntryForm,
  ScoreEntryItem,
  ScoreEntryPageData,
  ScoreEntryQuery,
  ScoreEntryStatus,
  ScoreEntryTargetOption,
} from '../types/scoreEntry'

export const assessmentYearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' },
]

export const clauseOptions: ScoreEntryClauseOption[] = [
  { label: '收到患者书面表扬', value: 'plus-1', score: 1, mode: 'plus' },
  { label: '拾金不昧并及时上交', value: 'plus-2', score: 10, mode: 'plus' },
  { label: '主动协助抢救表现突出', value: 'plus-3', score: 5, mode: 'plus' },
  { label: '服务态度投诉属实', value: 'minus-1', score: -10, mode: 'minus' },
  { label: '违反首诊负责制', value: 'minus-2', score: -5, mode: 'minus' },
  { label: '诊疗文书书写不规范', value: 'minus-3', score: -1, mode: 'minus' },
]

export const reportTargetOptions: ScoreEntryTargetOption[] = [
  { label: '张明 - 0001', value: 'user-0001', userName: '张明', jobNumber: '0001', department: '内科学系办公室' },
  { label: '钟晟 - 6421', value: 'user-6421', userName: '钟晟', jobNumber: '6421', department: '内科学系办公室' },
  { label: '尹颖超 - 6376', value: 'user-6376', userName: '尹颖超', jobNumber: '6376', department: '普通妇科' },
]

let scoreEntryStore: ScoreEntryItem[] = [
  {
    id: 1,
    status: '审核中',
    behaviorType: 'plus',
    assessmentYear: '2025',
    userName: '张明,余斌,甘超,甘海辉',
    jobNumber: '0001,0002,0003,0004,0005',
    eventDepartment: '内科学系办公室,内科学系办公室,内科学系办公室',
    reviewer: '钟晟 - 6421',
    score: 1,
    amount: 0,
    eventTime: '2025-12-18',
    behaviorDescription: '收到患者书面表扬',
    eventSummary: '门诊窗口服务获得群众来信表扬，录入后等待审核。',
    evidenceMaterial: '表扬信.pdf',
    evidenceMaterialValue: JSON.stringify([{ name: '表扬信.pdf', url: '/mock/praise.pdf', status: 'finished' }]),
    processStatus: '流程处理中，已提交至审核人。',
  },
  {
    id: 2,
    status: '驳回',
    behaviorType: 'plus',
    assessmentYear: '2025',
    userName: '张明',
    jobNumber: '0001',
    eventDepartment: '内科学系办公室',
    reviewer: '张雅婷 - 6420',
    score: 10,
    amount: 0,
    eventTime: '2025-10-01',
    behaviorDescription: '拾金不昧并及时上交',
    eventSummary: '原录入材料不完整，被退回补充说明后重新提交。',
    evidenceMaterial: '情况说明.docx',
    evidenceMaterialValue: JSON.stringify([{ name: '情况说明.docx', url: '/mock/remark.docx', status: 'finished' }]),
    processStatus: '已驳回，待修改后重新报审。',
  },
  {
    id: 3,
    status: '审核中',
    behaviorType: 'minus',
    assessmentYear: '2024',
    userName: '邱建伟,王华',
    jobNumber: '0029,0028',
    eventDepartment: '普通妇科',
    reviewer: '尹颖超 - 6376',
    score: -10,
    amount: 0,
    eventTime: '2024-12-06',
    behaviorDescription: '服务态度投诉属实',
    eventSummary: '患者投诉经核实成立，需补充完整附件后再提交审核。',
    evidenceMaterial: '投诉核查表.pdf',
    evidenceMaterialValue: JSON.stringify([{ name: '投诉核查表.pdf', url: '/mock/complaint.pdf', status: 'finished' }]),
    processStatus: '流程处理中，已提交至审核人。',
  },
]

const cloneItem = (item: ScoreEntryItem): ScoreEntryItem => ({ ...item })

const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createDefaultScoreEntryForm = (mode: 'plus' | 'minus' = 'plus'): ScoreEntryForm => ({
  behaviorType: mode,
  assessmentYear: '2026',
  clauseId: null,
  score: mode === 'minus' ? -1 : 1,
  reportTargetId: null,
  eventTime: null,
  eventDepartment: '',
  eventSummary: '',
  evidenceMaterials: '',
})

const parseUploadNames = (value?: string) => {
  if (!value) {
    return ''
  }

  try {
    const files = JSON.parse(value) as Array<{ name?: string }>
    return files.map((item) => item.name || '').filter(Boolean).join('、')
  } catch {
    return value
  }
}

const createItemFromForm = (form: ScoreEntryForm, id: number): ScoreEntryItem => {
  const clause = clauseOptions.find((item) => item.value === form.clauseId)
  const target = reportTargetOptions.find((item) => item.value === form.reportTargetId)

  return {
    id,
    status: '驳回',
    behaviorType: form.behaviorType,
    assessmentYear: form.assessmentYear,
    userName: target?.userName || '',
    jobNumber: target?.jobNumber || '',
    eventDepartment: form.eventDepartment || target?.department || '',
    reviewer: '张雅婷 - 6420',
    score: Number(form.score || 0),
    amount: 0,
    eventTime: form.eventTime || getToday(),
    behaviorDescription: clause?.label || '',
    eventSummary: form.eventSummary,
    evidenceMaterial: parseUploadNames(form.evidenceMaterials),
    evidenceMaterialValue: form.evidenceMaterials,
    processStatus: '已保存，待提交审核。',
  }
}

const filterList = (query: ScoreEntryQuery) => {
  const keyword = query.keywords.trim().toLowerCase()

  return scoreEntryStore.filter((item) => {
    if (!keyword) {
      return true
    }

    return [item.userName, item.jobNumber, item.eventDepartment, item.reviewer]
      .some((field) => field.toLowerCase().includes(keyword))
  })
}

const patchStatus = (ids: number[], status: ScoreEntryStatus, processStatus: string) => {
  scoreEntryStore = scoreEntryStore.map((item) => {
    if (!ids.includes(item.id)) {
      return item
    }

    return {
      ...item,
      status,
      processStatus,
    }
  })
}

export namespace ScoreEntryApi {
  export const getPage = async (query: ScoreEntryQuery): Promise<ScoreEntryPageData> => {
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
      pages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  export const getDetails = async ({ id }: { id: number }) => {
    const target = scoreEntryStore.find((item) => item.id === id)
    if (!target) {
      return undefined
    }

    const clause = clauseOptions.find((item) => item.label === target.behaviorDescription)
    const reportTarget = reportTargetOptions.find(
      (item) => item.userName === target.userName && item.jobNumber === target.jobNumber,
    )

    return {
      id: target.id,
      behaviorType: target.behaviorType,
      assessmentYear: target.assessmentYear,
      clauseId: clause?.value || null,
      score: target.score,
      reportTargetId: reportTarget?.value || null,
      eventTime: target.eventTime || null,
      eventDepartment: target.eventDepartment,
      eventSummary: target.eventSummary,
      evidenceMaterials: target.evidenceMaterialValue || '',
    } satisfies ScoreEntryForm
  }

  export const addOne = async (form: ScoreEntryForm) => {
    const nextId = scoreEntryStore.length ? Math.max(...scoreEntryStore.map((item) => item.id)) + 1 : 1
    scoreEntryStore = [createItemFromForm(form, nextId), ...scoreEntryStore]
    return nextId
  }

  export const editOne = async (form: ScoreEntryForm & { id: number }) => {
    const index = scoreEntryStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }

    scoreEntryStore[index] = createItemFromForm(form, form.id)
    scoreEntryStore = [...scoreEntryStore]
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    scoreEntryStore = scoreEntryStore.filter((item) => item.id !== id)
  }

  export const deleteBatch = async ({ ids }: { ids: number[] }) => {
    scoreEntryStore = scoreEntryStore.filter((item) => !ids.includes(item.id))
  }

  export const submitOne = async ({ id }: { id: number }) => {
    patchStatus([id], '审核中', '已提交审核，等待审核人处理。')
  }

  export const withdrawOne = async ({ id }: { id: number }) => {
    patchStatus([id], '驳回', '已撤回，待调整后重新提交。')
  }

  export const submitBatch = async ({ ids }: { ids: number[] }) => {
    patchStatus(ids, '审核中', '已批量提交审核，等待审核人处理。')
  }

  export const withdrawBatch = async ({ ids }: { ids: number[] }) => {
    patchStatus(ids, '驳回', '已批量撤回，待调整后重新提交。')
  }
}
