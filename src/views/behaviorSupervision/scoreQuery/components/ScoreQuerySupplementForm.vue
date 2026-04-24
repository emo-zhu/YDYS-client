<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="128"
    require-mark-placement="right-hanging"
    class="supplement-form"
  >
    <n-grid :cols="1" :x-gap="16">
      <n-form-item-gi label="选择行为对象" path="targetType">
        <n-radio-group v-model:value="model.targetType">
          <n-space>
            <n-radio value="person">人员</n-radio>
            <n-radio value="department">科室</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi label="选择人员" path="reportTargetName">
        <n-input v-model:value="model.reportTargetName" readonly placeholder="请选择人员" />
      </n-form-item-gi>
      <n-form-item-gi label="考核年度" path="assessmentYear">
        <n-select v-model:value="model.assessmentYear" :options="assessmentYearOptions" placeholder="请选择" />
      </n-form-item-gi>
      <n-form-item-gi label="加减分条款" path="clauseId">
        <n-select
          v-model:value="model.clauseId"
          :options="clauseSelectOptions"
          placeholder="请选择"
          @update:value="handleClauseChange"
        />
      </n-form-item-gi>
      <n-form-item-gi label="涉及金额" path="amount">
        <n-input-number v-model:value="model.amount" :show-button="false" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="行为分值" path="score">
        <n-input-number v-model:value="model.score" :show-button="false" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="报送对象" path="reviewerName">
        <n-input v-model:value="model.reviewerName" readonly placeholder="请选择报送对象" />
      </n-form-item-gi>
      <n-form-item-gi label="事件发生日期" path="eventTime">
        <n-date-picker
          v-model:formatted-value="model.eventTime"
          type="date"
          value-format="yyyy-MM-dd"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi label="事件发生所在科室" path="eventDepartment">
        <n-input v-model:value="model.eventDepartment" placeholder="请选择" />
      </n-form-item-gi>
      <n-form-item-gi label="事件概述" path="eventSummary">
        <n-input
          v-model:value="model.eventSummary"
          type="textarea"
          maxlength="1000"
          show-count
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入事件概述，最大字数1000"
        />
      </n-form-item-gi>
      <n-form-item-gi label="事件确定性日期" path="confirmedDate">
        <n-date-picker
          v-model:formatted-value="model.confirmedDate"
          type="date"
          value-format="yyyy-MM-dd"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi label="事件处理结果" path="handlingResult">
        <n-input
          v-model:value="model.handlingResult"
          type="textarea"
          maxlength="1000"
          show-count
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入事件处理结果，最大字数1000"
        />
      </n-form-item-gi>
      <n-form-item-gi label="上传佐证材料" path="evidenceMaterials">
        <j-upload v-model:value="model.evidenceMaterials" :imageUpload="false" :options="{ type: 'ALL' }" />
      </n-form-item-gi>
      <n-form-item-gi label="记录时间" path="recordTime">
        <n-date-picker
          v-model:formatted-value="model.recordTime"
          type="date"
          value-format="yyyy-MM-dd"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi label="当前行为录入人">
        <n-input v-model:value="model.recorderName" readonly />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { computed, ref } from 'vue'
import type { ScoreQuerySupplementForm } from '../src/types/scoreQuery'

const props = defineProps<{
  assessmentYearOptions: Array<{ label: string; value: string }>
  clauseOptions: Array<{ label: string; value: string; score: number; amount: number }>
}>()

const model = defineModel<ScoreQuerySupplementForm>({
  default: {
    targetType: 'person',
    reportTargetName: '',
    assessmentYear: '2026',
    clauseId: null,
    amount: 0,
    score: 0,
    reviewerName: '',
    eventTime: null,
    eventDepartment: '',
    eventSummary: '',
    confirmedDate: null,
    handlingResult: '',
    evidenceMaterials: '',
    recordTime: null,
    recorderName: '',
  },
})

const formRef = ref<FormInst | null>(null)

const clauseSelectOptions = computed(() =>
  props.clauseOptions.map((item) => ({
    label: item.label,
    value: item.value,
  })),
)

const handleClauseChange = (value: string | null) => {
  const clause = props.clauseOptions.find((item) => item.value === value)
  model.value.score = clause?.score || 0
  model.value.amount = clause?.amount || 0
}

const rules: FormRules = {
  reportTargetName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择人员',
  },
  assessmentYear: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择考核年度',
  },
  clauseId: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择加减分条款',
  },
  reviewerName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择报送对象',
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
  recordTime: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择记录时间',
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
.supplement-form {
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
