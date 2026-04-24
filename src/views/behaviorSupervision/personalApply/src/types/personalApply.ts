export type PersonalApplyStatus = '驳回' | '待审核' | '已通过'
export type TableRowKey = number | string

export interface PersonalApplyOption {
  label: string
  value: string
}

export interface PersonalApplyItem {
  id: number
  status: PersonalApplyStatus
  assessmentYear: string
  userName: string
  jobNumber: string
  eventDepartment: string
  reviewer: string
  score: number
  departmentSync: boolean
  departmentScore: number
  amount: number
  eventTime: string
  confirmedDate: string
  recordTime: string
  behaviorDescription: string
  eventSummary: string
  handlingResult: string
  evidenceMaterial: string
  evidenceMaterialValue?: string
  processStatus: string
}

export interface PersonalApplyForm {
  id?: number
  assessmentYear: string
  clauseId: string | null
  score: number
  reportTargetId: string | null
  eventTime: string | null
  eventDepartment: string
  eventSummary: string
  evidenceMaterials: string
}

export interface PersonalApplyQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface PersonalApplyPageData {
  records: PersonalApplyItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
