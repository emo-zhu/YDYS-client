import type { DateRangeValue, SelfCheckForm, SelfCheckItem, SelfCheckPageData, SelfCheckPageQuery, SelfCheckStatus } from '../types/selfCheck'

const defaultInitiator = '张雅婷-6420-党委办公室'

let selfCheckStore: SelfCheckItem[] = [
  {
    id: 1,
    status: '进行中',
    reportName: '合理检查自查自纠',
    initiator: defaultInitiator,
    startTime: '2025-08-10 22:04:53',
    endTime: '2025-08-21 23:15:32',
    targetDepartmentCount: 29,
    submittedDepartmentCount: 0
  }
]

const cloneItem = (item: SelfCheckItem): SelfCheckItem => ({ ...item })

export const normalizeDateTime = (dateText: string) => new Date(dateText.replace(/-/g, '/')).getTime()

export const formatDateTime = (timestamp?: number | null) => {
  if (!timestamp) {
    return ''
  }
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const createDefaultSelfCheckForm = (): SelfCheckForm => ({
  reportName: '',
  timeRange: null,
  initiator: defaultInitiator,
  targetDepartmentCount: 0,
  submittedDepartmentCount: 0,
  status: '进行中'
})

const isDateRangeMatched = (startTime: string, endTime: string, range: DateRangeValue) => {
  if (!range) {
    return true
  }
  return normalizeDateTime(startTime) >= range[0] && normalizeDateTime(endTime) <= range[1]
}

const filterSelfChecks = (query: Pick<SelfCheckPageQuery, 'reportName' | 'dateRange'>) => {
  const keyword = query.reportName.trim()
  const range = query.dateRange

  return selfCheckStore.filter((item) => {
    const matchKeyword = !keyword || item.reportName.includes(keyword)
    const matchDate = !range || isDateRangeMatched(item.startTime, item.endTime, range)
    return matchKeyword && matchDate
  })
}

export namespace SelfCheckApi {
  export const getPage = async (query: SelfCheckPageQuery): Promise<SelfCheckPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const filteredList = filterSelfChecks(query)
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

  export const getDetails = async ({ id }: { id?: number | null }) => {
    const target = selfCheckStore.find((item) => item.id === id)
    return target ? cloneItem(target) : undefined
  }

  export const addOne = async (form: SelfCheckForm) => {
    const nextId = selfCheckStore.length ? Math.max(...selfCheckStore.map((item) => item.id)) + 1 : 1
    const nextItem: SelfCheckItem = {
      id: nextId,
      status: (form.status || '进行中') as SelfCheckStatus,
      reportName: form.reportName || '',
      initiator: form.initiator || defaultInitiator,
      startTime: formatDateTime(form.timeRange?.[0]),
      endTime: formatDateTime(form.timeRange?.[1]),
      targetDepartmentCount: Number(form.targetDepartmentCount || 0),
      submittedDepartmentCount: Number(form.submittedDepartmentCount || 0)
    }
    selfCheckStore = [nextItem, ...selfCheckStore]
    return nextId
  }

  export const editOne = async (form: SelfCheckForm) => {
    const index = selfCheckStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    selfCheckStore[index] = {
      id: Number(form.id),
      status: (form.status || '进行中') as SelfCheckStatus,
      reportName: form.reportName || '',
      initiator: form.initiator || defaultInitiator,
      startTime: formatDateTime(form.timeRange?.[0]),
      endTime: formatDateTime(form.timeRange?.[1]),
      targetDepartmentCount: Number(form.targetDepartmentCount || 0),
      submittedDepartmentCount: Number(form.submittedDepartmentCount || 0)
    }
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    selfCheckStore = selfCheckStore.filter((item) => item.id !== id)
  }

  export const updateStatus = async ({ id, status }: { id: number; status: SelfCheckStatus }) => {
    const target = selfCheckStore.find((item) => item.id === id)
    if (target) {
      target.status = status
    }
  }
}
