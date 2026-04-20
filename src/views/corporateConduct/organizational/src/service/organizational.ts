import { reactive, ref } from 'vue'
import { StepModalFactory } from 'junegoo-ui'
import type { EditSource } from '../types/organizational'

export const addModal = reactive(new StepModalFactory())
export const summaryEditModal = reactive(new StepModalFactory())
export const departmentEditModal = reactive(new StepModalFactory())
export const viewModal = reactive(new StepModalFactory())

export const currentSummarySource = ref<EditSource>('leadership')
export const currentSummaryId = ref('')
export const currentDepartmentId = ref('')
export const currentViewDepartmentId = ref('')
