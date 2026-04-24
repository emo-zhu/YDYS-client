<template>
  <step-modal
    v-model:show="supplementModal.status"
    v-model:value="supplementModal.stepIndex"
    title="补充修改行为"
    :disableClick="true"
  >
    <step-modal-item label="基本信息" value="1" center>
      <ScoreQuerySupplementForm
        ref="formRef"
        v-model="scoreQuerySupplement.form"
        :assessment-year-options="scoreQuerySupplement.assessmentYearOptions"
        :clause-options="scoreQuerySupplement.supplementClauseOptions"
      />
      <template #footer>
        <n-space>
          <j-button round @click="scoreQuerySupplement.close()">取消</j-button>
          <j-button round type="info" :loading="scoreQuerySupplement.loading.value" @click="onSave">确定</j-button>
        </n-space>
      </template>
    </step-modal-item>
  </step-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ScoreQuerySupplementForm from './components/ScoreQuerySupplementForm.vue'
import { supplementModal } from './src/service/scoreQuery'
import { useScoreQueryModule } from './src/hooks/scoreQuery'

const { scoreQuerySupplement } = useScoreQueryModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    scoreQuerySupplement.save().then((success) => {
      if (success) {
        scoreQuerySupplement.close()
      }
    })
  })
}
</script>
