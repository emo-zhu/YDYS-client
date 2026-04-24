export type AnnualRuleType = 'table' | 'unit' | 'grade'
export type TableRowKey = number | string

export interface AnnualRulePageQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface AnnualRulePageData<T> {
  records: T[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}

export interface AssessmentTableItem {
  id: number
  name: string
  createTime: string
  updateTime: string
}

export interface AssessmentTableForm {
  id?: number
  name: string
}

export interface AssessmentUnitItem {
  id: number
  unitName: string
  departmentType: string
  departmentLeader: string
  branchSecretary: string
  otherMembers: string
  auditUser: string
  includedDepartments: string
}

export interface AssessmentUnitForm {
  id?: number
  unitName: string
  departmentType: string | null
  departmentLeader: string | null
  branchSecretary: string | null
  otherMembers: string[]
  auditUser: string | null
  includedDepartments: string[]
}

export interface AssessmentGradeItem {
  id: number
  levelName: string
  maxScore: number
  minScore: number
  alias: string
  comment: string
  expanded?: boolean
}

export interface GradeRatioItem {
  label: string
  value: string
}

export type AnnualRuleItem = AssessmentTableItem | AssessmentUnitItem | AssessmentGradeItem
