<template>
  <n-modal
    v-model:show="addModal.status"
    preset="card"
    :title="scoreEntrySave.editorTitle.value"
    style="width: 1080px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <ScoreEntryForm
      ref="formRef"
      v-model="scoreEntrySave.form"
      :assessment-year-options="scoreEntrySave.assessmentYearOptions"
      :clause-options="scoreEntrySave.clauseOptions"
      :report-target-options="scoreEntrySave.reportTargetOptions"
    />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="scoreEntrySave.closeAdd()">取消</n-button>
        <n-button type="info" :loading="scoreEntrySave.loading.value" @click="onSave">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ScoreEntryForm from './components/ScoreEntryForm.vue'
import { useScoreEntryModule } from './src/hooks/scoreEntry'
import { addModal } from './src/service/scoreEntry'

const { scoreEntrySave } = useScoreEntryModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    scoreEntrySave.saveOne().then((success) => {
      if (success) {
        scoreEntrySave.closeAdd()
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
