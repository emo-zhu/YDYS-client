import { assessmentGradeStore, assessmentTableStore, assessmentUnitStore } from './config'
import type {
  AnnualRulePageData,
  AnnualRulePageQuery,
  AnnualRuleType,
  AssessmentGradeItem,
  AssessmentTableItem,
  AssessmentUnitItem
} from './types'

const clone = <T extends object>(item: T): T => ({ ...item })

const getSource = (type: AnnualRuleType) => {
  if (type === 'table') {
    return assessmentTableStore
  }
  if (type === 'unit') {
    return assessmentUnitStore
  }
  return assessmentGradeStore
}

const matchKeywords = (
  type: AnnualRuleType,
  item: AssessmentTableItem | AssessmentUnitItem | AssessmentGradeItem,
  keywords: string
) => {
  if (!keywords) {
    return true
  }

  const normalizedKeywords = keywords.toLowerCase()
  if (type === 'table') {
    const tableItem = item as AssessmentTableItem
    return tableItem.name.toLowerCase().includes(normalizedKeywords)
  }
  if (type === 'unit') {
    const unitItem = item as AssessmentUnitItem
    return [
      unitItem.unitName,
      unitItem.departmentType,
      unitItem.departmentLeader,
      unitItem.branchSecretary,
      unitItem.otherMembers,
      unitItem.auditUser,
      unitItem.includedDepartments
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedKeywords)
  }

  const gradeItem = item as AssessmentGradeItem
  return [gradeItem.levelName, gradeItem.alias, gradeItem.comment]
    .join(' ')
    .toLowerCase()
    .includes(normalizedKeywords)
}

export namespace AnnualRuleApi {
  export const getPage = async <T extends object>(
    type: AnnualRuleType,
    query: AnnualRulePageQuery
  ): Promise<AnnualRulePageData<T>> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const keywords = (query.keywords || '').trim()
    const filteredList = getSource(type).filter((item) => matchKeywords(type, item, keywords))
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = filteredList.slice(start, end).map(clone) as T[]

    return {
      records,
      total: filteredList.length,
      pageNum,
      pageSize,
      current: pageNum,
      size: pageSize,
      pages: Math.max(1, Math.ceil(filteredList.length / pageSize))
    }
  }
}
