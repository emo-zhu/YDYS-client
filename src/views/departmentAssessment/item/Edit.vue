<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="itemSave.editorTitle.value"
    style="width: 820px"
    :mask-closable="false"
  >
    <DepartmentAssessmentItemForm
      ref="formRef"
      v-model="itemSave.form"
      :item-type-options="itemSave.itemTypeOptions"
      :clause-options="itemSave.clauseOptions"
    />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="itemSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="itemSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DepartmentAssessmentItemForm from './components/DepartmentAssessmentItemForm.vue'
import { useDepartmentAssessmentItemModule } from './src/hooks/item'
import { editModal } from './src/service/item'

const { itemSave } = useDepartmentAssessmentItemModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    itemSave.saveOne().then((success) => {
      if (success) {
        itemSave.closeEdit()
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
