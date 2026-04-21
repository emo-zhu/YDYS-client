import type {
  EthicsArchiveDetail,
  EthicsArchiveForm,
  EthicsArchiveItem,
  EthicsArchivePageData,
  EthicsArchivePageQuery,
} from '../types/archive'

const cloneArchiveItem = (item: EthicsArchiveItem): EthicsArchiveItem => ({ ...item })

let archiveStore: EthicsArchiveItem[] = [
  {
    id: 1,
    archiveYear: '2025',
    archiveCode: 'MDA-2025-001',
    userName: '张雅婷-6420',
    positionType: '管理岗',
    departmentName: '党委办公室',
    positionName: '办公室主任',
    archiveStatus: '已归档',
    dailyScore: 13,
    personalScore: 0,
    departmentScore: 90,
    hospitalScore: 89,
    assessmentLevel: '良好',
    score: 89,
    rewardCount: 0,
    complaintCount: 0,
    updatedAt: '2026-04-21 15:00:00',
    downloadFileName: '个人年度医德考评登记表.pdf',
    highlights: '年度综合表现稳定，廉洁从业记录完整，院内考评结果已归档。',
    improvementPlan: '持续完善年度过程留痕材料，规范归档下载附件管理。',
  },
]

export const createDefaultArchiveForm = (): EthicsArchiveForm => ({
  archiveYear: '2025',
  archiveCode: '',
  userName: '',
  positionType: '',
  departmentName: '',
  positionName: '',
  archiveStatus: '已归档',
  dailyScore: 0,
  personalScore: 0,
  departmentScore: 0,
  hospitalScore: 0,
  assessmentLevel: '',
  score: 0,
  rewardCount: 0,
  complaintCount: 0,
  updatedAt: '',
  downloadFileName: '个人年度医德考评登记表.pdf',
  highlights: '',
  improvementPlan: '',
})

export namespace EthicsArchiveApi {
  export const getPage = async (
    query: EthicsArchivePageQuery,
  ): Promise<EthicsArchivePageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const keywords = query.keywords.trim()
    const filtered = archiveStore.filter((item) => {
      const matchKeywords =
        !keywords ||
        item.userName.includes(keywords) ||
        item.archiveCode.includes(keywords) ||
        item.departmentName.includes(keywords)
      const matchYear = !query.archiveYear || item.archiveYear === query.archiveYear
      return matchKeywords && matchYear
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
  }): Promise<EthicsArchiveDetail | undefined> => {
    const target = archiveStore.find((item) => item.id === id)
    return target ? cloneArchiveItem(target) : undefined
  }

  export const addOne = async (_form: EthicsArchiveForm) => {
    return archiveStore[0]?.id || 1
  }

  export const editOne = async (_form: EthicsArchiveForm) => {}

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
      (item) => item.archiveCode === archiveCode && item.id !== id,
    )
  }
}
