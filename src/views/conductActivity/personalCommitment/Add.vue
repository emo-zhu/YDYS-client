<template>
  <n-modal
    v-model:show="addModal.status"
    preset="card"
    :title="personalCommitmentSave.editorTitle.value"
    style="width: 920px"
    :mask-closable="false"
  >
    <PersonalCommitmentDetail
      :model="personalCommitmentPage.info.value"
      v-model:signature-name="personalCommitmentSave.form.signatureName"
    />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="personalCommitmentSave.closeAdd()">关闭</n-button>
        <n-button type="info" :loading="personalCommitmentSave.loading.value" @click="onSave">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import PersonalCommitmentDetail from './components/PersonalCommitmentDetail.vue'
import { usePersonalCommitmentModule } from './src/hooks/personalCommitment'
import { addModal } from './src/service/personalCommitment'

const { personalCommitmentPage, personalCommitmentSave } = usePersonalCommitmentModule()

const onSave = () => {
  personalCommitmentSave.saveOne().then((success) => {
    if (success) {
      personalCommitmentSave.closeAdd()
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
