<template>
  <step-modal
    v-model:show="viewModal.status"
    v-model:value="viewModal.stepIndex"
    title="规则详情"
    :disableClick="true"
  >
    <step-modal-item label="基本信息" value="1" center>
      <BehaviorRuleDetail :info="rulesDetail.info.value" :loading="rulesDetail.loading.value" />
      <template #footer>
        <n-space>
          <j-button round type="info" @click="rulesDetail.closeView()">关闭</j-button>
        </n-space>
      </template>
    </step-modal-item>
  </step-modal>
</template>

<script lang="ts" setup>
import BehaviorRuleDetail from './components/BehaviorRuleDetail.vue'
import { useBehaviorRuleModule } from './src/hooks/rules'
import { viewModal } from './src/service/rules'

const { rulesDetail } = useBehaviorRuleModule()
</script>
