import type { CommitmentForm, CommitmentItem, CommitmentPageData, CommitmentPageQuery, CommitmentStatus, DateRangeValue } from '../types/commitment'

const defaultInitiator = '张雅婷-6420-党委办公室'

let commitmentStore: CommitmentItem[] = [
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

const cloneItem = (item: CommitmentItem): CommitmentItem => ({ ...item })

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

export const createDefaultCommitmentForm = (): CommitmentForm => ({
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

const filterCommitments = (query: Pick<CommitmentPageQuery, 'reportName' | 'dateRange'>) => {
  const keyword = query.reportName.trim()
  const range = query.dateRange

  return commitmentStore.filter((item) => {
    const matchKeyword = !keyword || item.reportName.includes(keyword)
    const matchDate = !range || isDateRangeMatched(item.startTime, item.endTime, range)
    return matchKeyword && matchDate
  })
}

export namespace CommitmentApi {
  export const getPage = async (query: CommitmentPageQuery): Promise<CommitmentPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const filteredList = filterCommitments(query)
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
    const target = commitmentStore.find((item) => item.id === id)
    return target ? cloneItem(target) : undefined
  }

  export const addOne = async (form: CommitmentForm) => {
    const nextId = commitmentStore.length ? Math.max(...commitmentStore.map((item) => item.id)) + 1 : 1
    const nextItem: CommitmentItem = {
      id: nextId,
      status: (form.status || '进行中') as CommitmentStatus,
      reportName: form.reportName || '',
      initiator: form.initiator || defaultInitiator,
      startTime: formatDateTime(form.timeRange?.[0]),
      endTime: formatDateTime(form.timeRange?.[1]),
      targetDepartmentCount: Number(form.targetDepartmentCount || 0),
      submittedDepartmentCount: Number(form.submittedDepartmentCount || 0)
    }
    commitmentStore = [nextItem, ...commitmentStore]
    return nextId
  }

  export const editOne = async (form: CommitmentForm) => {
    const index = commitmentStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    commitmentStore[index] = {
      id: Number(form.id),
      status: (form.status || '进行中') as CommitmentStatus,
      reportName: form.reportName || '',
      initiator: form.initiator || defaultInitiator,
      startTime: formatDateTime(form.timeRange?.[0]),
      endTime: formatDateTime(form.timeRange?.[1]),
      targetDepartmentCount: Number(form.targetDepartmentCount || 0),
      submittedDepartmentCount: Number(form.submittedDepartmentCount || 0)
    }
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    commitmentStore = commitmentStore.filter((item) => item.id !== id)
  }

  export const updateStatus = async ({ id, status }: { id: number; status: CommitmentStatus }) => {
    const target = commitmentStore.find((item) => item.id === id)
    if (target) {
      target.status = status
    }
  }
}
