<template>
  <n-modal v-model:show="addModal.status" preset="card" title="新增" style="width: 730px" :mask-closable="false">
    <ResultReviewForm ref="formRef" v-model="resultReviewSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="resultReviewSave.closeAdd()">取消</n-button>
        <n-button type="info" :loading="resultReviewSave.loading.value" @click="onSave">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ResultReviewForm from './components/ResultReviewForm.vue'
import { useResultReviewModule } from './src/hooks/resultReview'
import { addModal } from './src/service/resultReview'

const { resultReviewSave } = useResultReviewModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    resultReviewSave.saveOne().then((success) => {
      if (success) {
        resultReviewSave.closeAdd()
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
