import type {
  AnalysisTableItem,
  AnalysisTablePageData,
  AnalysisTablePageQuery,
  AnalysisTableType
} from './types'

const analysisTableStore: Record<AnalysisTableType, AnalysisTableItem[]> = {
  person: [
    {
      id: 1,
      name: '王弘炜',
      jobNo: '5669',
      departmentName: '神经科',
      totalPlus: 11,
      totalMinus: 0,
      plusTotal: 11,
      excellentBehavior: 11,
      plusScore: 0,
      minusTotal: 0,
      patientComplaint: 0,
      rulesViolation: 0,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    },
    {
      id: 2,
      name: '安蓓',
      jobNo: '3821',
      departmentName: '内科学系',
      totalPlus: 10,
      totalMinus: 0,
      plusTotal: 10,
      excellentBehavior: 10,
      plusScore: 0,
      minusTotal: 0,
      patientComplaint: 0,
      rulesViolation: 0,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    },
    {
      id: 3,
      name: '梁红艳',
      jobNo: '3110',
      departmentName: '整形美容外科',
      totalPlus: 1,
      totalMinus: 0,
      plusTotal: 1,
      excellentBehavior: 0,
      plusScore: 1,
      minusTotal: 0,
      patientComplaint: 0,
      rulesViolation: 0,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    },
    {
      id: 4,
      name: '刘梦琪',
      jobNo: '1234',
      departmentName: '外科学系办...',
      totalPlus: -15,
      totalMinus: -15,
      plusTotal: 0,
      excellentBehavior: 0,
      plusScore: 0,
      minusTotal: -15,
      patientComplaint: 0,
      rulesViolation: 15,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    }
  ],
  department: [
    {
      id: 1,
      departmentName: '本院-神经科【精神科】',
      personCount: 260,
      totalPlus: 11,
      totalMinus: 0,
      plusTotal: 2,
      excellentBehavior: 2,
      plusScore: 0,
      minusTotal: 0,
      patientComplaint: 0,
      rulesViolation: 0,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    },
    {
      id: 2,
      departmentName: '本院-外科学系',
      personCount: 1867,
      totalPlus: 1,
      totalMinus: 0,
      plusTotal: 1,
      excellentBehavior: 0,
      plusScore: 1,
      minusTotal: 0,
      patientComplaint: 0,
      rulesViolation: 0,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    },
    {
      id: 3,
      departmentName: '本院-内科学系',
      personCount: 1245,
      totalPlus: 10,
      totalMinus: -15,
      plusTotal: 1,
      excellentBehavior: 1,
      plusScore: 0,
      minusTotal: -1,
      patientComplaint: 0,
      rulesViolation: 1,
      late: 0,
      disciplineViolation: 0,
      amount: 0
    }
  ],
  management: [
    {
      id: 1,
      departmentName: '党委办公室',
      totalPlus: 11,
      totalMinus: 0,
      plusTotal: 2,
      excellentBehavior: 1,
      plusScore: 1,
      minusTotal: 0,
      patientComplaint: 0,
      rulesViolation: 0,
      late: 0,
      disciplineViolation: 0
    },
    {
      id: 2,
      departmentName: '神经科',
      totalPlus: 11,
      totalMinus: -15,
      plusTotal: 2,
      excellentBehavior: 2,
      plusScore: 0,
      minusTotal: -1,
      patientComplaint: 0,
      rulesViolation: 1,
      late: 0,
      disciplineViolation: 0
    }
  ],
  hospital: [
    {
      id: 1,
      totalPlus: 22,
      totalMinus: -15,
      plusTotal: 4,
      excellentBehavior: 3,
      plusScore: 1,
      minusTotal: -1,
      patientComplaint: 0,
      rulesViolation: 1,
      late: 0,
      disciplineViolation: 0
    }
  ]
}

const createPageData = (
  records: AnalysisTableItem[],
  query: AnalysisTablePageQuery
): AnalysisTablePageData => {
  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const total = records.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(pageNum, pages)
  const start = (current - 1) * pageSize

  return {
    records: records.slice(start, start + pageSize),
    total,
    pageNum: current,
    pageSize,
    current,
    size: pageSize,
    pages
  }
}

export const AnalysisTableApi = {
  async getPage(type: AnalysisTableType, query: AnalysisTablePageQuery) {
    const keywords = query.keywords.trim()
    const records = keywords
      ? analysisTableStore[type].filter((item) =>
          [item.name, item.jobNo, item.departmentName]
            .filter(Boolean)
            .some((value) => String(value).includes(keywords))
        )
      : analysisTableStore[type]

    return createPageData(records, query)
  },
  async getList(type: AnalysisTableType) {
    return [...analysisTableStore[type]]
  }
}
