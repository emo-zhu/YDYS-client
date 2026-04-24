export type AnalysisTableType = 'person' | 'department' | 'management' | 'hospital'
export type TableRowKey = number | string

export interface AnalysisTableOption {
  label: string
  value: string
}

export interface AnalysisTableModuleConfig {
  type: AnalysisTableType
  title: string
  firstColumnTitle?: string
  showJobNo?: boolean
  showDepartment?: boolean
  showPersonCount?: boolean
  showAmount?: boolean
}

export interface AnalysisTableItem {
  id: number
  name?: string
  jobNo?: string
  departmentName?: string
  personCount?: number
  totalPlus: number
  totalMinus: number
  plusTotal: number
  excellentBehavior: number
  plusScore: number
  minusTotal: number
  patientComplaint: number
  rulesViolation: number
  late: number
  disciplineViolation: number
  amount?: number
}

export interface AnalysisTablePageQuery {
  keywords: string
  assessmentYear: string | null
  assessmentMonth: string | null
  pageNum: number
  pageSize: number
}

export interface AnalysisTablePageData {
  records: AnalysisTableItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
