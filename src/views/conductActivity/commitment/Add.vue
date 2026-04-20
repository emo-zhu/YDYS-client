<template>
  <n-modal
    v-model:show="addModal.status"
    preset="card"
    title="新增自查自纠报告"
    style="width: 720px"
    :mask-closable="false"
  >
    <CommitmentForm ref="formRef" v-model="commitmentSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="commitmentSave.closeAdd()">取消</n-button>
        <n-button type="info" :loading="commitmentSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CommitmentForm from './components/CommitmentForm.vue'
import { useCommitmentModule } from './src/hooks/commitment'
import { addModal } from './src/service/commitment'

const { commitmentSave } = useCommitmentModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    commitmentSave.saveOne().then((success) => {
      if (success) {
        commitmentSave.closeAdd()
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
