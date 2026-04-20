export type TableRowKey = number | string
export type CommitmentStatus = '进行中' | '已结束'
export type DateRangeValue = [number, number] | null

export interface CommitmentItem {
  id: number
  status: CommitmentStatus
  reportName: string
  initiator: string
  startTime: string
  endTime: string
  targetDepartmentCount: number
  submittedDepartmentCount: number
}

export interface CommitmentForm extends Partial<CommitmentItem> {
  timeRange?: DateRangeValue
}

export interface CommitmentPageQuery {
  reportName: string
  dateRange: DateRangeValue
  pageNum: number
  pageSize: number
}

export interface CommitmentPageData {
  records: CommitmentItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
