import { reactive } from 'vue'
import { StepModalFactory } from 'junegoo-ui'

export const addModal = reactive(new StepModalFactory())
export const editModal = reactive(new StepModalFactory())
export const viewModal = reactive(new StepModalFactory())
