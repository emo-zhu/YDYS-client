import type {
  StaffArchiveDetail,
  StaffArchiveForm,
  StaffArchiveItem,
  StaffArchivePageData,
  StaffArchivePageQuery,
} from '../types/archive'

const cloneArchiveItem = (item: StaffArchiveItem): StaffArchiveItem => ({
  ...item,
  actions: item.actions.map((action) => ({ ...action })),
})

let archiveStore: StaffArchiveItem[] = [
  {
    id: 1,
    name: '敖奎-3821',
    staffCode: '3821',
    staffName: '敖奎-3821',
    staffNo: '3821',
    gender: '女',
    positionType: '卫技（医）',
    positionName: '卫技（医）',
    entryDate: '2011-07-27',
    departmentName: '心血管内科',
    staffStatus: '在职人员',
    archiveYear: '2025',
    archiveCode: 'EDA-2025-001',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    score: 89,
    rewardCount: 0,
    complaintCount: 0,
    updatedAt: '2026-04-21 15:00:00',
    highlights: '档案资料齐全。',
    improvementPlan: '继续规范过程材料归档。',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 2,
    name: '敖文辉-5491',
    staffCode: '5491',
    staffName: '敖文辉-5491',
    staffNo: '5491',
    gender: '男',
    positionType: '工勤岗',
    positionName: '工勤岗',
    entryDate: '2018-07-17',
    departmentName: '感染科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 3,
    name: '敖德东-1807',
    staffCode: '1807',
    staffName: '敖德东-1807',
    staffNo: '1807',
    gender: '男',
    positionType: '卫技（护）',
    positionName: '卫技（护）',
    entryDate: '2014-07-02',
    departmentName: '胃肠外科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 4,
    name: '敖峰瑜-6091',
    staffCode: '6091',
    staffName: '敖峰瑜-6091',
    staffNo: '6091',
    gender: '男',
    positionType: '工勤岗',
    positionName: '工勤岗',
    entryDate: '2018-03-27',
    departmentName: '口腔科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 5,
    name: '敖锋-6398',
    staffCode: '6398',
    staffName: '敖锋-6398',
    staffNo: '6398',
    gender: '男',
    positionType: '卫技（护）',
    positionName: '卫技（护）',
    entryDate: '2005-09-01',
    departmentName: '护理部办公室',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 6,
    name: '敖凤菊-3615',
    staffCode: '3615',
    staffName: '敖凤菊-3615',
    staffNo: '3615',
    gender: '女',
    positionType: '卫技（护）',
    positionName: '卫技（护）',
    entryDate: '2021-07-01',
    departmentName: '生殖医学科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 7,
    name: '敖凤云-6064',
    staffCode: '6064',
    staffName: '敖凤云-6064',
    staffNo: '6064',
    gender: '女',
    positionType: '工勤岗',
    positionName: '工勤岗',
    entryDate: '2018-01-01',
    departmentName: '口腔科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 8,
    name: '敖光绪-2530',
    staffCode: '2530',
    staffName: '敖光绪-2530',
    staffNo: '2530',
    gender: '男',
    positionType: '卫技（护）',
    positionName: '卫技（护）',
    entryDate: '2013-01-01',
    departmentName: '神经外科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 9,
    name: '敖红燕-3801',
    staffCode: '3801',
    staffName: '敖红燕-3801',
    staffNo: '3801',
    gender: '女',
    positionType: '卫技（护）',
    positionName: '卫技（护）',
    entryDate: '2015-02-01',
    departmentName: '妇产科门诊',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
  {
    id: 10,
    name: '敖辉-3480',
    staffCode: '3480',
    staffName: '敖辉-3480',
    staffNo: '3480',
    gender: '男',
    positionType: '卫技（护）',
    positionName: '卫技（护）',
    entryDate: '2014-11-03',
    departmentName: '妇科肿瘤科',
    staffStatus: '在职人员',
    archiveStatus: '已归档',
    assessmentLevel: '良好',
    actions: [
      { key: 'daily', label: '日常考评记录' },
      { key: 'annual', label: '年度考评记录' },
      { key: 'commitment', label: '承诺书' },
      { key: 'exam', label: '考试记录' },
      { key: 'course', label: '课程学习记录' },
    ],
  },
]

export const createDefaultArchiveForm = (): StaffArchiveForm => ({
  name: '',
  staffCode: '',
  gender: '',
  positionType: '',
  positionName: '',
  entryDate: '',
  departmentName: '',
  staffStatus: '在职人员',
  archiveYear: '',
  archiveCode: '',
  staffName: '',
  staffNo: '',
  archiveStatus: '已归档',
  assessmentLevel: '良好',
  score: 0,
  rewardCount: 0,
  complaintCount: 0,
  updatedAt: '',
  highlights: '',
  improvementPlan: '',
  actions: [],
})

export namespace StaffArchiveApi {
  export const getPage = async (
    query: StaffArchivePageQuery,
  ): Promise<StaffArchivePageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const keywords = query.keywords.trim()
    const filtered = archiveStore.filter((item) => {
      const matchKeywords =
        !keywords ||
        item.name.includes(keywords) ||
        item.staffCode.includes(keywords)
      const matchStatus = !query.staffStatus || item.staffStatus === query.staffStatus
      return matchKeywords && matchStatus
    })
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = filtered.slice(start, end).map(cloneArchiveItem)
    const total = filtered.length

    return {
      records,
      total,
      pageNum,
      pageSize,
      current: pageNum,
      size: pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  export const getDetails = async ({
    id,
  }: {
    id?: number | null
  }): Promise<StaffArchiveDetail | undefined> => {
    const target = archiveStore.find((item) => item.id === id)
    return target ? cloneArchiveItem(target) : undefined
  }

  export const addOne = async (_form: StaffArchiveForm) => {
    return archiveStore[0]?.id || 1
  }

  export const editOne = async (_form: StaffArchiveForm) => {}

  export const deleteOne = async ({ id }: { id: number }) => {
    archiveStore = archiveStore.filter((item) => item.id !== id)
  }

  export const validateDuplicateCode = async ({
    id,
    archiveCode,
  }: {
    id?: number
    archiveCode: string
  }) => {
    return archiveStore.some(
      (item) => item.staffCode === archiveCode && item.id !== id,
    )
  }
}
