<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="自查自纠报告详情"
    style="width: 720px"
    :mask-closable="false"
  >
    <SelfCheckDetail :model="selfCheckDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="selfCheckDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import SelfCheckDetail from './components/SelfCheckDetail.vue'
import { useSelfCheckModule } from './src/hooks/selfCheck'
import { viewModal } from './src/service/selfCheck'

const { selfCheckDetail } = useSelfCheckModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
