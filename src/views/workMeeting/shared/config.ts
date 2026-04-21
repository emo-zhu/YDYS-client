import type {
  WorkMeetingItem,
  WorkMeetingModuleConfig,
  WorkMeetingOption,
  WorkMeetingStatus,
  WorkMeetingType
} from './types'

const assessmentYearOptions: WorkMeetingOption[] = [
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' }
]

const departmentOptions: WorkMeetingOption[] = [
  { label: '党委办公室', value: '党委办公室' },
  { label: '医务处', value: '医务处' },
  { label: '护理部', value: '护理部' },
  { label: '纪检监察室', value: '纪检监察室' }
]

const monthOptions: WorkMeetingOption[] = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  value: `${index + 1}月`
}))

const quarterOptions: WorkMeetingOption[] = [
  { label: '第一季度', value: '第一季度' },
  { label: '第二季度', value: '第二季度' },
  { label: '第三季度', value: '第三季度' },
  { label: '第四季度', value: '第四季度' }
]

const semiAnnualOptions: WorkMeetingOption[] = [
  { label: '上半年', value: '上半年' },
  { label: '下半年', value: '下半年' }
]

const annualOptions: WorkMeetingOption[] = [{ label: '全年', value: '全年' }]

export const workMeetingConfigMap: Record<WorkMeetingType, WorkMeetingModuleConfig> = {
  monthly: {
    type: 'monthly',
    title: '月度工作会议',
    routePath: '/workMeeting/monthly',
    defaultReporterName: '张雅婷',
    defaultReporterJobNo: '6420',
    periodLabel: '考核月度',
    periodOptions: monthOptions
  },
  quarterly: {
    type: 'quarterly',
    title: '季度工作会议',
    routePath: '/workMeeting/quarterly',
    defaultReporterName: '周小兵',
    defaultReporterJobNo: '6361',
    periodLabel: '考核季度',
    periodOptions: quarterOptions
  },
  semiAnnual: {
    type: 'semiAnnual',
    title: '半年度工作会议',
    routePath: '/workMeeting/semiAnnual',
    defaultReporterName: '尹颖超',
    defaultReporterJobNo: '6376',
    periodLabel: '考核周期',
    periodOptions: semiAnnualOptions
  },
  annual: {
    type: 'annual',
    title: '年度工作会议',
    routePath: '/workMeeting/annual',
    defaultReporterName: '王雪梅',
    defaultReporterJobNo: '6418',
    periodLabel: '考核周期',
    periodOptions: annualOptions
  }
}

export const workMeetingStatusOptions = [
  { label: '完成', value: '完成' },
  { label: '待填报', value: '待填报' }
]

export const workMeetingAssessmentYearOptions = assessmentYearOptions
export const workMeetingDepartmentOptions = departmentOptions

const createRow = (
  config: WorkMeetingModuleConfig,
  item: {
    id: number
    status: WorkMeetingStatus
    assessmentYear: string
    assessmentPeriod: string
    departmentName: string
    reportTime: string
    attachmentName: string
    remarks: string
  }
): WorkMeetingItem => ({
  ...item,
  reporterName: config.defaultReporterName,
  reporterJobNo: config.defaultReporterJobNo,
  attachmentUrl: item.attachmentName
})

export const createInitialMeetingStore = (type: WorkMeetingType): WorkMeetingItem[] => {
  const config = workMeetingConfigMap[type]

  if (type === 'monthly') {
    return [
      createRow(config, {
        id: 1,
        status: '完成',
        assessmentYear: '2025',
        assessmentPeriod: '2月',
        departmentName: '党委办公室',
        reportTime: '2025-08-20',
        attachmentName: 'bd457e0624d990b0360ab4c91eed',
        remarks: '已完成月度行风工作会议材料填报。'
      }),
      createRow(config, {
        id: 2,
        status: '完成',
        assessmentYear: '2025',
        assessmentPeriod: '3月',
        departmentName: '党委办公室',
        reportTime: '2025-08-20',
        attachmentName: 'aabadb7a1a64c0909d5680243d22',
        remarks: '已完成月度会议纪要与附件上传。'
      })
    ]
  }

  return [
    createRow(config, {
      id: 1,
      status: '完成',
      assessmentYear: '2025',
      assessmentPeriod: config.periodOptions[0]?.value || '',
      departmentName: '医务处',
      reportTime: '2025-08-20',
      attachmentName: `${type}-meeting-report-1`,
      remarks: `已完成${config.title}附件上传。`
    }),
    createRow(config, {
      id: 2,
      status: '待填报',
      assessmentYear: '2025',
      assessmentPeriod: config.periodOptions[0]?.value || '',
      departmentName: '纪检监察室',
      reportTime: '2025-08-22',
      attachmentName: `${type}-meeting-report-2`,
      remarks: `待补充${config.title}填报内容。`
    })
  ]
}
