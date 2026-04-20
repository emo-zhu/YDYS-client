<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="自查自纠报告详情"
    style="width: 720px"
    :mask-closable="false"
  >
    <CommitmentDetail :model="commitmentDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="commitmentDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import CommitmentDetail from './components/CommitmentDetail.vue'
import { useCommitmentModule } from './src/hooks/commitment'
import { viewModal } from './src/service/commitment'

const { commitmentDetail } = useCommitmentModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
