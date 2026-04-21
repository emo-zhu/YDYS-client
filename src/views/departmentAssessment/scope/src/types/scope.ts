import type { TreeSelectOption } from 'naive-ui'

export interface DepartmentAssessmentScopeItem {
  id: number
  groupName: string
  sortOrder: number
  departmentIds: string[]
  departmentNames: string[]
}

export interface DepartmentAssessmentScopeForm extends Partial<DepartmentAssessmentScopeItem> {}

export interface DepartmentAssessmentScopePageQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface DepartmentAssessmentScopePageData {
  records: DepartmentAssessmentScopeItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}

export interface DepartmentOption extends TreeSelectOption {
  label: string
  key: string
  value: string
  children?: DepartmentOption[]
}
