import type {
  DepartmentAssessmentScopeForm,
  DepartmentAssessmentScopeItem,
  DepartmentAssessmentScopePageData,
  DepartmentAssessmentScopePageQuery,
  DepartmentOption
} from '../types/scope'

const departmentOptions: DepartmentOption[] = [
  {
    label: '职能科室',
    key: 'group-1',
    value: 'group-1',
    children: [
      { label: '党委办公室', key: 'dept-1', value: 'dept-1' },
      { label: '医务处', key: 'dept-2', value: 'dept-2' },
      { label: '护理部', key: 'dept-3', value: 'dept-3' },
      { label: '医保办公室', key: 'dept-4', value: 'dept-4' }
    ]
  },
  {
    label: '临床科室',
    key: 'group-2',
    value: 'group-2',
    children: [
      { label: '消化内科', key: 'dept-5', value: 'dept-5' },
      { label: '心血管内科', key: 'dept-6', value: 'dept-6' },
      { label: '呼吸与危重症医学科', key: 'dept-7', value: 'dept-7' },
      { label: '普通外科', key: 'dept-8', value: 'dept-8' }
    ]
  }
]

const departmentMap = new Map<string, string>()

const fillDepartmentMap = (options: DepartmentOption[]) => {
  options.forEach((item) => {
    if (item.children?.length) {
      fillDepartmentMap(item.children as DepartmentOption[])
      return
    }
    departmentMap.set(item.value as string, item.label as string)
  })
}

fillDepartmentMap(departmentOptions)

const resolveDepartmentNames = (departmentIds: string[]) =>
  departmentIds.map((id) => departmentMap.get(id)).filter(Boolean) as string[]

const cloneScopeItem = (item: DepartmentAssessmentScopeItem): DepartmentAssessmentScopeItem => ({
  ...item,
  departmentIds: [...item.departmentIds],
  departmentNames: [...item.departmentNames]
})

let scopeStore: DepartmentAssessmentScopeItem[] = [
  {
    id: 1,
    groupName: '职能科室考评组',
    sortOrder: 1,
    departmentIds: ['dept-1', 'dept-2', 'dept-3'],
    departmentNames: resolveDepartmentNames(['dept-1', 'dept-2', 'dept-3'])
  },
  {
    id: 2,
    groupName: '临床一组',
    sortOrder: 2,
    departmentIds: ['dept-5', 'dept-6', 'dept-7'],
    departmentNames: resolveDepartmentNames(['dept-5', 'dept-6', 'dept-7'])
  }
]

export const createDefaultScopeForm = (): DepartmentAssessmentScopeForm => ({
  groupName: '',
  sortOrder: 0,
  departmentIds: []
})

export namespace DepartmentAssessmentScopeApi {
  export const getDepartmentOptions = async () => departmentOptions

  export const getPage = async (query: DepartmentAssessmentScopePageQuery): Promise<DepartmentAssessmentScopePageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const keywords = query.keywords.trim()
    const filtered = scopeStore.filter((item) => !keywords || item.groupName.includes(keywords))
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = filtered.slice(start, end).map(cloneScopeItem)
    const total = filtered.length

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
    const target = scopeStore.find((item) => item.id === id)
    return target ? cloneScopeItem(target) : undefined
  }

  export const addOne = async (form: DepartmentAssessmentScopeForm) => {
    const nextId = scopeStore.length ? Math.max(...scopeStore.map((item) => item.id)) + 1 : 1
    const departmentIds = [...(form.departmentIds || [])]
    scopeStore = [
      {
        id: nextId,
        groupName: form.groupName?.trim() || '',
        sortOrder: Number(form.sortOrder || 0),
        departmentIds,
        departmentNames: resolveDepartmentNames(departmentIds)
      },
      ...scopeStore
    ]
    return nextId
  }

  export const editOne = async (form: DepartmentAssessmentScopeForm) => {
    const index = scopeStore.findIndex((item) => item.id === form.id)
    if (index === -1) {
      return
    }
    const departmentIds = [...(form.departmentIds || [])]
    scopeStore[index] = {
      id: Number(form.id),
      groupName: form.groupName?.trim() || '',
      sortOrder: Number(form.sortOrder || 0),
      departmentIds,
      departmentNames: resolveDepartmentNames(departmentIds)
    }
  }

  export const deleteOne = async ({ id }: { id: number }) => {
    scopeStore = scopeStore.filter((item) => item.id !== id)
  }

  export const validateDuplicateName = async ({ id, groupName }: { id?: number; groupName: string }) => {
    return scopeStore.some((item) => item.groupName === groupName && item.id !== id)
  }
}
