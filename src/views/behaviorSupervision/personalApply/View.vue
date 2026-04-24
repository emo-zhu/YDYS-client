<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="详情"
    style="width: 960px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <PersonalApplyDetail :info="personalApplyDetail.info.value" />
    <template #footer>
      <div class="detail-footer">
        <n-button type="info" @click="personalApplyDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import PersonalApplyDetail from './components/PersonalApplyDetail.vue'
import { usePersonalApplyModule } from './src/hooks/personalApply'
import { viewModal } from './src/service/personalApply'

const { personalApplyDetail } = usePersonalApplyModule()
</script>

<style scoped lang="scss">
.detail-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
