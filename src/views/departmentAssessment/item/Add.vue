<template>
  <n-modal
    v-model:show="addModal.status"
    preset="card"
    title="新增科室考评项目"
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
        <n-button @click="itemSave.closeAdd()">取消</n-button>
        <n-button type="info" :loading="itemSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DepartmentAssessmentItemForm from './components/DepartmentAssessmentItemForm.vue'
import { useDepartmentAssessmentItemModule } from './src/hooks/item'
import { addModal } from './src/service/item'

const { itemSave } = useDepartmentAssessmentItemModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    itemSave.saveOne().then((success) => {
      if (success) {
        itemSave.closeAdd()
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
