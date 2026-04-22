import { createInitialMeetingStore, workMeetingConfigMap } from './config'
import type {
  WorkMeetingForm,
  WorkMeetingItem,
  WorkMeetingPageData,
  WorkMeetingPageQuery,
  WorkMeetingStatus,
  WorkMeetingType
} from './types'

const storeMap = new Map<WorkMeetingType, WorkMeetingItem[]>()

const getStore = (type: WorkMeetingType) => {
  if (!storeMap.has(type)) {
    storeMap.set(type, createInitialMeetingStore(type))
  }
  return storeMap.get(type)!
}

const setStore = (type: WorkMeetingType, nextStore: WorkMeetingItem[]) => {
  storeMap.set(type, nextStore)
}

const cloneItem = (item: WorkMeetingItem): WorkMeetingItem => ({ ...item })

export const formatDate = (date?: string) => date || ''

export const createDefaultWorkMeetingForm = (type: WorkMeetingType): WorkMeetingForm => {
  const config = workMeetingConfigMap[type]
  return {
    status: '待填报',
    assessmentYear: '2025',
    assessmentPeriod: config.periodOptions[0]?.value || '',
    departmentName: '',
    reporterName: config.defaultReporterName,
    reporterJobNo: config.defaultReporterJobNo,
    reportTime: '2025-08-20',
    attachmentName: '',
    attachmentUrl: '',
    remarks: ''
  }
}

const filterMeetings = (type: WorkMeetingType, query: WorkMeetingPageQuery) => {
  const list = getStore(type)
  const keywords = (query.keywords || '').trim().toLowerCase()

  return list.filter((item) => {
    const matchKeywords =
      !keywords ||
      item.departmentName.toLowerCase().includes(keywords) ||
      item.reporterName.toLowerCase().includes(keywords) ||
      item.reporterJobNo.toLowerCase().includes(keywords) ||
      item.attachmentName.toLowerCase().includes(keywords) ||
      item.remarks.toLowerCase().includes(keywords)
    const matchYear = !query.assessmentYear || item.assessmentYear === query.assessmentYear
    const matchPeriod = !query.assessmentPeriod || item.assessmentPeriod === query.assessmentPeriod
    const matchDepartment = !query.departmentName || item.departmentName === query.departmentName
    return matchKeywords && matchYear && matchPeriod && matchDepartment
  })
}

export namespace WorkMeetingApi {
  export const getPage = async (
    type: WorkMeetingType,
    query: WorkMeetingPageQuery
  ): Promise<WorkMeetingPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const filteredList = filterMeetings(type, query)
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

  export const getList = async (type: WorkMeetingType, query: WorkMeetingPageQuery) =>
    filterMeetings(type, query).map(cloneItem)

  export const getDetails = async (type: WorkMeetingType, { id }: { id?: number | null }) => {
    const target = getStore(type).find((item) => item.id === id)
    return target ? cloneItem(target) : undefined
  }

  export const addOne = async (type: WorkMeetingType, form: WorkMeetingForm) => {
    const config = workMeetingConfigMap[type]
    const store = getStore(type)
    const nextId = store.length ? Math.max(...store.map((item) => item.id)) + 1 : 1
    const nextItem: WorkMeetingItem = {
      id: nextId,
      status: (form.status || '待填报') as WorkMeetingStatus,
      assessmentYear: form.assessmentYear || '2025',
      assessmentPeriod: form.assessmentPeriod || config.periodOptions[0]?.value || '',
      departmentName: form.departmentName || '',
      reporterName: form.reporterName || config.defaultReporterName,
      reporterJobNo: form.reporterJobNo || config.defaultReporterJobNo,
      reportTime: formatDate(form.reportTime),
      attachmentName: form.attachmentName || '',
      attachmentUrl: form.attachmentUrl || form.attachmentName || '',
      remarks: form.remarks || ''
    }

    setStore(type, [nextItem, ...store])
    return nextId
  }

  export const editOne = async (type: WorkMeetingType, form: WorkMeetingForm) => {
    const config = workMeetingConfigMap[type]
    const store = getStore(type)
    const index = store.findIndex((item) => item.id === form.id)

    if (index === -1) {
      return
    }

    store[index] = {
      id: Number(form.id),
      status: (form.status || '待填报') as WorkMeetingStatus,
      assessmentYear: form.assessmentYear || '2025',
      assessmentPeriod: form.assessmentPeriod || config.periodOptions[0]?.value || '',
      departmentName: form.departmentName || '',
      reporterName: form.reporterName || config.defaultReporterName,
      reporterJobNo: form.reporterJobNo || config.defaultReporterJobNo,
      reportTime: formatDate(form.reportTime),
      attachmentName: form.attachmentName || '',
      attachmentUrl: form.attachmentUrl || form.attachmentName || '',
      remarks: form.remarks || ''
    }

    setStore(type, [...store])
  }

  export const deleteBatch = async (type: WorkMeetingType, { ids }: { ids: number[] }) => {
    const store = getStore(type)
    setStore(
      type,
      store.filter((item) => !ids.includes(item.id))
    )
  }

  export const deleteOne = async (type: WorkMeetingType, { id }: { id: number }) => {
    const store = getStore(type)
    setStore(
      type,
      store.filter((item) => item.id !== id)
    )
  }
}
