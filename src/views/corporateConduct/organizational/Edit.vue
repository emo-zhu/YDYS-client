<template>
  <n-modal
    v-model:show="organizationalModal.summaryEditModal.status"
    preset="card"
    :title="`编辑${organizationalEdit.editingLabel.value}`"
    class="editor-modal"
    style="width: 560px"
    :mask-closable="false"
  >
    <SummaryEditorForm v-model="organizationalEdit.summaryForm" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="organizationalEdit.closeSummaryEdit()">取消</n-button>
        <n-button type="info" @click="onSaveSummaryEditor">保存</n-button>
      </div>
    </template>
  </n-modal>

  <n-modal
    v-model:show="organizationalModal.departmentEditModal.status"
    preset="card"
    title="编辑科室小组"
    class="editor-modal"
    style="width: 620px"
    :mask-closable="false"
  >
    <DepartmentEditorForm v-model="organizationalEdit.departmentForm" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="organizationalEdit.closeDepartmentEdit()">取消</n-button>
        <n-button type="info" @click="onSaveDepartmentEditor">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import SummaryEditorForm from './components/SummaryEditorForm.vue'
import DepartmentEditorForm from './components/DepartmentEditorForm.vue'
import { useOrganizationalModule } from './src/hooks/organizational'

const { organizationalEdit, organizationalModal } = useOrganizationalModule()

const onSaveSummaryEditor = () => {
  organizationalEdit.saveSummaryEdit().then((success) => {
    if (success) {
      organizationalEdit.closeSummaryEdit()
    }
  })
}

const onSaveDepartmentEditor = () => {
  organizationalEdit.saveDepartmentEdit().then((success) => {
    if (success) {
      organizationalEdit.closeDepartmentEdit()
    }
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
