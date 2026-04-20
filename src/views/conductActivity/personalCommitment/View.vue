<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    :title="personalCommitmentDetail.viewerTitle.value"
    style="width: 920px"
    :mask-closable="false"
  >
    <PersonalCommitmentDetail :model="personalCommitmentDetail.info.value" readonly />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="personalCommitmentDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import PersonalCommitmentDetail from './components/PersonalCommitmentDetail.vue'
import { usePersonalCommitmentModule } from './src/hooks/personalCommitment'
import { viewModal } from './src/service/personalCommitment'

const { personalCommitmentDetail } = usePersonalCommitmentModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
