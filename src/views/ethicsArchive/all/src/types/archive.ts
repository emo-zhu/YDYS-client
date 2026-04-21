export type StaffArchiveStatus = '在职人员' | '离职人员' | '返聘人员'

export type StaffArchiveLevel = '优秀' | '良好' | '合格'

export interface StaffArchiveRecord {
  id: number
  name: string
  staffCode: string
  gender: string
  positionType: string
  entryDate: string
  departmentName: string
  staffStatus: string
}

export interface StaffArchiveActionItem {
  key: string
  label: string
}

export interface StaffArchiveItem extends StaffArchiveRecord {
  actions: StaffArchiveActionItem[]
  archiveYear?: string
  archiveCode?: string
  staffName?: string
  staffNo?: string
  positionName?: string
  archiveStatus?: string
  assessmentLevel?: StaffArchiveLevel | string
  score?: number
  rewardCount?: number
  complaintCount?: number
  updatedAt?: string
  highlights?: string
  improvementPlan?: string
}

export interface StaffArchiveForm extends Partial<StaffArchiveItem> {}

export interface StaffArchiveDetail extends StaffArchiveItem {}

export interface StaffArchivePageQuery {
  keywords: string
  staffStatus: StaffArchiveStatus | null
  pageNum: number
  pageSize: number
}

export interface StaffArchivePageData {
  records: StaffArchiveItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
