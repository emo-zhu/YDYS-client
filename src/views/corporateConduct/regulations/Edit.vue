<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="regulationSave.editorTitle.value"
    style="width: 620px"
    :mask-closable="false"
  >
    <RegulationForm ref="formRef" v-model="regulationSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="regulationSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="regulationSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import RegulationForm from './components/RegulationForm.vue'
import { useRegulationModule } from './src/hooks/regulation'
import { editModal } from './src/service/regulation'

const { regulationSave } = useRegulationModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    regulationSave.saveOne().then((success) => {
      if (success) {
        regulationSave.closeEdit()
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
