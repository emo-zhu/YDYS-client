import type { AssessmentGradeItem, AssessmentTableItem, AssessmentUnitItem, GradeRatioItem } from './types'

export const assessmentTableStore: AssessmentTableItem[] = [
  {
    id: 1,
    name: 'ddd',
    createTime: '2026-04-24 08:48:00',
    updateTime: '2026-04-24 08:48:00'
  },
  {
    id: 2,
    name: '年度医德考评表',
    createTime: '2025-02-18 10:48:00',
    updateTime: '2025-02-18 10:48:00'
  }
]

export const assessmentUnitStore: AssessmentUnitItem[] = [
  {
    id: 1,
    unitName: '人事处',
    departmentType: '医技',
    departmentLeader: '敖辉',
    branchSecretary: '',
    otherMembers: '',
    auditUser: '',
    includedDepartments: '人事处,院长办公室,人事处病区'
  },
  {
    id: 2,
    unitName: '财务部',
    departmentType: '行政',
    departmentLeader: '张雅婷',
    branchSecretary: '',
    otherMembers: '',
    auditUser: '',
    includedDepartments: '财务处,内科学系办公室,心血管内科一病区,儿科学系,儿科学系未分科'
  },
  {
    id: 3,
    unitName: '后勤处',
    departmentType: '后勤',
    departmentLeader: '毕亚雯',
    branchSecretary: '周路',
    otherMembers: '周子佩',
    auditUser: '',
    includedDepartments: '后勤处'
  },
  {
    id: 4,
    unitName: '医务处',
    departmentType: '医管',
    departmentLeader: '周小兵',
    branchSecretary: '顾锦丽',
    otherMembers: '王娇',
    auditUser: '',
    includedDepartments: '医务处,护理部'
  },
  {
    id: 5,
    unitName: '消化内科',
    departmentType: '临床',
    departmentLeader: '朱云',
    branchSecretary: '朱志宏',
    otherMembers: '朱若愚',
    auditUser: '内科学系党总支-尹海云',
    includedDepartments: '消化内科,内科门诊'
  },
  {
    id: 6,
    unitName: '心血管内科',
    departmentType: '临床',
    departmentLeader: '王剑清',
    branchSecretary: '关建',
    otherMembers: '王华,邹建伟',
    auditUser: '内科学系党总支-尹海云',
    includedDepartments: '心血管内科'
  }
]

export const assessmentGradeStore: AssessmentGradeItem[] = [
  {
    id: 1,
    levelName: '优秀',
    maxScore: 120,
    minScore: 90,
    alias: '',
    comment: '该同志医德高尚、医疗技术水平精湛，获得患者普遍好评，起到了表率作用。',
    expanded: true
  },
  {
    id: 2,
    levelName: '良好',
    maxScore: 89.99,
    minScore: 80,
    alias: '取消评优资格',
    comment: '该同志具有良好的执业道德，工作认真敬业，业务水平高。',
    expanded: true
  },
  {
    id: 3,
    levelName: '一般',
    maxScore: 79.99,
    minScore: 60,
    alias: '',
    comment: '该同志能够遵守医德规范，基本完成岗位工作要求。',
    expanded: true
  },
  {
    id: 4,
    levelName: '较差',
    maxScore: 59.99,
    minScore: 0,
    alias: '一票否决',
    comment: '该同志医德表现较差，需限期整改并加强教育管理。',
    expanded: true
  }
]

export const gradeRatioList: GradeRatioItem[] = [
  { label: '临床', value: '20%' },
  { label: '医技', value: '18%' },
  { label: '医管', value: '15%' },
  { label: '行政', value: '10%' },
  { label: '后勤', value: '10%' }
]

export const modelWorkerGradeRatioList: GradeRatioItem[] = [
  { label: '临床', value: '5%' },
  { label: '医技', value: '5%' },
  { label: '医管', value: '5%' },
  { label: '行政', value: '1%' },
  { label: '后勤', value: '1%' }
]
