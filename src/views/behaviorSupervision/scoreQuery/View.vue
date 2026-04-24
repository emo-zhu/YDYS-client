<template>
  <step-modal
    v-model:show="viewModal.status"
    v-model:value="viewModal.stepIndex"
    title="详情"
    :disableClick="true"
  >
    <step-modal-item label="基本信息" value="1" center>
      <ScoreQueryDetail :info="scoreQueryDetail.info.value" />
      <template #footer>
        <n-space>
          <j-button round type="info" @click="scoreQueryDetail.closeView()">关闭</j-button>
        </n-space>
      </template>
    </step-modal-item>
  </step-modal>
</template>

<script lang="ts" setup>
import ScoreQueryDetail from './components/ScoreQueryDetail.vue'
import { useScoreQueryModule } from './src/hooks/scoreQuery'
import { viewModal } from './src/service/scoreQuery'

const { scoreQueryDetail } = useScoreQueryModule()
</script>
