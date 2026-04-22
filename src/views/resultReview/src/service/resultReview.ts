import { reactive, ref } from 'vue'
import { StepModalFactory } from 'junegoo-ui'

export const RESULT_REVIEW_STATUS_TEXT: Record<string, string> = {
  pending: '待审查',
  completed: '已完成'
}

export const addModal = reactive(new StepModalFactory())
export const editModal = reactive(new StepModalFactory())
export const viewModal = reactive(new StepModalFactory())

export const currentEditId = ref<number | null>(null)
export const currentViewId = ref<number | null>(null)
