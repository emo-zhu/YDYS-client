export type ScoreQueryTabValue = 'mine' | 'hospital'
export type ScoreTypeValue = 'all' | 'plus' | 'minus'
export type ScoreQueryTargetValue = 'all' | 'person' | 'department'
export type TableRowKey = number | string
export type DateRangeValue = [number, number] | null

export interface ScoreQueryOption<T = string> {
  label: string
  value: T
}

export interface ScoreQueryMineItem {
  id: number
  assessmentYear: string
  userName: string
  jobNumber: string
  eventDepartment: string
  score: number
  amount: number
  eventTime: string
  departmentSync: boolean
  departmentScore: number
  confirmedDate: string
  recordTime: string
  behaviorDescription: string
  eventSummary: string
  handlingResult: string
  evidenceMaterial: string
}

export interface ScoreQueryHospitalItem {
  id: number
  assessmentYear: string
  scoreType: Exclude<ScoreTypeValue, 'all'>
  targetType: Exclude<ScoreQueryTargetValue, 'all'>
  clauseId: string
  userName: string
  jobNumber: string
  eventDepartment: string
  applicant: string
  reviewer: string
  score: number
  amount: number
  eventTime: string
  recordTime: string
  behaviorDescription: string
  eventSummary: string
  confirmedDate: string
  handlingResult: string
  evidenceMaterial: string
  evidenceMaterialValue?: string
  processStatus: string
}

export interface ScoreQuerySupplementForm {
  id?: number
  targetType: 'person' | 'department'
  reportTargetName: string
  assessmentYear: string
  clauseId: string | null
  amount: number
  score: number
  reviewerName: string
  eventTime: string | null
  eventDepartment: string
  eventSummary: string
  confirmedDate: string | null
  handlingResult: string
  evidenceMaterials: string
  recordTime: string | null
  recorderName: string
}

export interface ScoreQueryMineQuery {
  pageNum: number
  pageSize: number
}

export interface ScoreQueryHospitalQuery {
  assessmentYear: string | null
  scoreType: ScoreTypeValue | null
  assessmentMonth: string | null
  recordDateRange: DateRangeValue
  targetType: ScoreQueryTargetValue | null
  clauseId: string | null
  keywords: string
  pageNum: number
  pageSize: number
}

export interface ScoreQueryPageData<T> {
  records: T[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}

export interface ScoreQueryHospitalSummary {
  amount: number
  plusScore: number
  minusScore: number
}
