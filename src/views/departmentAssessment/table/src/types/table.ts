export interface DepartmentAssessmentTableRuleItem {
  id: number
  sort: number
  itemName: string
  itemType: string
  itemTypeName: string
  fixedScore?: number
  minScore?: number
  maxScore?: number
  description: string
  formula?: string
}

export interface DepartmentAssessmentTableItem {
  id: number
  tableName: string
  updatedAt: string
  itemCount: number
  items: DepartmentAssessmentTableRuleItem[]
}

export interface DepartmentAssessmentTableForm extends Partial<DepartmentAssessmentTableItem> {}

export interface DepartmentAssessmentRuleTableDetail extends DepartmentAssessmentTableItem {}

export interface DepartmentAssessmentTablePageQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface DepartmentAssessmentTablePageData {
  records: DepartmentAssessmentTableItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
