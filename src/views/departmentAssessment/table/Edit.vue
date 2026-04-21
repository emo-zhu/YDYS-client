<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="tableSave.editorTitle.value"
    style="width: 720px"
    :mask-closable="false"
  >
    <DepartmentAssessmentTableForm ref="formRef" v-model="tableSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="tableSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="tableSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DepartmentAssessmentTableForm from './components/DepartmentAssessmentTableForm.vue'
import { useDepartmentAssessmentTableModule } from './src/hooks/table'
import { editModal } from './src/service/table'

const { tableSave } = useDepartmentAssessmentTableModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    tableSave.saveOne().then((success) => {
      if (success) {
        tableSave.closeEdit()
      }
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
