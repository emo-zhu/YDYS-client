import type {
  ResultReviewItem,
  ResultReviewMutationForm,
  ResultReviewPageData,
  ResultReviewPageQuery,
  ResultReviewStatus
} from '../types/resultReview'

let resultReviewStore: ResultReviewItem[] = [
  {
    id: 1,
    status: 'pending',
    businessTitle: '临时审查',
    reviewYears: [2022, 2023, 2024],
    operateDate: '2025-08-27',
    totalCount: 6,
    passCount: 0,
    failCount: 0,
    reviewer: '张雅婷-6420-党委办公室',
    operator: '张雅婷-6420-党委办公室'
  },
  {
    id: 2,
    status: 'pending',
    businessTitle: '2024年评先审查',
    reviewYears: [2024],
    operateDate: '2025-02-18',
    totalCount: 8,
    passCount: 3,
    failCount: 1,
    reviewer: '',
    operator: ''
  }
]

const cloneItem = (item: ResultReviewItem): ResultReviewItem => ({
  ...item,
  reviewYears: [...item.reviewYears]
})

export const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createDefaultResultReviewForm = (): ResultReviewMutationForm => ({
  businessTitle: '',
  reviewYears: [],
  operateDate: getToday()
})

const parseDate = (dateString: string) => new Date(`${dateString}T00:00:00`).getTime()

const filterResultReviewList = (query: ResultReviewPageQuery) => {
  const keyword = query.keywords.trim().toLowerCase()

  return resultReviewStore.filter((item) => {
    const matchKeyword = !keyword || item.businessTitle.toLowerCase().includes(keyword)

    if (!matchKeyword) {
      return false
    }

    const range = query.operateDateRange
    if (!range || range.length !== 2) {
      return true
    }

    const [start, end] = range
    const current = parseDate(item.operateDate)

    return current >= start && current <= end
  })
}

const normalizeStatus = (value?: ResultReviewStatus): ResultReviewStatus => {
  if (value === 'completed') {
    return value
  }
  return 'pending'
}

export namespace ResultReviewApi {
  export const getPage = async (query: ResultReviewPageQuery): Promise<ResultReviewPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const filteredList = filterResultReviewList(query)
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

  export const getDetail = async ({ id }: { id: number }) => {
    const row = resultReviewStore.find((item) => item.id === id)
    return row ? cloneItem(row) : undefined
  }

  export const addOne = async (form: ResultReviewMutationForm) => {
    const nextId = resultReviewStore.length ? Math.max(...resultReviewStore.map((item) => item.id)) + 1 : 1
    resultReviewStore = [
      {
        id: nextId,
        status: normalizeStatus(form.status),
        businessTitle: form.businessTitle || '未命名审查',
        reviewYears: form.reviewYears || [],
        operateDate: form.operateDate || getToday(),
        totalCount: form.totalCount || 0,
        passCount: form.passCount || 0,
        failCount: form.failCount || 0,
        reviewer: form.reviewer || '',
        operator: form.operator || ''
      },
      ...resultReviewStore
    ]
    return nextId
  }

  export const editOne = async (form: ResultReviewMutationForm & { id: number }) => {
    const index = resultReviewStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }

    const nextTitle = (form.businessTitle || resultReviewStore[index].businessTitle || '').trim()
    const nextReviewYears = form.reviewYears || resultReviewStore[index].reviewYears || []

    resultReviewStore[index] = {
      ...resultReviewStore[index],
      ...form,
      businessTitle: nextTitle,
      reviewYears: nextReviewYears,
      operateDate: form.operateDate || resultReviewStore[index].operateDate || getToday(),
      status: normalizeStatus(form.status)
    }
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    resultReviewStore = resultReviewStore.filter((item) => item.id !== id)
  }

  export const exportOne = async ({ id }: { id: number }) => {
    const row = resultReviewStore.find((item) => item.id === id)
    return {
      fileName: `${row?.businessTitle || '审查结果'}.xlsx`,
      url: '#'
    }
  }
}
