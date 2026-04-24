<template>
  <step-modal
    v-model:show="viewModal.status"
    v-model:value="viewModal.stepIndex"
    title="详情"
    :disableClick="true"
  >
    <step-modal-item label="基本信息" value="1" center>
      <ScoreAuditDetail :info="scoreAuditDetail.info.value" />
      <template #footer>
        <n-space>
          <j-button round type="info" @click="scoreAuditDetail.closeView()">关闭</j-button>
        </n-space>
      </template>
    </step-modal-item>
  </step-modal>
</template>

<script lang="ts" setup>
import ScoreAuditDetail from './components/ScoreAuditDetail.vue'
import { useScoreAuditModule } from './src/hooks/scoreAudit'
import { viewModal } from './src/service/scoreAudit'

const { scoreAuditDetail } = useScoreAuditModule()
</script>
