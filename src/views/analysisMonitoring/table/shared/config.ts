import type { AnalysisTableModuleConfig, AnalysisTableOption, AnalysisTableType } from './types'

export const analysisTableConfigMap: Record<AnalysisTableType, AnalysisTableModuleConfig> = {
  person: {
    type: 'person',
    title: '人员分析',
    firstColumnTitle: '姓名',
    showJobNo: true,
    showDepartment: true,
    showAmount: true
  },
  department: {
    type: 'department',
    title: '科室分析',
    firstColumnTitle: '科室',
    showPersonCount: true,
    showAmount: true
  },
  management: {
    type: 'management',
    title: '管理分析',
    firstColumnTitle: '部门'
  },
  hospital: {
    type: 'hospital',
    title: '全院分析'
  }
}

export const assessmentYearOptions: AnalysisTableOption[] = [
  { label: '2026年', value: '2026' },
  { label: '2025年', value: '2025' },
  { label: '2024年', value: '2024' }
]

export const assessmentMonthOptions: AnalysisTableOption[] = [
  { label: '1月', value: '1' },
  { label: '2月', value: '2' },
  { label: '3月', value: '3' },
  { label: '4月', value: '4' },
  { label: '5月', value: '5' },
  { label: '6月', value: '6' },
  { label: '7月', value: '7' },
  { label: '8月', value: '8' },
  { label: '9月', value: '9' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' }
]
