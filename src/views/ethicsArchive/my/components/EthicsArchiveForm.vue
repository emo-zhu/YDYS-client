<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="98">
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="档案年度" path="archiveYear">
        <n-select v-model:value="model.archiveYear" :options="archiveYearOptions" placeholder="请选择档案年度" />
      </n-form-item-gi>
      <n-form-item-gi label="档案编号" path="archiveCode">
        <n-input v-model:value="model.archiveCode" placeholder="请输入档案编号" maxlength="30" />
      </n-form-item-gi>
      <n-form-item-gi label="所属科室" path="departmentName">
        <n-input v-model:value="model.departmentName" placeholder="请输入所属科室" />
      </n-form-item-gi>
      <n-form-item-gi label="岗位" path="positionName">
        <n-input v-model:value="model.positionName" placeholder="请输入岗位" />
      </n-form-item-gi>
      <n-form-item-gi label="档案状态" path="archiveStatus">
        <n-select v-model:value="model.archiveStatus" :options="archiveStatusOptions" placeholder="请选择档案状态" />
      </n-form-item-gi>
      <n-form-item-gi label="考评等级" path="assessmentLevel">
        <n-select v-model:value="model.assessmentLevel" :options="assessmentLevelOptions" placeholder="请选择考评等级" />
      </n-form-item-gi>
      <n-form-item-gi label="综合得分" path="score">
        <n-input-number v-model:value="model.score" :min="0" :max="100" placeholder="请输入综合得分" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="表扬次数" path="rewardCount">
        <n-input-number v-model:value="model.rewardCount" :min="0" placeholder="请输入表扬次数" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="投诉次数" path="complaintCount">
        <n-input-number v-model:value="model.complaintCount" :min="0" placeholder="请输入投诉次数" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="表现亮点" path="highlights" :span="2">
        <n-input
          v-model:value="model.highlights"
          type="textarea"
          placeholder="请输入表现亮点"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item-gi>
      <n-form-item-gi label="整改计划" path="improvementPlan" :span="2">
        <n-input
          v-model:value="model.improvementPlan"
          type="textarea"
          placeholder="请输入整改计划"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { archiveStatusOptions, archiveYearOptions, assessmentLevelOptions } from '../src/hooks/archive'
import type {
  EthicsArchiveForm,
  EthicsArchiveLevel,
  EthicsArchiveStatus,
} from '../src/types/archive'

const model = defineModel<EthicsArchiveForm>({
  default: {
    archiveYear: '2025',
    archiveCode: '',
    departmentName: '',
    positionName: '',
    archiveStatus: '待完善' as EthicsArchiveStatus,
    assessmentLevel: '良好' as EthicsArchiveLevel,
    score: 90,
    rewardCount: 0,
    complaintCount: 0,
    highlights: '',
    improvementPlan: '',
  },
})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  archiveYear: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择档案年度',
  },
  archiveCode: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入档案编号',
  },
  departmentName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入所属科室',
  },
  positionName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入岗位',
  },
  archiveStatus: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择档案状态',
  },
  assessmentLevel: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请选择考评等级',
  },
  score: {
    required: true,
    type: 'number',
    trigger: ['change', 'blur'],
    message: '请输入综合得分',
  },
  highlights: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入表现亮点',
  },
  improvementPlan: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入整改计划',
  },
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
