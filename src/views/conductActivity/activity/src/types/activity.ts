export type TableRowKey = number | string
export type ActivityStatus = '已发布' | '未发布'
export type DateRangeValue = [number, number] | null

export interface ActivityItem {
  id: number
  status: ActivityStatus
  title: string
  activityStartDate: string
  activityEndDate: string
  department: string
  entryDate: string
  entryUser: string
}

export interface ActivityForm extends Partial<ActivityItem> {
  activityDateRange?: DateRangeValue
}

export interface ActivityPageQuery {
  title: string
  dateRange: DateRangeValue
  pageNum: number
  pageSize: number
}

export interface ActivityPageData {
  records: ActivityItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
