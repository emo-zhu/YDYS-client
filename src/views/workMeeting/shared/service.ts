import { StepModalFactory } from 'junegoo-ui'
import { reactive, ref } from 'vue'
import type { WorkMeetingType } from './types'

interface WorkMeetingServiceState {
  addModal: StepModalFactory
  editModal: StepModalFactory
  viewModal: StepModalFactory
  currentEditId: ReturnType<typeof ref<number | null>>
  currentViewId: ReturnType<typeof ref<number | null>>
}

const serviceMap = new Map<WorkMeetingType, WorkMeetingServiceState>()

export const getWorkMeetingService = (type: WorkMeetingType) => {
  if (!serviceMap.has(type)) {
    serviceMap.set(type, {
      addModal: reactive(new StepModalFactory()),
      editModal: reactive(new StepModalFactory()),
      viewModal: reactive(new StepModalFactory()),
      currentEditId: ref<number | null>(null),
      currentViewId: ref<number | null>(null)
    })
  }

  return serviceMap.get(type)!
}
