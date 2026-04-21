import type { RegulationFileType, RegulationForm, RegulationItem, RegulationPageData, RegulationPageQuery } from '../types/regulation'

let regulationStore: RegulationItem[] = [
  {
    id: 1,
    fileType: '规章制度',
    title: '医务人员职业道德准则（2025年版）',
    publishDate: '2025-08-21',
    contentName: '医务人员职业道德准则（2025年版）.pdf',
    browseCount: 6
  },
  {
    id: 2,
    fileType: '学习资料',
    title: '医德医风口袋书-省卫健委发',
    publishDate: '2025-04-09',
    contentName: '省卫生健康委应急处----医德医风口袋书.pdf',
    browseCount: 20
  },
  {
    id: 3,
    fileType: '学习资料',
    title: '“人情往来”，还是违纪违法?',
    publishDate: '2025-02-18',
    contentName: '“人情往来”，还是违纪违法？.pdf',
    browseCount: 13
  },
  {
    id: 4,
    fileType: '规章制度',
    title: '国家卫健委《关于医务人员医德考评制度的指导意见（试行）》',
    publishDate: '2025-02-17',
    contentName: '国家卫健委关于建立医务人员医德考评制度的指导意见（试行）.pdf',
    browseCount: 18
  },
  {
    id: 5,
    fileType: '规章制度',
    title: '《湖北省医务人员医德考评实施办法》',
    publishDate: '2025-02-17',
    contentName: '2021省卫健委关于印发《湖北省医务人员医德考评实施办法》.pdf',
    browseCount: 0
  },
  {
    id: 6,
    fileType: '规章制度',
    title: '《关于印发医疗机构工作人员廉洁从业九项准则的通知》',
    publishDate: '2025-02-17',
    contentName: '关于印发医疗机构工作人员廉洁从业九项准则的通知.pdf',
    browseCount: 0
  },
  {
    id: 7,
    fileType: '规章制度',
    title: '《大型医院巡查工作方案（2023-2026）》',
    publishDate: '2025-02-17',
    contentName: '大型医院巡查工作方案（2023-2026）.pdf',
    browseCount: 0
  }
]

const cloneItem = (item: RegulationItem): RegulationItem => ({ ...item })

export const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createDefaultRegulationForm = (): RegulationForm => ({
  fileType: '规章制度' as RegulationFileType,
  title: '',
  publishDate: getToday(),
  contentName: ''
})

const filterRegulations = (query: Pick<RegulationPageQuery, 'keywords'>) => {
  const keywords = query.keywords.trim().toLowerCase()
  if (!keywords) {
    return regulationStore
  }
  return regulationStore.filter(
    (item) => item.title.toLowerCase().includes(keywords) || item.contentName.toLowerCase().includes(keywords)
  )
}

export namespace RegulationApi {
  export const getPage = async (query: RegulationPageQuery): Promise<RegulationPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const filteredList = filterRegulations(query)
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = filteredList.slice(start, end).map(cloneItem)
    const total = filteredList.length

    return {
      records,
      total,
      pageNum,
      pageSize,
      current: pageNum,
      size: pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize))
    }
  }

  export const getList = async (query: Pick<RegulationPageQuery, 'keywords'>) => {
    return filterRegulations(query).map(cloneItem)
  }

  export const getDetails = async ({ id }: { id?: number | null }) => {
    const row = regulationStore.find((item) => item.id === id)
    return row ? cloneItem(row) : undefined
  }

  export const addOne = async (form: RegulationForm) => {
    const nextId = regulationStore.length ? Math.max(...regulationStore.map((item) => item.id)) + 1 : 1
    regulationStore = [
      {
        id: nextId,
        fileType: (form.fileType || '规章制度') as RegulationFileType,
        title: form.title || '',
        publishDate: form.publishDate || getToday(),
        contentName: form.contentName || `${form.title || '制度文件'}.pdf`,
        browseCount: 0
      },
      ...regulationStore
    ]
    return nextId
  }

  export const editOne = async (form: RegulationForm) => {
    const index = regulationStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    regulationStore[index] = {
      id: Number(form.id),
      fileType: (form.fileType || '规章制度') as RegulationFileType,
      title: form.title || '',
      publishDate: form.publishDate || getToday(),
      contentName: form.contentName || `${form.title || '制度文件'}.pdf`,
      browseCount: regulationStore[index].browseCount
    }
  }

  export const deleteBatch = async ({ ids }: { ids: number[] }) => {
    regulationStore = regulationStore.filter((item) => !ids.includes(item.id))
  }

  export const increaseBrowseCount = async ({ id }: { id: number }) => {
    const row = regulationStore.find((item) => item.id === id)
    if (row) {
      row.browseCount += 1
    }
  }
}
