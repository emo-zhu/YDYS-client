<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="activitySave.editorTitle.value"
    style="width: 840px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <ActivityForm ref="formRef" v-model="activitySave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="activitySave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="activitySave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ActivityForm from './components/ActivityForm.vue'
import { useActivityModule } from './src/hooks/activity'
import { editModal } from './src/service/activity'

const { activitySave } = useActivityModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    activitySave.saveOne().then(() => {
      activitySave.closeEdit()
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
