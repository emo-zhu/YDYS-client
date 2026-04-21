export type WorkMeetingType = 'monthly' | 'quarterly' | 'semiAnnual' | 'annual'
export type WorkMeetingStatus = '完成' | '待填报'
export type TableRowKey = number | string

export interface WorkMeetingOption {
  label: string
  value: string
}

export interface WorkMeetingModuleConfig {
  type: WorkMeetingType
  title: string
  routePath: string
  defaultReporterName: string
  defaultReporterJobNo: string
  periodLabel?: string
  periodOptions: WorkMeetingOption[]
}

export interface WorkMeetingItem {
  id: number
  status: WorkMeetingStatus
  assessmentYear: string
  assessmentPeriod: string
  departmentName: string
  reporterName: string
  reporterJobNo: string
  reportTime: string
  attachmentName: string
  attachmentUrl: string
  remarks: string
}

export interface WorkMeetingForm extends Partial<WorkMeetingItem> {}

export interface WorkMeetingPageQuery {
  assessmentYear: string | null
  assessmentPeriod: string | null
  departmentName: string | null
  pageNum: number
  pageSize: number
}

export interface WorkMeetingPageData {
  records: WorkMeetingItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
