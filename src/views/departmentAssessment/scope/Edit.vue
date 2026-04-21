<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="scopeSave.editorTitle.value"
    style="width: 760px"
    :mask-closable="false"
  >
    <DepartmentAssessmentScopeForm ref="formRef" v-model="scopeSave.form" :department-options="scopeSave.departmentOptions.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="scopeSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="scopeSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DepartmentAssessmentScopeForm from './components/DepartmentAssessmentScopeForm.vue'
import { useDepartmentAssessmentScopeModule } from './src/hooks/scope'
import { editModal } from './src/service/scope'

const { scopeSave } = useDepartmentAssessmentScopeModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    scopeSave.saveOne().then((success) => {
      if (success) {
        scopeSave.closeEdit()
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
