<template>
  <n-modal
    v-model:show="module.modal.viewModal.status"
    preset="card"
    :title="`${module.config.title}详情`"
    style="width: 760px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <WorkMeetingDetail :model="module.detail.info.value" :type="type" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="module.detail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import WorkMeetingDetail from './WorkMeetingDetail.vue'
import { useWorkMeetingModule } from '../hooks'
import type { WorkMeetingType } from '../types'

const props = defineProps<{
  type: WorkMeetingType
}>()

const { type } = props
const module = useWorkMeetingModule(props.type)
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
