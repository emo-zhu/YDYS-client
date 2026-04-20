import type { BasicRow, DepartmentPageData, DepartmentPageQuery, DepartmentRow, EditSource } from '../types/organizational'

let leadershipStore: BasicRow[] = [
  { id: 'lead-1', label: '组长', value: '党委书记：赵刚' },
  { id: 'lead-2', label: '副组长', value: '纪委书记：丁伟；副院长：孔杰' },
  {
    id: 'lead-3',
    label: '成员',
    value: '党办：张雅婷；纪委监察室：张京华；医务部：周小兵；门诊部：尹颖超；护理部：姚丽；医保办：张华倩'
  }
]

let officeStore: BasicRow[] = [
  { id: 'office-1', label: '负责人', value: '张雅婷（6420-党委办公室）' },
  {
    id: 'office-2',
    label: '成员',
    value: '卜婧（6337-药学部）、周小兵（6361-医务处）、尹颖超（6376-门诊办公室）、姚丽（6400-护理部办公室）'
  },
  {
    id: 'office-3',
    label: '成员',
    value: '张京华（6427-纪委监察室）、张华倩（6507-医疗保险办公室）、林行文（6638-保卫处）'
  }
]

let departmentStore: DepartmentRow[] = [
  {
    id: 'dept-1',
    name: '人事处',
    leader: '敖辉',
    secretary: '',
    members: '',
    children: [
      {
        id: 'dept-1-include',
        name: '包含科室：人事处,院长办公室,人事处病区',
        leader: '',
        secretary: '',
        members: '',
        isIncludeRow: true
      }
    ]
  },
  {
    id: 'dept-2',
    name: '财务部',
    leader: '张雅婷',
    secretary: '',
    members: '',
    children: [
      {
        id: 'dept-2-include',
        name: '包含科室：财务处,内科学系办公室,心血管内科一病区,儿科学系,儿科学系未分科',
        leader: '',
        secretary: '',
        members: '',
        isIncludeRow: true
      }
    ]
  },
  { id: 'dept-3', name: '后勤处', leader: '毕亚雯', secretary: '周路', members: '周子佩' },
  { id: 'dept-4', name: '医务处', leader: '周小兵', secretary: '顾锦丽', members: '王妍' },
  { id: 'dept-5', name: '消化内科', leader: '朱云', secretary: '朱志宏', members: '朱若愚' },
  { id: 'dept-6', name: '心血管内科', leader: '王剑清', secretary: '关建', members: '王华,邹建伟' }
]

const cloneBasicRows = (rows: BasicRow[]) => rows.map((item) => ({ ...item }))
const cloneDepartmentRows = (rows: DepartmentRow[]): DepartmentRow[] =>
  rows.map((item) => ({
    ...item,
    children: item.children ? cloneDepartmentRows(item.children) : undefined
  }))

export namespace OrganizationalApi {
  export const getSummaryList = async (source: EditSource) => {
    return cloneBasicRows(source === 'leadership' ? leadershipStore : officeStore)
  }

  export const updateSummary = async (source: EditSource, id: string, value: string) => {
    const targetList = source === 'leadership' ? leadershipStore : officeStore
    const row = targetList.find((item) => item.id === id)
    if (row) {
      row.value = value
    }
  }

  export const getDepartmentPage = async (query: DepartmentPageQuery): Promise<DepartmentPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const records = cloneDepartmentRows(departmentStore.slice(start, end))
    const total = departmentStore.length

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

  export const getDepartmentOne = async (id: string) => {
    const row = departmentStore.find((item) => item.id === id)
    return row ? cloneDepartmentRows([row])[0] : undefined
  }

  export const updateDepartment = async (id: string, payload: Pick<DepartmentRow, 'leader' | 'secretary' | 'members'>) => {
    const row = departmentStore.find((item) => item.id === id)
    if (row) {
      row.leader = payload.leader
      row.secretary = payload.secretary
      row.members = payload.members
    }
  }
}
