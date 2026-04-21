import type { GenderType, UserForm, UserItem, UserPageData, UserPageQuery } from '../types/user'

let userStore: UserItem[] = [
  { id: 1, userName: '儿科学系党总支', jobNumber: '3958', realName: '冯晓萍', gender: '女' },
  { id: 2, userName: '妇产科学系党总支', jobNumber: '3119', realName: '关力', gender: '女' },
  { id: 3, userName: '内科学习党总支', jobNumber: '0006', realName: '尹会民', gender: '男' },
  { id: 4, userName: '内科学党总支', jobNumber: '0164', realName: '尹海云', gender: '女' },
  { id: 5, userName: '外科学系党总支', jobNumber: '1266', realName: '高文杰', gender: '男' },
  { id: 6, userName: '医技党总支', jobNumber: '6351', realName: '彭凡恩', gender: '男' }
]

const cloneItem = (item: UserItem): UserItem => ({ ...item })

const filterUsers = (query: Pick<UserPageQuery, 'name'>) => {
  const keyword = query.name.trim()
  if (!keyword) {
    return userStore
  }
  return userStore.filter((item) => item.realName.includes(keyword) || item.userName.includes(keyword))
}

export const createDefaultUserForm = (): UserForm => ({
  userName: '',
  jobNumber: '',
  realName: '',
  gender: '女' as GenderType
})

export namespace UserApi {
  export const getPage = async (query: UserPageQuery): Promise<UserPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const filteredList = filterUsers(query)
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
    const row = userStore.find((item) => item.id === id)
    return row ? cloneItem(row) : undefined
  }

  export const addOne = async (form: UserForm) => {
    const nextId = userStore.length ? Math.max(...userStore.map((item) => item.id)) + 1 : 1
    userStore = [
      {
        id: nextId,
        userName: form.userName || '',
        jobNumber: form.jobNumber || '',
        realName: form.realName || '',
        gender: (form.gender || '女') as GenderType
      },
      ...userStore
    ]
    return nextId
  }

  export const editOne = async (form: UserForm) => {
    const index = userStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    userStore[index] = {
      id: Number(form.id),
      userName: form.userName || '',
      jobNumber: form.jobNumber || '',
      realName: form.realName || '',
      gender: (form.gender || '女') as GenderType
    }
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    userStore = userStore.filter((item) => item.id !== id)
  }
}
