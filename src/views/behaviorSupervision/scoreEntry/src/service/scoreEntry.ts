import { reactive, ref } from 'vue'
import { StepModalFactory } from 'junegoo-ui'
import type { ScoreEntryMode } from '../types/scoreEntry'

export const addModal = reactive(new StepModalFactory())
export const editModal = reactive(new StepModalFactory())
export const viewModal = reactive(new StepModalFactory())

export const currentEditId = ref<number | null>(null)
export const currentAddMode = ref<ScoreEntryMode>('plus')
