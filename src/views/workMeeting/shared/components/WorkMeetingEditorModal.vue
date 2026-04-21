<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :title="title"
    style="width: 860px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <WorkMeetingForm ref="formRef" v-model="module.save.form" :type="type" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="onCancel">取消</n-button>
        <n-button type="info" :loading="module.save.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import WorkMeetingForm from './WorkMeetingForm.vue'
import { useWorkMeetingModule } from '../hooks'
import type { WorkMeetingType } from '../types'

const props = defineProps<{
  type: WorkMeetingType
  mode: 'add' | 'edit'
}>()

const { type } = props
const module = useWorkMeetingModule(props.type)
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const show = computed({
  get: () => (props.mode === 'add' ? module.modal.addModal.status : module.modal.editModal.status),
  set: (value: boolean) => {
    if (props.mode === 'add') {
      module.modal.addModal.status = value
      return
    }
    module.modal.editModal.status = value
  }
})

const title = computed(() =>
  props.mode === 'add' ? `新增${module.config.title}` : module.save.editorTitle.value
)

const onCancel = () => {
  if (props.mode === 'add') {
    module.save.closeAdd()
    return
  }
  module.save.closeEdit()
}

const onSave = () => {
  formRef.value?.getData().then(() => {
    module.save.saveOne().then((success) => {
      if (!success) {
        return
      }

      if (props.mode === 'add') {
        module.save.closeAdd()
        return
      }

      module.save.closeEdit()
    })
  })
}
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
