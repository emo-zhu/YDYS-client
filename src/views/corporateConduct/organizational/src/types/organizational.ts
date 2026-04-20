export type EditSource = 'leadership' | 'office'
export type TableRowKey = string | number

export interface BasicRow {
  id: string
  label: string
  value: string
}

export interface DepartmentRow {
  id: string
  name: string
  leader: string
  secretary: string
  members: string
  isIncludeRow?: boolean
  children?: DepartmentRow[]
}

export interface SummaryForm {
  label: string
  value: string
}

export interface DepartmentForm {
  leader: string
  secretary: string
  members: string
}

export interface DepartmentPageQuery {
  pageNum: number
  pageSize: number
}

export interface DepartmentPageData {
  records: DepartmentRow[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
