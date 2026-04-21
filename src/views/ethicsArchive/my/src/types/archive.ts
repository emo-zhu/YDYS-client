export type EthicsArchiveStatus = '已归档' | '待完善' | '审核中'

export type EthicsArchiveLevel = '优秀' | '良好' | '合格'

export interface EthicsArchiveItem {
  id: number
  archiveYear: string
  archiveCode: string
  userName: string
  positionType: string
  departmentName: string
  dailyScore: number
  personalScore: number
  departmentScore: number
  hospitalScore: number
  assessmentLevel: string
  downloadFileName: string
  highlights: string
  improvementPlan: string
  positionName?: string
  archiveStatus?: EthicsArchiveStatus
  score?: number
  rewardCount?: number
  complaintCount?: number
  updatedAt?: string
}

export interface EthicsArchiveForm extends Partial<EthicsArchiveItem> {}

export interface EthicsArchiveDetail extends EthicsArchiveItem {}

export interface EthicsArchivePageQuery {
  keywords: string
  archiveYear: string | null
  pageNum: number
  pageSize: number
}

export interface EthicsArchivePageData {
  records: EthicsArchiveItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
