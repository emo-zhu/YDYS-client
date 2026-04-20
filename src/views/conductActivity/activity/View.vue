<template>
  <n-modal v-model:show="viewModal.status" preset="card" title="活动详情" style="width: 680px" :mask-closable="false">
    <ActivityDetail :model="activityDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="activityDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import ActivityDetail from './components/ActivityDetail.vue'
import { useActivityModule } from './src/hooks/activity'
import { viewModal } from './src/service/activity'

const { activityDetail } = useActivityModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
