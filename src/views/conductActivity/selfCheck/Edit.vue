<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="selfCheckSave.editorTitle.value"
    style="width: 720px"
    :mask-closable="false"
  >
    <SelfCheckForm ref="formRef" v-model="selfCheckSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="selfCheckSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="selfCheckSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SelfCheckForm from './components/SelfCheckForm.vue'
import { useSelfCheckModule } from './src/hooks/selfCheck'
import { editModal } from './src/service/selfCheck'

const { selfCheckSave } = useSelfCheckModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    selfCheckSave.saveOne().then((success) => {
      if (success) {
        selfCheckSave.closeEdit()
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
