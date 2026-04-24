<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="录入详情"
    style="width: 920px; max-width: calc(100vw - 48px)"
    :mask-closable="false"
  >
    <n-descriptions v-if="scoreEntryView.info.value" label-placement="left" :column="1" bordered>
      <n-descriptions-item label="状态">{{ scoreEntryView.info.value.status }}</n-descriptions-item>
      <n-descriptions-item label="考核年度">{{ scoreEntryView.info.value.assessmentYear }}</n-descriptions-item>
      <n-descriptions-item label="姓名">{{ scoreEntryView.info.value.userName }}</n-descriptions-item>
      <n-descriptions-item label="工号">{{ scoreEntryView.info.value.jobNumber }}</n-descriptions-item>
      <n-descriptions-item label="事件发生科室">{{ scoreEntryView.info.value.eventDepartment }}</n-descriptions-item>
      <n-descriptions-item label="审核人">{{ scoreEntryView.info.value.reviewer }}</n-descriptions-item>
      <n-descriptions-item label="加减分">{{ scoreEntryView.info.value.score > 0 ? `+ ${scoreEntryView.info.value.score}` : scoreEntryView.info.value.score }}</n-descriptions-item>
      <n-descriptions-item label="事件发生时间">{{ scoreEntryView.info.value.eventTime }}</n-descriptions-item>
      <n-descriptions-item label="行为描述">{{ scoreEntryView.info.value.behaviorDescription }}</n-descriptions-item>
      <n-descriptions-item label="事件概述">{{ scoreEntryView.info.value.eventSummary }}</n-descriptions-item>
      <n-descriptions-item label="佐证材料">{{ scoreEntryView.info.value.evidenceMaterial || '-' }}</n-descriptions-item>
      <n-descriptions-item label="流程状态">{{ scoreEntryView.info.value.processStatus }}</n-descriptions-item>
    </n-descriptions>
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="scoreEntryView.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useScoreEntryModule } from './src/hooks/scoreEntry'
import { viewModal } from './src/service/scoreEntry'

const { scoreEntryView } = useScoreEntryModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
