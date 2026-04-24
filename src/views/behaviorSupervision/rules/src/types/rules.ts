export type BehaviorRuleTabValue = 'plus' | 'minus'
export type BehaviorRuleType = 'category' | 'detail'
export type BehaviorRuleTargetType = 'person' | 'department'
export type BehaviorRuleScoreType = 'fixed' | 'range'

export interface BehaviorRuleItem {
  id: number
  parentRuleId?: number | null
  ruleName: string
  ruleAttribute: string
  creator: string
  reviewer: string
  fixedScore: number
  minScore: number
  maxScore: number
  ruleTarget: string
  syncMinusScore?: boolean
  departmentSync?: boolean
  effectiveDate?: string
  description: string
  applicationScope: string
}

export interface BehaviorRuleDetail extends BehaviorRuleItem {
  ruleTypeName: string
  scoreTypeName: string
  limitAccumulated: boolean
  allowDepartmentReport: boolean
  fillAmount: boolean
}

export interface BehaviorRuleOption<T = string> {
  label: string
  value: T
}

export interface BehaviorRuleUserOption extends BehaviorRuleOption {
  department?: string
}

export interface BehaviorRuleForm {
  id?: number
  ruleType: BehaviorRuleType
  targetType: BehaviorRuleTargetType
  ruleName: string
  parentRuleId: number | null
  ruleAttribute: string | null
  departmentSync: boolean
  creatorId: string | null
  reviewerId: string | null
  scoreType: BehaviorRuleScoreType
  fixedScore: number
  minScore: number | null
  maxScore: number | null
  limitAccumulated: boolean
  allowDepartmentReport: boolean
  fillAmount: boolean
  effectiveDate: string | null
}
