export type ScoreAuditStatus = '审核中' | '已通过' | '已驳回'
export type TableRowKey = number | string

export interface ScoreAuditItem {
  id: number
  status: ScoreAuditStatus
  assessmentYear: string
  userName: string
  jobNumber: string
  eventDepartment: string
  applicant: string
  score: number
  amount: number
  eventTime: string
  behaviorDescription: string
  eventSummary: string
  evidenceMaterial: string
  processStatus: string
}

export interface ScoreAuditQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface ScoreAuditPageData {
  records: ScoreAuditItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
