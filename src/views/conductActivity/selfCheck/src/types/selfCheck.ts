export type TableRowKey = number | string
export type SelfCheckStatus = '进行中' | '已结束'
export type DateRangeValue = [number, number] | null

export interface SelfCheckItem {
  id: number
  status: SelfCheckStatus
  reportName: string
  initiator: string
  startTime: string
  endTime: string
  targetDepartmentCount: number
  submittedDepartmentCount: number
}

export interface SelfCheckForm extends Partial<SelfCheckItem> {
  timeRange?: DateRangeValue
}

export interface SelfCheckPageQuery {
  reportName: string
  dateRange: DateRangeValue
  pageNum: number
  pageSize: number
}

export interface SelfCheckPageData {
  records: SelfCheckItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
