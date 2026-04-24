<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="128"
    class="score-entry-form"
  >
    <div class="score-entry-form__grid">
      <n-form-item class="score-entry-form__item" label="考核年度" path="assessmentYear">
        <n-select v-model:value="model.assessmentYear" :options="assessmentYearOptions" placeholder="请选择" />
      </n-form-item>
      <n-form-item class="score-entry-form__item" label="行为类型">
        <n-input :value="model.behaviorType === 'minus' ? '减分行为' : '加分行为'" readonly />
      </n-form-item>
      <n-form-item class="score-entry-form__item score-entry-form__item--full" label="加减分条款" path="clauseId">
        <n-select
          v-model:value="model.clauseId"
          :options="clauseSelectOptions"
          placeholder="请选择"
          @update:value="handleClauseChange"
        />
      </n-form-item>
      <n-form-item class="score-entry-form__item" label="行为分值" path="score">
        <n-input-number v-model:value="model.score" :show-button="false" readonly style="width: 100%" />
      </n-form-item>
      <n-form-item class="score-entry-form__item" label="录入对象" path="reportTargetId">
        <n-select
          v-model:value="model.reportTargetId"
          :options="reportTargetOptions"
          placeholder="请选择"
          @update:value="handleTargetChange"
        />
      </n-form-item>
      <n-form-item class="score-entry-form__item" label="事件发生日期" path="eventTime">
        <n-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          v-model:formatted-value="model.eventTime"
          clearable
        />
      </n-form-item>
      <n-form-item class="score-entry-form__item" label="事件发生科室" path="eventDepartment">
        <n-input v-model:value="model.eventDepartment" placeholder="请输入" />
      </n-form-item>
      <n-form-item class="score-entry-form__item score-entry-form__item--full" label="事件概述" path="eventSummary">
        <n-input
          v-model:value="model.eventSummary"
          type="textarea"
          maxlength="1000"
          show-count
          :autosize="{ minRows: 4, maxRows: 6 }"
          placeholder="请输入事件概述，最大字数1000"
        />
      </n-form-item>
      <n-form-item class="score-entry-form__item score-entry-form__item--full" label="上传佐证材料" path="evidenceMaterials">
        <j-upload v-model:value="model.evidenceMaterials" :imageUpload="false" :options="{ type: 'ALL' }" />
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { computed, ref } from 'vue'
import type { ScoreEntryClauseOption, ScoreEntryForm, ScoreEntryTargetOption } from '../src/types/scoreEntry'

const props = defineProps<{
  assessmentYearOptions: Array<{ label: string; value: string }>
  clauseOptions: ScoreEntryClauseOption[]
  reportTargetOptions: ScoreEntryTargetOption[]
}>()

const model = defineModel<ScoreEntryForm>({
  default: {
    behaviorType: 'plus',
    assessmentYear: '2026',
    clauseId: null,
    score: 1,
    reportTargetId: null,
    eventTime: null,
    eventDepartment: '',
    eventSummary: '',
    evidenceMaterials: '',
  },
})

const formRef = ref<FormInst | null>(null)

const clauseSelectOptions = computed(() =>
  props.clauseOptions
    .filter((item) => item.mode === model.value.behaviorType)
    .map((item) => ({
      label: item.label,
      value: item.value,
    })),
)

const handleClauseChange = (value: string | null) => {
  const clause = props.clauseOptions.find((item) => item.value === value)
  model.value.score = clause?.score || 0
}

const handleTargetChange = (value: string | null) => {
  const target = props.reportTargetOptions.find((item) => item.value === value)
  if (!target) {
    return
  }
  model.value.eventDepartment = target.department
}

const rules: FormRules = {
  clauseId: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择加减分条款',
  },
  reportTargetId: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择录入对象',
  },
  eventTime: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择事件发生日期',
  },
  eventSummary: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入事件概述',
  },
  evidenceMaterials: {
    required: true,
    trigger: ['change', 'blur'],
    validator: () => {
      if (!model.value.evidenceMaterials) {
        return new Error('请上传佐证材料')
      }

      try {
        const files = JSON.parse(model.value.evidenceMaterials) as Array<{ name?: string }>
        return files.length ? true : new Error('请上传佐证材料')
      } catch {
        return new Error('请上传佐证材料')
      }
    },
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
.score-entry-form {
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
  .score-entry-form {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__item--full {
      grid-column: auto;
    }
  }
}
</style>
