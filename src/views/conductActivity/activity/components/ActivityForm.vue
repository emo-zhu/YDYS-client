<template>
  <n-form ref="formRef" class="activity-form" :model="model" :rules="rules" label-placement="left" label-width="132">
    <div class="activity-form__grid">
      <n-form-item class="activity-form__item activity-form__item--full" label="活动标题" path="title">
        <n-input v-model:value="model.title" placeholder="请输入活动标题" maxlength="50" show-count />
      </n-form-item>
      <n-form-item class="activity-form__item activity-form__item--full" label="开展日期段" path="activityDateRange">
        <n-date-picker
          v-model:value="model.activityDateRange"
          class="activity-form__date-range"
          type="daterange"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </n-form-item>
      <n-form-item class="activity-form__item" label="活动组织部门" path="department">
        <n-input v-model:value="model.department" placeholder="请输入活动组织部门" />
      </n-form-item>
      <n-form-item class="activity-form__item" label="活动录入日期" path="entryDate">
        <n-date-picker type="date" value-format="yyyy-MM-dd" v-model:formatted-value="model.entryDate" clearable />
      </n-form-item>
      <n-form-item class="activity-form__item" label="录入人信息" path="entryUser">
        <n-input v-model:value="model.entryUser" placeholder="请输入录入人信息" />
      </n-form-item>
      <n-form-item class="activity-form__item" label="活动状态" path="status">
        <n-select v-model:value="model.status" :options="statusOptions" />
      </n-form-item>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import type { ActivityForm, ActivityStatus } from '../src/types/activity'
import { statusOptions } from '../src/hooks/activity'

const model = defineModel<ActivityForm>({
  default: {
    title: '',
    activityDateRange: null,
    department: '',
    entryDate: '',
    entryUser: '',
    status: '未发布' as ActivityStatus
  }
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入活动标题'
  },
  activityDateRange: {
    required: true,
    type: 'array',
    trigger: ['change', 'blur'],
    message: '请选择开展日期段'
  },
  department: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入活动组织部门'
  },
  entryDate: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择活动录入日期'
  },
  entryUser: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入录入人信息'
  },
  status: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择活动状态'
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
.activity-form {
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

  &__date-range {
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
  :deep(.n-date-picker) {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .activity-form {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__item--full {
      grid-column: auto;
    }
  }
}
</style>
