<template>
  <step-modal
    v-model:show="addModal.status"
    v-model:value="addModal.stepIndex"
    :title="rulesSave.editorTitle.value"
    :disableClick="true"
  >
    <step-modal-item label="基本信息" value="1" center>
      <BehaviorRuleForm
        ref="formRef"
        v-model="rulesSave.form"
        :rule-type-options="rulesSave.ruleTypeOptions"
        :rule-target-options="rulesSave.ruleTargetOptions"
        :rule-category-options="rulesSave.formTab.value === 'plus' ? rulesSave.plusRuleCategoryOptions : rulesSave.minusRuleCategoryOptions"
        :rule-attribute-options="rulesSave.formTab.value === 'plus' ? rulesSave.plusRuleAttributeOptions : rulesSave.minusRuleAttributeOptions"
        :rule-user-options="rulesSave.ruleUserOptions"
        :score-type-options="rulesSave.scoreTypeOptions"
        :sync-label="rulesSave.formTab.value === 'plus' ? '科室是否同步加分' : '科室是否同步减分'"
      />
      <template #footer>
        <n-space>
          <j-button round @click="rulesSave.closeAdd()">取消</j-button>
          <j-button round type="info" :loading="rulesSave.loading.value" @click="onSave">确定</j-button>
        </n-space>
      </template>
    </step-modal-item>
  </step-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BehaviorRuleForm from './components/BehaviorRuleForm.vue'
import { useBehaviorRuleModule } from './src/hooks/rules'
import { addModal } from './src/service/rules'

const { rulesSave } = useBehaviorRuleModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    rulesSave.saveAdd().then((success) => {
      if (success) {
        rulesSave.closeAdd()
      }
    })
  })
}
</script>
