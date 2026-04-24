export type ScoreEntryStatus = '审核中' | '驳回'
export type ScoreEntryMode = 'plus' | 'minus'
export type TableRowKey = number | string

export interface ScoreEntryOption {
  label: string
  value: string
}

export interface ScoreEntryClauseOption extends ScoreEntryOption {
  score: number
  mode: ScoreEntryMode
}

export interface ScoreEntryTargetOption extends ScoreEntryOption {
  userName: string
  jobNumber: string
  department: string
}

export interface ScoreEntryItem {
  id: number
  status: ScoreEntryStatus
  behaviorType: ScoreEntryMode
  assessmentYear: string
  userName: string
  jobNumber: string
  eventDepartment: string
  reviewer: string
  score: number
  amount: number
  eventTime: string
  behaviorDescription: string
  eventSummary: string
  evidenceMaterial: string
  evidenceMaterialValue?: string
  processStatus: string
}

export interface ScoreEntryForm {
  id?: number
  behaviorType: ScoreEntryMode
  assessmentYear: string
  clauseId: string | null
  score: number
  reportTargetId: string | null
  eventTime: string | null
  eventDepartment: string
  eventSummary: string
  evidenceMaterials: string
}

export interface ScoreEntryQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface ScoreEntryPageData {
  records: ScoreEntryItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
