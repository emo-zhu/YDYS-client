<template>
  <n-form
    ref="formRef"
    class="meeting-form"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="110"
  >
    <div class="meeting-form__grid">
      <n-form-item class="meeting-form__item" label="考核年度" path="assessmentYear">
        <n-select
          v-model:value="model.assessmentYear"
          :options="module.options.assessmentYearOptions"
          placeholder="请选择考核年度"
        />
      </n-form-item>
      <n-form-item class="meeting-form__item" :label="module.config.periodLabel" path="assessmentPeriod">
        <n-select
          v-model:value="model.assessmentPeriod"
          :options="module.options.periodOptions"
          placeholder="请选择"
        />
      </n-form-item>
      <n-form-item class="meeting-form__item" label="科室" path="departmentName">
        <n-select
          v-model:value="model.departmentName"
          :options="module.options.departmentOptions"
          placeholder="请选择科室"
        />
      </n-form-item>
      <n-form-item class="meeting-form__item" label="状态" path="status">
        <n-select v-model:value="model.status" :options="workMeetingStatusOptions" placeholder="请选择状态" />
      </n-form-item>
      <n-form-item class="meeting-form__item" label="填报人" path="reporterName">
        <n-input v-model:value="model.reporterName" placeholder="请输入填报人" />
      </n-form-item>
      <n-form-item class="meeting-form__item" label="填报人工号" path="reporterJobNo">
        <n-input v-model:value="model.reporterJobNo" placeholder="请输入填报人工号" />
      </n-form-item>
      <n-form-item class="meeting-form__item" label="填报时间" path="reportTime">
        <n-date-picker
          type="date"
          clearable
          value-format="yyyy-MM-dd"
          v-model:formatted-value="model.reportTime"
        />
      </n-form-item>
      <n-form-item class="meeting-form__item" label="附件名称" path="attachmentName">
        <n-input v-model:value="model.attachmentName" placeholder="请输入附件名称" />
      </n-form-item>
      <n-form-item class="meeting-form__item meeting-form__item--full" label="备注" path="remarks">
        <n-input
          v-model:value="model.remarks"
          type="textarea"
          placeholder="请输入备注"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { workMeetingStatusOptions } from '../config'
import { useWorkMeetingModule } from '../hooks'
import type { WorkMeetingForm, WorkMeetingStatus, WorkMeetingType } from '../types'

const props = defineProps<{
  type: WorkMeetingType
}>()

const module = useWorkMeetingModule(props.type)

const model = defineModel<WorkMeetingForm>({
  default: {
    status: '待填报' as WorkMeetingStatus,
    assessmentYear: '2025',
    assessmentPeriod: '',
    departmentName: '',
    reporterName: '',
    reporterJobNo: '',
    reportTime: '',
    attachmentName: '',
    attachmentUrl: '',
    remarks: ''
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  assessmentYear: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择考核年度'
  },
  assessmentPeriod: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择考核周期'
  },
  departmentName: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择科室'
  },
  status: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择状态'
  },
  reporterName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入填报人'
  },
  reporterJobNo: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入填报人工号'
  },
  reportTime: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择填报时间'
  },
  attachmentName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入附件名称'
  }
}

const getData = () =>
  new Promise((resolve, reject) => {
    formRef.value?.validate((errors) => {
      if (!errors) {
        model.value.attachmentUrl = model.value.attachmentName || ''
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
.meeting-form {
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
  :deep(.n-date-picker) {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .meeting-form {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__item--full {
      grid-column: auto;
    }
  }
}
</style>
