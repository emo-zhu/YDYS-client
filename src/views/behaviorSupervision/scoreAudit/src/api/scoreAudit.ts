import type { ScoreAuditItem, ScoreAuditPageData, ScoreAuditQuery, ScoreAuditStatus } from '../types/scoreAudit'

let scoreAuditStore: ScoreAuditItem[] = [
  {
    id: 1,
    status: '审核中',
    assessmentYear: '2026',
    userName: '王弘炜',
    jobNumber: '5669',
    eventDepartment: '神经科',
    applicant: '王弘炜 - 5669',
    score: 1,
    amount: 0,
    eventTime: '2026-01-24',
    behaviorDescription: '收到患者表扬信，服务态度优良，拟申请加分。',
    eventSummary: '门诊患者实名表扬窗口服务，已提交审核。',
    evidenceMaterial: '表扬信.pdf',
    processStatus: '待审核人审批。',
  },
  {
    id: 2,
    status: '审核中',
    assessmentYear: '2026',
    userName: '朱云',
    jobNumber: '0333',
    eventDepartment: '消化内科',
    applicant: '朱云 - 0333',
    score: 10,
    amount: 0,
    eventTime: '2026-01-07',
    behaviorDescription: '及时协助处理患者突发情况，拟申请加分。',
    eventSummary: '病区突发事件处置及时，科室已提交审核。',
    evidenceMaterial: '情况说明.docx',
    processStatus: '待审核人审批。',
  },
  {
    id: 3,
    status: '审核中',
    assessmentYear: '2025',
    userName: '王华',
    jobNumber: '0028',
    eventDepartment: '心血管内科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-09',
    behaviorDescription: '主动参与危重患者抢救并表现突出。',
    eventSummary: '抢救记录完整，待审核确认。',
    evidenceMaterial: '抢救记录.pdf',
    processStatus: '待审核人审批。',
  },
  {
    id: 4,
    status: '审核中',
    assessmentYear: '2025',
    userName: '邱建伟',
    jobNumber: '0029',
    eventDepartment: '心血管内科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-10',
    behaviorDescription: '获患者书面感谢，拟申请加分。',
    eventSummary: '群众来信表扬，材料齐全。',
    evidenceMaterial: '感谢信.pdf',
    processStatus: '待审核人审批。',
  },
  {
    id: 5,
    status: '审核中',
    assessmentYear: '2025',
    userName: '尹江斌',
    jobNumber: '0030',
    eventDepartment: '心血管内科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-11',
    behaviorDescription: '窗口服务群众满意度高，拟申请加分。',
    eventSummary: '满意度回访问卷结果较好，待审核。',
    evidenceMaterial: '满意度回访表.xlsx',
    processStatus: '待审核人审批。',
  },
  {
    id: 6,
    status: '审核中',
    assessmentYear: '2025',
    userName: '朱江宁',
    jobNumber: '0031',
    eventDepartment: '心血管内科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-12',
    behaviorDescription: '科室协作表现突出，拟申请加分。',
    eventSummary: '多科协作救治完成，等待审核处理。',
    evidenceMaterial: '协作情况说明.docx',
    processStatus: '待审核人审批。',
  },
  {
    id: 7,
    status: '审核中',
    assessmentYear: '2025',
    userName: '朱云,朱志宏',
    jobNumber: '0333,0334',
    eventDepartment: '消化内科,消化内科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-03',
    behaviorDescription: '双人联动处置突发事件，拟申请加分。',
    eventSummary: '相关说明与附件均已上传。',
    evidenceMaterial: '事件说明.pdf',
    processStatus: '待审核人审批。',
  },
  {
    id: 8,
    status: '审核中',
    assessmentYear: '2025',
    userName: '易运海',
    jobNumber: '2723',
    eventDepartment: '心脏大血管外科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-10',
    behaviorDescription: '主动为患者提供延伸服务，拟申请加分。',
    eventSummary: '患者满意度回访记录已上传。',
    evidenceMaterial: '回访记录.pdf',
    processStatus: '待审核人审批。',
  },
  {
    id: 9,
    status: '审核中',
    assessmentYear: '2025',
    userName: '肖希,徐雨',
    jobNumber: '3264,3263',
    eventDepartment: '产科,产科',
    applicant: '王剑清 - 0026',
    score: 10,
    amount: 0,
    eventTime: '2025-12-24',
    behaviorDescription: '收到锦旗和表扬信，拟申请加分。',
    eventSummary: '科室申报材料齐全，待审核。',
    evidenceMaterial: '锦旗照片.zip',
    processStatus: '待审核人审批。',
  },
]

const cloneItem = (item: ScoreAuditItem): ScoreAuditItem => ({ ...item })

const filterList = (query: ScoreAuditQuery) => {
  const keyword = query.keywords.trim().toLowerCase()

  return scoreAuditStore.filter((item) => {
    if (!keyword) {
      return true
    }

    return [item.userName, item.jobNumber, item.eventDepartment, item.applicant].some((field) =>
      field.toLowerCase().includes(keyword),
    )
  })
}

const patchStatus = (ids: number[], status: ScoreAuditStatus, processStatus: string) => {
  scoreAuditStore = scoreAuditStore.map((item) => {
    if (!ids.includes(item.id)) {
      return item
    }

    return {
      ...item,
      status,
      processStatus,
    }
  })
}

export namespace ScoreAuditApi {
  export const getPage = async (query: ScoreAuditQuery): Promise<ScoreAuditPageData> => {
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 10
    const filteredList = filterList(query)
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
      pages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  export const approveOne = async ({ id }: { id: number }) => {
    patchStatus([id], '已通过', '审核通过，待后续归档。')
  }

  export const rejectOne = async ({ id }: { id: number }) => {
    patchStatus([id], '已驳回', '审核驳回，待申报人补充后重新提交。')
  }

  export const approveBatch = async ({ ids }: { ids: number[] }) => {
    patchStatus(ids, '已通过', '批量审核通过，待后续归档。')
  }

  export const rejectBatch = async ({ ids }: { ids: number[] }) => {
    patchStatus(ids, '已驳回', '批量审核驳回，待申报人补充后重新提交。')
  }
}
