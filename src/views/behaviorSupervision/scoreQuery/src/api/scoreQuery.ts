import type {
  ScoreQueryHospitalItem,
  ScoreQueryHospitalQuery,
  ScoreQueryHospitalSummary,
  ScoreQueryMineItem,
  ScoreQueryMineQuery,
  ScoreQueryOption,
  ScoreQueryPageData,
  ScoreQuerySupplementForm,
  ScoreQueryTargetValue,
  ScoreTypeValue,
} from '../types/scoreQuery'

export const assessmentYearOptions: ScoreQueryOption[] = [
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
  { label: '2026年', value: '2026' },
]

export const scoreTypeOptions: ScoreQueryOption<ScoreTypeValue>[] = [
  { label: '全部', value: 'all' },
  { label: '加分规则', value: 'plus' },
  { label: '减分规则', value: 'minus' },
]

export const assessmentMonthOptions: ScoreQueryOption[] = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  value: String(index + 1).padStart(2, '0'),
}))

export const targetTypeOptions: ScoreQueryOption<ScoreQueryTargetValue>[] = [
  { label: '全部', value: 'all' },
  { label: '人员', value: 'person' },
  { label: '科室', value: 'department' },
]

export const supplementClauseOptions = [
  { label: '加分 / 收到患者表扬信、表扬对象为个人的', value: 'plus-praise', score: 1, amount: 0 },
  { label: '加分 / 拾金不昧并及时上交', value: 'plus-honest', score: 10, amount: 0 },
  { label: '减分 / 服务投诉核实属实', value: 'minus-complaint', score: -15, amount: 0 },
]

let mineStore: ScoreQueryMineItem[] = [
  {
    id: 1,
    assessmentYear: '2025',
    userName: '张雅婷',
    jobNumber: '6420',
    eventDepartment: '妇产科办公室',
    score: 10,
    amount: 0,
    eventTime: '2025-07-17',
    departmentSync: false,
    departmentScore: 0,
    confirmedDate: '2025-07-17',
    recordTime: '2025-07-17',
    behaviorDescription: '拒收红包、购物卡等财物的行为。',
    eventSummary: '拒绝了客户的红包。',
    handlingResult: '鼓励表扬',
    evidenceMaterial: '表扬信.pdf',
  },
  {
    id: 2,
    assessmentYear: '2025',
    userName: '张雅婷',
    jobNumber: '6420',
    eventDepartment: '党委办公室',
    score: 1,
    amount: 1000,
    eventTime: '2025-02-06',
    departmentSync: true,
    departmentScore: 1,
    confirmedDate: '2025-02-06',
    recordTime: '2025-02-06',
    behaviorDescription: '主动参加志愿服务并获群众好评。',
    eventSummary: '参与志愿活动并受到表扬。',
    handlingResult: '纳入年度加分',
    evidenceMaterial: '志愿活动照片.zip',
  },
  {
    id: 3,
    assessmentYear: '2025',
    userName: '张雅婷',
    jobNumber: '6420',
    eventDepartment: '党委办公室',
    score: 2,
    amount: 0,
    eventTime: '2025-01-20',
    departmentSync: true,
    departmentScore: 2,
    confirmedDate: '2025-01-20',
    recordTime: '2025-01-20',
    behaviorDescription: '主动协助患者解决就诊问题。',
    eventSummary: '收到患者感谢反馈。',
    handlingResult: '纳入年度加分',
    evidenceMaterial: '感谢截图.png',
  },
]

let hospitalStore: ScoreQueryHospitalItem[] = [
  {
    id: 1,
    assessmentYear: '2026',
    scoreType: 'plus',
    targetType: 'person',
    clauseId: 'plus-praise',
    userName: '梁红艳',
    jobNumber: '3110',
    eventDepartment: '整形美容外科',
    applicant: '张雅婷 - 6420',
    reviewer: '钟晟 - 6421',
    score: 1,
    amount: 0,
    eventTime: '2026-03-17',
    recordTime: '2026-03-23',
    behaviorDescription: '主动服务群众，收到书面表扬。',
    eventSummary: '材料已齐全，待流程继续推进。',
    confirmedDate: '2026-03-17',
    handlingResult: '鼓励表扬',
    evidenceMaterial: '表扬信.pdf',
    evidenceMaterialValue: JSON.stringify([{ name: '1.jpeg', url: '/mock/1.jpeg', status: 'finished' }]),
    processStatus: '流程处理中',
  },
  {
    id: 2,
    assessmentYear: '2026',
    scoreType: 'plus',
    targetType: 'person',
    clauseId: 'plus-honest',
    userName: '安蓓',
    jobNumber: '3821',
    eventDepartment: '内科学系',
    applicant: '张雅婷 - 6420',
    reviewer: '张雅婷 - 6420',
    score: 10,
    amount: 0,
    eventTime: '2026-01-21',
    recordTime: '2026-01-24',
    behaviorDescription: '收到患者锦旗，拟加分。',
    eventSummary: '经审核属实。',
    confirmedDate: '2026-01-21',
    handlingResult: '纳入年度加分',
    evidenceMaterial: '锦旗照片.zip',
    evidenceMaterialValue: JSON.stringify([{ name: '锦旗照片.zip', url: '/mock/banner.zip', status: 'finished' }]),
    processStatus: '流程处理中',
  },
  {
    id: 3,
    assessmentYear: '2026',
    scoreType: 'plus',
    targetType: 'person',
    clauseId: 'plus-praise',
    userName: '王弘炜',
    jobNumber: '5669',
    eventDepartment: '神经科',
    applicant: '王弘炜 - 5669',
    reviewer: '张雅婷 - 6420',
    score: 1,
    amount: 0,
    eventTime: '2026-01-21',
    recordTime: '2026-01-22',
    behaviorDescription: '工作表现突出，拟加分。',
    eventSummary: '相关佐证材料已上传。',
    confirmedDate: '2026-01-21',
    handlingResult: '纳入年度加分',
    evidenceMaterial: '情况说明.docx',
    evidenceMaterialValue: JSON.stringify([{ name: '情况说明.docx', url: '/mock/remark.docx', status: 'finished' }]),
    processStatus: '流程处理中',
  },
  {
    id: 4,
    assessmentYear: '2026',
    scoreType: 'minus',
    targetType: 'department',
    clauseId: 'minus-complaint',
    userName: '刘梦琪',
    jobNumber: '1234',
    eventDepartment: '外科学系办公室',
    applicant: '王弘炜 - 5669',
    reviewer: '王弘炜 - 5669',
    score: -15,
    amount: 0,
    eventTime: '2026-01-22',
    recordTime: '2026-01-28',
    behaviorDescription: '服务投诉核实属实，拟扣分。',
    eventSummary: '已通知补充说明。',
    confirmedDate: '2026-01-22',
    handlingResult: '退回补充材料',
    evidenceMaterial: '投诉记录.pdf',
    evidenceMaterialValue: JSON.stringify([{ name: '投诉记录.pdf', url: '/mock/complaint.pdf', status: 'finished' }]),
    processStatus: '已退回待补充',
  },
  {
    id: 5,
    assessmentYear: '2026',
    scoreType: 'plus',
    targetType: 'person',
    clauseId: 'plus-honest',
    userName: '王弘炜',
    jobNumber: '5669',
    eventDepartment: '神经科',
    applicant: '王弘炜 - 5669',
    reviewer: '张雅婷 - 6420',
    score: 10,
    amount: 0,
    eventTime: '2026-01-15',
    recordTime: '2026-01-18',
    behaviorDescription: '主动协助危重患者救治，拟加分。',
    eventSummary: '待进一步流程流转。',
    confirmedDate: '2026-01-15',
    handlingResult: '纳入年度加分',
    evidenceMaterial: '抢救记录.pdf',
    evidenceMaterialValue: JSON.stringify([{ name: '抢救记录.pdf', url: '/mock/rescue.pdf', status: 'finished' }]),
    processStatus: '流程处理中',
  },
]

const cloneItem = <T extends ScoreQueryMineItem | ScoreQueryHospitalItem>(item: T): T => ({ ...item })

const filterMineList = () => mineStore

const filterHospitalList = (query: ScoreQueryHospitalQuery) => {
  const keyword = query.keywords.trim().toLowerCase()

  return hospitalStore.filter((item) => {
    const matchYear = !query.assessmentYear || item.assessmentYear === query.assessmentYear
    const matchType = !query.scoreType || query.scoreType === 'all' || item.scoreType === query.scoreType
    const matchMonth = !query.assessmentMonth || item.eventTime.slice(5, 7) === query.assessmentMonth
    const matchTarget = !query.targetType || query.targetType === 'all' || item.targetType === query.targetType
    const matchClause = !query.clauseId || item.clauseId === query.clauseId
    const matchRecordDate =
      !query.recordDateRange ||
      (() => {
        const recordTime = new Date(item.recordTime).getTime()
        return recordTime >= query.recordDateRange[0] && recordTime <= query.recordDateRange[1]
      })()
    const matchKeyword =
      !keyword ||
      [item.userName, item.jobNumber, item.eventDepartment, item.applicant, item.reviewer].some((field) =>
        field.toLowerCase().includes(keyword),
      )

    return matchYear && matchType && matchMonth && matchTarget && matchClause && matchRecordDate && matchKeyword
  })
}

const pageList = <T>(list: T[], pageNum: number, pageSize: number): ScoreQueryPageData<T> => {
  const current = pageNum || 1
  const size = pageSize || 10
  const start = (current - 1) * size
  const end = start + size
  const records = list.slice(start, end)

  return {
    records,
    total: list.length,
    pageNum: current,
    pageSize: size,
    current,
    size,
    pages: Math.max(1, Math.ceil(list.length / size)),
  }
}

const getHospitalSummary = (list: ScoreQueryHospitalItem[]): ScoreQueryHospitalSummary => {
  return list.reduce(
    (summary, item) => {
      summary.amount += item.amount
      if (item.score > 0) {
        summary.plusScore += item.score
      } else {
        summary.minusScore += Math.abs(item.score)
      }
      return summary
    },
    {
      amount: 0,
      plusScore: 0,
      minusScore: 0,
    },
  )
}

const parseUploadNames = (value?: string) => {
  if (!value) {
    return ''
  }

  try {
    const files = JSON.parse(value) as Array<{ name?: string }>
    return files.map((item) => item.name || '').filter(Boolean).join('、')
  } catch {
    return value
  }
}

export const createSupplementFormFromRow = (row?: ScoreQueryHospitalItem): ScoreQuerySupplementForm => ({
  id: row?.id,
  targetType: 'person',
  reportTargetName: row ? `${row.userName}-${row.jobNumber}` : '',
  assessmentYear: row?.assessmentYear || '2026',
  clauseId: supplementClauseOptions.find((item) => item.score === row?.score)?.value || null,
  amount: row?.amount || 0,
  score: row?.score || 0,
  reviewerName: row?.reviewer || '',
  eventTime: row?.eventTime || null,
  eventDepartment: row?.eventDepartment || '',
  eventSummary: row?.eventSummary || '',
  confirmedDate: row?.confirmedDate || null,
  handlingResult: row?.handlingResult || '',
  evidenceMaterials: row?.evidenceMaterialValue || '',
  recordTime: row?.confirmedDate || row?.eventTime || null,
  recorderName: '张雅婷 - 6420 - 党委办公室',
})

export namespace ScoreQueryApi {
  export const getMinePage = async (query: ScoreQueryMineQuery): Promise<ScoreQueryPageData<ScoreQueryMineItem>> => {
    const list = filterMineList().map(cloneItem)
    return pageList(list, query.pageNum, query.pageSize)
  }

  export const getHospitalPage = async (query: ScoreQueryHospitalQuery) => {
    const filteredList = filterHospitalList(query).map(cloneItem)
    return {
      pageData: pageList(filteredList, query.pageNum, query.pageSize),
      summary: getHospitalSummary(filteredList),
    }
  }

  export const saveSupplement = async (form: ScoreQuerySupplementForm) => {
    if (!form.id) {
      return
    }

    const index = hospitalStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }

    const clause = supplementClauseOptions.find((item) => item.value === form.clauseId)
    hospitalStore[index] = {
      ...hospitalStore[index],
      assessmentYear: form.assessmentYear,
      scoreType: Number(form.score || 0) >= 0 ? 'plus' : 'minus',
      clauseId: form.clauseId || hospitalStore[index].clauseId,
      eventDepartment: form.eventDepartment,
      reviewer: form.reviewerName,
      score: Number(form.score || 0),
      amount: Number(form.amount || 0),
      eventTime: form.eventTime || '',
      recordTime: form.recordTime || hospitalStore[index].recordTime,
      behaviorDescription: clause?.label || hospitalStore[index].behaviorDescription,
      eventSummary: form.eventSummary,
      confirmedDate: form.confirmedDate || '',
      handlingResult: form.handlingResult,
      evidenceMaterial: parseUploadNames(form.evidenceMaterials),
      evidenceMaterialValue: form.evidenceMaterials,
      processStatus: '已补充修改，待重新处理',
    }
    hospitalStore = [...hospitalStore]
  }
}
