import type { PersonalCommitmentForm, PersonalCommitmentItem } from '../types/personalCommitment'

const defaultContent = [
  '为进一步加强医德医风建设，规范医疗服务行为，维护人民群众健康权益，本人郑重作出如下承诺：',
  '一、严格遵守国家法律法规、行业规范和医院各项规章制度，依法执业，规范行医，恪守职业道德。',
  '二、坚持以患者为中心，文明服务、廉洁从业，不收受患者及家属红包、礼品、礼金、有价证券和其他不正当利益。',
  '三、坚持合理检查、合理治疗、合理用药，不开大处方，不做不必要检查，不谋取不当经济利益。',
  '四、严守廉洁纪律，不利用职务便利为本人及亲属谋取私利，不参与任何损害群众利益和医院形象的行为。',
  '五、自觉接受组织和群众监督，如违反以上承诺，本人愿意承担相应责任。'
]

let personalCommitmentStore: PersonalCommitmentItem = {
  id: 1,
  title: '医务人员廉洁行医承诺书',
  status: '进行中',
  startTime: '2025-08-21 22:15:39',
  rejectReason: '未通过',
  actionText: '开始签署承诺书',
  personName: '张雅婷',
  personCode: '6420',
  department: '党委办公室',
  content: defaultContent,
  signatureName: '',
  signedAt: ''
}

const cloneItem = (item: PersonalCommitmentItem): PersonalCommitmentItem => ({
  ...item,
  content: [...item.content]
})

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const createDefaultPersonalCommitmentForm = (): PersonalCommitmentForm => ({
  signatureName: ''
})

export namespace PersonalCommitmentApi {
  export const getCurrent = async () => cloneItem(personalCommitmentStore)

  export const getDetails = async ({ id }: { id?: number | null }) => {
    if (id !== personalCommitmentStore.id) {
      return undefined
    }
    return cloneItem(personalCommitmentStore)
  }

  export const signOne = async (form: PersonalCommitmentForm) => {
    if (!form.id || form.id !== personalCommitmentStore.id) {
      return
    }
    personalCommitmentStore = {
      ...personalCommitmentStore,
      signatureName: form.signatureName.trim(),
      signedAt: formatDateTime(Date.now())
    }
  }
}
