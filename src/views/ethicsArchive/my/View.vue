<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="我的医德档案详情"
    style="width: 760px"
    :mask-closable="false"
  >
    <EthicsArchiveDetail :model="archiveDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="archiveDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import EthicsArchiveDetail from './components/EthicsArchiveDetail.vue'
import { useEthicsArchiveModule } from './src/hooks/archive'
import { viewModal } from './src/service/archive'

const { archiveDetail } = useEthicsArchiveModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
