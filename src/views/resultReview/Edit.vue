<template>
  <n-modal v-model:show="editModal.status" preset="card" title="编辑" style="width: 730px" :mask-closable="false">
    <ResultReviewForm ref="formRef" v-model="resultReviewSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="resultReviewSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="resultReviewSave.loading.value" @click="onSave">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ResultReviewForm from './components/ResultReviewForm.vue'
import { useResultReviewModule } from './src/hooks/resultReview'
import { editModal } from './src/service/resultReview'

const { resultReviewSave } = useResultReviewModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    resultReviewSave.saveOne().then((success) => {
      if (success) {
        resultReviewSave.closeEdit()
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
