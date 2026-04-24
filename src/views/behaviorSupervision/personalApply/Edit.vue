<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    title="编辑"
    style="width: 1080px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <PersonalApplyForm
      ref="formRef"
      v-model="personalApplySave.form"
      :assessment-year-options="personalApplySave.assessmentYearOptions"
      :clause-options="personalApplySave.clauseOptions"
      :report-target-options="personalApplySave.reportTargetOptions"
    />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="personalApplySave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="personalApplySave.loading.value" @click="onSave">
          确定
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PersonalApplyForm from './components/PersonalApplyForm.vue'
import { usePersonalApplyModule } from './src/hooks/personalApply'
import { editModal } from './src/service/personalApply'

const { personalApplySave } = usePersonalApplyModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    personalApplySave.saveOne().then((success) => {
      if (success) {
        personalApplySave.closeEdit()
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
