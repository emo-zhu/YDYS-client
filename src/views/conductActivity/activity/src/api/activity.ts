import type { ActivityForm, ActivityItem, ActivityPageData, ActivityPageQuery, ActivityStatus, DateRangeValue } from '../types/activity'

const defaultEntryUser = '张雅婷 - 6420 - 党委办公室'

let activityStore: ActivityItem[] = [
  {
    id: 1,
    status: '已发布',
    title: '我院开展医务人员廉洁从业承诺书签署活动',
    activityStartDate: '2025-08-28',
    activityEndDate: '2025-08-28',
    department: '纪委监察室',
    entryDate: '2025-08-19',
    entryUser: defaultEntryUser
  },
  {
    id: 2,
    status: '未发布',
    title: '党支部行风建设专题培训活动',
    activityStartDate: '2025-09-05',
    activityEndDate: '2025-09-07',
    department: '党委办公室',
    entryDate: '2025-08-22',
    entryUser: '周小兵 - 6361 - 医务处'
  },
  {
    id: 3,
    status: '未发布',
    title: '窗口服务礼仪专项提升活动',
    activityStartDate: '2025-09-12',
    activityEndDate: '2025-09-12',
    department: '门诊办公室',
    entryDate: '2025-08-25',
    entryUser: '尹颖超 - 6376 - 门诊办公室'
  }
]

export const normalizeDate = (dateText: string) => new Date(`${dateText}T00:00:00`).getTime()

export const formatDate = (timestamp?: number | null) => {
  if (!timestamp) {
    return ''
  }
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getToday = () => formatDate(Date.now())

export const getActivityDateText = (row: Pick<ActivityItem, 'activityStartDate' | 'activityEndDate'>) => {
  if (row.activityStartDate === row.activityEndDate) {
    return row.activityStartDate
  }
  return `${row.activityStartDate} ~ ${row.activityEndDate}`
}

export const createDefaultActivityForm = (): ActivityForm => ({
  title: '',
  activityDateRange: null,
  department: '',
  entryDate: getToday(),
  entryUser: defaultEntryUser,
  status: '未发布'
})

const cloneItem = (item: ActivityItem): ActivityItem => ({ ...item })

const filterActivities = (query: Pick<ActivityPageQuery, 'title' | 'dateRange'>) => {
  const keyword = query.title.trim()
  const range = query.dateRange

  return activityStore.filter((item) => {
    const matchKeyword = !keyword || item.title.includes(keyword)
    const matchDate = !range || isDateRangeMatched(item.activityStartDate, item.activityEndDate, range)
    return matchKeyword && matchDate
  })
}

const isDateRangeMatched = (startDate: string, endDate: string, range: DateRangeValue) => {
  if (!range) {
    return true
  }
  return normalizeDate(startDate) >= range[0] && normalizeDate(endDate) <= range[1]
}

export namespace ActivityApi {
  export const getPage = async (query: ActivityPageQuery): Promise<ActivityPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const filteredList = filterActivities(query)
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

  export const getList = async (query: Pick<ActivityPageQuery, 'title' | 'dateRange'>): Promise<ActivityItem[]> => {
    return filterActivities(query).map(cloneItem)
  }

  export const getDetails = async ({ id }: { id?: number | null }) => {
    const target = activityStore.find((item) => item.id === id)
    return target ? cloneItem(target) : undefined
  }

  export const addOne = async (form: ActivityForm) => {
    const nextId = activityStore.length ? Math.max(...activityStore.map((item) => item.id)) + 1 : 1
    const nextItem: ActivityItem = {
      id: nextId,
      status: (form.status || '未发布') as ActivityStatus,
      title: form.title || '',
      activityStartDate: formatDate(form.activityDateRange?.[0]),
      activityEndDate: formatDate(form.activityDateRange?.[1]),
      department: form.department || '',
      entryDate: form.entryDate || getToday(),
      entryUser: form.entryUser || defaultEntryUser
    }
    activityStore = [nextItem, ...activityStore]
    return nextId
  }

  export const editOne = async (form: ActivityForm) => {
    const index = activityStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    activityStore[index] = {
      id: Number(form.id),
      status: (form.status || '未发布') as ActivityStatus,
      title: form.title || '',
      activityStartDate: formatDate(form.activityDateRange?.[0]),
      activityEndDate: formatDate(form.activityDateRange?.[1]),
      department: form.department || '',
      entryDate: form.entryDate || getToday(),
      entryUser: form.entryUser || defaultEntryUser
    }
  }

  export const deleteBatch = async ({ ids }: { ids: number[] }) => {
    activityStore = activityStore.filter((item) => !ids.includes(item.id))
  }

  export const updateStatus = async ({ id, status }: { id: number; status: ActivityStatus }) => {
    const target = activityStore.find((item) => item.id === id)
    if (target) {
      target.status = status
    }
  }
}
