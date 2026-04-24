<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="136"
    class="behavior-rule-form"
  >
    <div class="behavior-rule-form__grid">
      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="规则类型" path="ruleType">
        <n-radio-group v-model:value="model.ruleType">
          <n-space>
            <n-radio
              v-for="item in ruleTypeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="选择规则对象" path="targetType">
        <n-radio-group v-model:value="model.targetType">
          <n-space>
            <n-radio
              v-for="item in ruleTargetOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="规则名称" path="ruleName">
        <n-input
          v-model:value="model.ruleName"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          maxlength="100"
          show-count
          placeholder="请输入"
        />
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="选择规则分类" path="parentRuleId">
        <n-select
          v-model:value="model.parentRuleId"
          :options="ruleCategoryOptions"
          placeholder="请选择"
        />
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="规则属性" path="ruleAttribute">
        <n-select
          v-model:value="model.ruleAttribute"
          :options="ruleAttributeOptions"
          clearable
          placeholder="请选择"
        />
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" :label="syncLabel || '科室是否同步加分'">
        <n-radio-group v-model:value="model.departmentSync">
          <n-space>
            <n-radio :value="true">是</n-radio>
            <n-radio :value="false">否</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="规则录入人" path="creatorId">
        <n-select
          v-model:value="model.creatorId"
          :options="ruleUserOptions"
          clearable
          filterable
          placeholder="请选择"
        />
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="规则审核人" path="reviewerId">
        <n-select
          v-model:value="model.reviewerId"
          :options="ruleUserOptions"
          clearable
          filterable
          placeholder="请选择"
        />
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="分值类型" path="scoreType">
        <n-radio-group v-model:value="model.scoreType" @update:value="handleScoreTypeChange">
          <n-space>
            <n-radio
              v-for="item in scoreTypeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item
        v-if="model.scoreType === 'fixed'"
        class="behavior-rule-form__item behavior-rule-form__item--full"
        label="固定分值"
        path="fixedScore"
      >
        <n-input-number
          v-model:value="model.fixedScore"
          :precision="2"
          :show-button="false"
          placeholder="请输入"
          style="width: 100%"
        />
      </n-form-item>

      <n-form-item
        v-if="model.scoreType === 'range'"
        class="behavior-rule-form__item"
        label="最低分"
        path="minScore"
      >
        <n-input-number
          v-model:value="model.minScore"
          :precision="2"
          :show-button="false"
          placeholder="请输入"
          style="width: 100%"
        />
      </n-form-item>

      <n-form-item
        v-if="model.scoreType === 'range'"
        class="behavior-rule-form__item"
        label="最高分"
        path="maxScore"
      >
        <n-input-number
          v-model:value="model.maxScore"
          :precision="2"
          :min="Number(model.minScore || 0)"
          :show-button="false"
          placeholder="请输入"
          style="width: 100%"
        />
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="限制累计加分">
        <n-radio-group v-model:value="model.limitAccumulated">
          <n-space>
            <n-radio :value="true">是</n-radio>
            <n-radio :value="false">否</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="是否允许科室填报">
        <n-radio-group v-model:value="model.allowDepartmentReport">
          <n-space>
            <n-radio :value="true">是</n-radio>
            <n-radio :value="false">否</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="是否填写金额">
        <n-radio-group v-model:value="model.fillAmount">
          <n-space>
            <n-radio :value="true">是</n-radio>
            <n-radio :value="false">否</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item class="behavior-rule-form__item behavior-rule-form__item--full" label="规则生效日期" path="effectiveDate">
        <n-date-picker
          v-model:formatted-value="model.effectiveDate"
          type="date"
          value-format="yyyy-MM-dd"
          clearable
        />
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import type {
  BehaviorRuleForm,
  BehaviorRuleOption,
  BehaviorRuleScoreType,
  BehaviorRuleUserOption,
} from '../src/types/rules'

defineProps<{
  ruleTypeOptions: BehaviorRuleOption[]
  ruleTargetOptions: BehaviorRuleOption[]
  ruleCategoryOptions: BehaviorRuleOption<number>[]
  ruleAttributeOptions: BehaviorRuleOption[]
  ruleUserOptions: BehaviorRuleUserOption[]
  scoreTypeOptions: BehaviorRuleOption[]
  syncLabel?: string
}>()

const model = defineModel<BehaviorRuleForm>({
  default: {
    ruleType: 'detail',
    targetType: 'person',
    ruleName: '',
    parentRuleId: 1,
    ruleAttribute: null,
    departmentSync: false,
    creatorId: null,
    reviewerId: null,
    scoreType: 'fixed',
    fixedScore: 0,
    minScore: null,
    maxScore: null,
    limitAccumulated: false,
    allowDepartmentReport: true,
    fillAmount: false,
    effectiveDate: '2026-04-23',
  },
})

const formRef = ref<FormInst | null>(null)

const handleScoreTypeChange = (value: BehaviorRuleScoreType) => {
  if (value === 'fixed') {
    model.value.minScore = null
    model.value.maxScore = null
    return
  }
  model.value.fixedScore = 0
}

const rules: FormRules = {
  ruleName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入规则名称',
  },
  parentRuleId: {
    required: true,
    type: 'number',
    trigger: ['change', 'blur'],
    message: '请选择规则分类',
  },
  creatorId: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择规则录入人',
  },
  reviewerId: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择规则审核人',
  },
  fixedScore: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (model.value.scoreType !== 'fixed') {
        return true
      }
      return model.value.fixedScore === null || model.value.fixedScore === undefined
        ? new Error('请输入固定分值')
        : true
    },
  },
  minScore: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (model.value.scoreType !== 'range') {
        return true
      }
      return model.value.minScore === null || model.value.minScore === undefined
        ? new Error('请输入最低分')
        : true
    },
  },
  maxScore: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (model.value.scoreType !== 'range') {
        return true
      }
      if (model.value.maxScore === null || model.value.maxScore === undefined) {
        return new Error('请输入最高分')
      }
      if (Number(model.value.maxScore) < Number(model.value.minScore || 0)) {
        return new Error('最高分不能小于最低分')
      }
      return true
    },
  },
  effectiveDate: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择规则生效日期',
  },
}

const getData = () => new Promise((resolve, reject) => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      resolve(true)
      return
    }
    window.$message?.warning('请完善表单内容')
    reject(false)
  })
})

defineExpose({ getData })
</script>

<style scoped lang="scss">
.behavior-rule-form {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 24px;
    row-gap: 8px;
  }

  &__item {
    min-width: 0;
  }

  &__item--full {
    grid-column: 1 / -1;
  }

  :deep(.n-form-item) {
    margin-bottom: 0;
  }

  :deep(.n-form-item-label) {
    white-space: nowrap;
    justify-content: flex-end;
    padding-right: 16px;
  }

  :deep(.n-input),
  :deep(.n-base-selection),
  :deep(.n-date-picker),
  :deep(.n-input-number) {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .behavior-rule-form {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__item--full {
      grid-column: auto;
    }
  }
}
</style>
