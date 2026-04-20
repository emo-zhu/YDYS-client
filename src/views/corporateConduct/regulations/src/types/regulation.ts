export type TableRowKey = number | string
export type RegulationFileType = '规章制度' | '学习资料'

export interface RegulationItem {
  id: number
  fileType: RegulationFileType
  title: string
  publishDate: string
  contentName: string
  browseCount: number
}

export interface RegulationForm extends Partial<RegulationItem> {}

export interface RegulationPageQuery {
  keywords: string
  pageNum: number
  pageSize: number
}

export interface RegulationPageData {
  records: RegulationItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
