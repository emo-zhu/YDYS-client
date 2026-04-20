export type GenderType = '男' | '女'

export interface UserItem {
  id: number
  userName: string
  jobNumber: string
  realName: string
  gender: GenderType
}

export interface UserForm extends Partial<UserItem> {}

export interface UserPageQuery {
  name: string
  pageNum: number
  pageSize: number
}

export interface UserPageData {
  records: UserItem[]
  total: number
  pageNum: number
  pageSize: number
  current: number
  size: number
  pages: number
}
