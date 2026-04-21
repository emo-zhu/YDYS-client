import type { SelectOption } from 'naive-ui'

export type DepartmentAssessmentItemType = 'fixed' | 'plusMinus' | 'plusMinusWithCap' | 'range' | 'formula'

export interface DepartmentAssessmentItem {
  id: number
  itemName: string
  sortOrder: number
  itemType: DepartmentAssessmentItemType
  itemTypeName: string
  fixedScore?: number
  minScore?: number
  maxScore?: number
  clauseIds: string[]
  clauseNames: string[]
  description: string
  formula?: string
}

export interface DepartmentAssessmentItemForm extends Partial<DepartmentAssessmentItem> {}

export interface DepartmentAssessmentItemPageQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface DepartmentAssessmentItemPageData {
  records: DepartmentAssessmentItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}

export interface DepartmentAssessmentItemOption extends SelectOption {
  label: string
  value: string
}
