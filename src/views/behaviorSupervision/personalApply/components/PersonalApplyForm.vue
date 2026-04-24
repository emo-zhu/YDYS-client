<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="128"
    class="personal-apply-form"
  >
    <div class="personal-apply-form__grid">
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="考核年度" path="assessmentYear">
        <n-select
          v-model:value="model.assessmentYear"
          :options="assessmentYearOptions"
          placeholder="请选择"
        />
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="加减分条款" path="clauseId">
        <n-select
          v-model:value="model.clauseId"
          :options="clauseSelectOptions"
          placeholder="请选择"
          @update:value="handleClauseChange"
        />
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="行为分值" path="score">
        <n-input-number
          v-model:value="model.score"
          :min="0"
          :show-button="false"
          readonly
          style="width: 100%"
        />
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="报送对象" path="reportTargetId">
        <n-select
          v-model:value="model.reportTargetId"
          :options="reportTargetOptions"
          placeholder="请选择"
          @update:value="handleTargetChange"
        />
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="事件发生日期" path="eventTime">
        <n-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          v-model:formatted-value="model.eventTime"
          clearable
        />
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="事件发生所在科室" path="eventDepartment">
        <n-input v-model:value="model.eventDepartment" placeholder="请输入" />
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="事件概述" path="eventSummary">
        <div class="personal-apply-form__textarea-wrap">
          <n-input
            v-model:value="model.eventSummary"
            type="textarea"
            maxlength="1000"
            show-count
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入事件概述，最大字数1000"
          />
        </div>
      </n-form-item>
      <n-form-item class="personal-apply-form__item personal-apply-form__item--full" label="上传佐证材料" path="evidenceMaterials">
        <j-upload
          v-model:value="model.evidenceMaterials"
          :imageUpload="false"
          :options="{ type: 'ALL' }"
        />
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { computed, ref } from 'vue'
import type { PersonalApplyForm } from '../src/types/personalApply'

const props = defineProps<{
  assessmentYearOptions: Array<{ label: string; value: string }>
  clauseOptions: Array<{ label: string; value: string; score: number }>
  reportTargetOptions: Array<{ label: string; value: string; userName: string; jobNumber: string; department: string }>
}>()

const model = defineModel<PersonalApplyForm>({
  default: {
    assessmentYear: '2026',
    clauseId: null,
    score: 0,
    reportTargetId: null,
    eventTime: null,
    eventDepartment: '党委办公室',
    eventSummary: '',
    evidenceMaterials: ''
  }
})

const formRef = ref<FormInst | null>(null)

const clauseSelectOptions = computed(() =>
  props.clauseOptions.map((item) => ({
    label: item.label,
    value: item.value
  }))
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
    message: '请选择加减分条款'
  },
  reportTargetId: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择报送对象'
  },
  eventTime: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择事件发生日期'
  },
  eventSummary: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入事件概述'
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
    }
  }
}

const getData = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors) => {
      if (!errors) {
        resolve(true)
        return
      }
      window.$message?.warning('请完善表单内容')
      reject(false)
    })
  })
}

defineExpose({ getData })
</script>

<style scoped lang="scss">
.personal-apply-form {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    row-gap: 8px;
  }

  &__item {
    min-width: 0;
  }

  &__item--full {
    grid-column: 1 / -1;
  }

  &__textarea-wrap {
    width: 100%;
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
</style>
