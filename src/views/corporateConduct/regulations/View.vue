<template>
  <n-modal v-model:show="viewModal.status" preset="card" title="制度文件详情" style="width: 620px" :mask-closable="false">
    <RegulationDetail :model="regulationView.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="regulationView.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import RegulationDetail from './components/RegulationDetail.vue'
import { useRegulationModule } from './src/hooks/regulation'
import { viewModal } from './src/service/regulation'

const { regulationView } = useRegulationModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
