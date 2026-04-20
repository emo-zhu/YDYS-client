export type PersonalCommitmentStatus = '进行中' | '已完成'

export interface PersonalCommitmentItem {
  id: number
  title: string
  status: PersonalCommitmentStatus
  startTime: string
  rejectReason: string
  actionText: string
  personName: string
  personCode: string
  department: string
  content: string[]
  signatureName: string
  signedAt: string
}

export interface PersonalCommitmentForm {
  id?: number
  signatureName: string
}
