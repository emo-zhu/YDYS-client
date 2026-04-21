import type { GenderType, UserForm, UserItem, UserPageData, UserPageQuery } from '../types/user'

let userStore: UserItem[] = [
  { id: 1, userName: '党委办公室1', jobNumber: '6421', realName: '钟晟', gender: '女' },
  { id: 2, userName: '护理部1', jobNumber: '6400', realName: '姚丽', gender: '女' },
  { id: 3, userName: '护理部2', jobNumber: '6389', realName: '叶娟', gender: '女' },
  { id: 4, userName: '纪委监察室1', jobNumber: '6428', realName: '周安娜', gender: '女' },
  { id: 5, userName: '纪委监察室2', jobNumber: '6427', realName: '张京华', gender: '女' },
  { id: 6, userName: '科研处1', jobNumber: '6413', realName: '彭刚', gender: '男' },
  { id: 7, userName: '科研处2', jobNumber: '6409', realName: '顾虹瑕', gender: '女' },
  { id: 8, userName: '门诊部1', jobNumber: '6387', realName: '周新', gender: '女' },
  { id: 9, userName: '门诊部2', jobNumber: '6376', realName: '尹颖超', gender: '女' },
  { id: 10, userName: '药学部1', jobNumber: '6341', realName: '沈瑶', gender: '女' },
  { id: 11, userName: '药学部2', jobNumber: '6337', realName: '卜婧', gender: '女' },
  { id: 12, userName: '医务处1', jobNumber: '6361', realName: '周小兵', gender: '男' },
  { id: 13, userName: '护理部3', jobNumber: '6312', realName: '陈莉', gender: '女' },
  { id: 14, userName: '护理部4', jobNumber: '6315', realName: '王敏', gender: '女' },
  { id: 15, userName: '办公室2', jobNumber: '6299', realName: '李晨', gender: '男' },
  { id: 16, userName: '保卫处1', jobNumber: '6638', realName: '林行文', gender: '男' }
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
