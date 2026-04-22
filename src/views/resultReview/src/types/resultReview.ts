export type ResultReviewStatus = 'pending' | 'completed'

export interface ResultReviewItem {
  id: number
  status: ResultReviewStatus
  businessTitle: string
  reviewYears: number[]
  operateDate: string
  totalCount: number
  passCount: number
  failCount: number
  reviewer: string
  operator: string
}

export interface ResultReviewMutationForm extends Partial<ResultReviewItem> {}

export interface ResultReviewPageQuery {
  keywords: string
  operateDateRange: [number, number] | null
  pageNum: number
  pageSize: number
}

export interface ResultReviewPageData {
  records: ResultReviewItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
