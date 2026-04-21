<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="96">
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="考评项名称" path="itemName" :span="2">
        <n-input v-model:value="model.itemName" placeholder="请输入考评项名称" maxlength="50" show-count />
      </n-form-item-gi>
      <n-form-item-gi label="排序号" path="sortOrder">
        <n-input-number v-model:value="model.sortOrder" :min="0" placeholder="请输入" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi label="考评项类型" path="itemType">
        <n-select v-model:value="model.itemType" :options="itemTypeOptions" placeholder="请选择" @update:value="handleTypeChange" />
      </n-form-item-gi>
      <n-form-item-gi v-if="model.itemType === 'fixed'" label="固定分" path="fixedScore">
        <n-input-number v-model:value="model.fixedScore" :min="0" :precision="2" placeholder="请输入" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi v-if="showClauseField" label="加减分条款" path="clauseIds" :span="2">
        <n-select v-model:value="model.clauseIds" :options="clauseOptions" multiple clearable filterable placeholder="请选择" />
      </n-form-item-gi>
      <n-form-item-gi v-if="model.itemType === 'range'" label="最低分" path="minScore">
        <n-input-number v-model:value="model.minScore" :precision="2" placeholder="请输入" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi v-if="showMaxScoreField" label="最高分" path="maxScore">
        <n-input-number
          v-model:value="model.maxScore"
          :precision="2"
          :min="model.itemType === 'range' ? Number(model.minScore || 0) : undefined"
          placeholder="请输入"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi label="考评项说明" path="description" :span="2">
        <n-input
          v-model:value="model.description"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          placeholder="请输入"
        />
      </n-form-item-gi>
      <n-form-item-gi v-if="model.itemType === 'formula'" label="计算分公式" path="formula" :span="2">
        <n-input
          v-model:value="model.formula"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入计算分公式"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules, SelectOption } from 'naive-ui'
import { computed, ref } from 'vue'
import type { DepartmentAssessmentItemForm, DepartmentAssessmentItemType } from '../src/types/item'

const props = defineProps<{
  itemTypeOptions: SelectOption[]
  clauseOptions: SelectOption[]
}>()

const model = defineModel<DepartmentAssessmentItemForm>({
  default: {
    itemName: '',
    sortOrder: 0,
    itemType: undefined,
    clauseIds: [],
    description: '',
    formula: ''
  }
})

const formRef = ref<FormInst | null>(null)

const showClauseField = computed(() => model.value.itemType === 'plusMinus' || model.value.itemType === 'plusMinusWithCap')
const showMaxScoreField = computed(() => model.value.itemType === 'range' || model.value.itemType === 'plusMinusWithCap')

const handleTypeChange = (value: DepartmentAssessmentItemType) => {
  if (value === 'fixed') {
    model.value.clauseIds = []
    model.value.minScore = undefined
    model.value.maxScore = undefined
    model.value.formula = ''
    return
  }
  if (value === 'plusMinus') {
    model.value.fixedScore = undefined
    model.value.minScore = undefined
    model.value.maxScore = undefined
    model.value.formula = ''
    return
  }
  if (value === 'plusMinusWithCap') {
    model.value.fixedScore = undefined
    model.value.minScore = undefined
    model.value.formula = ''
    return
  }
  if (value === 'range') {
    model.value.fixedScore = undefined
    model.value.clauseIds = []
    model.value.formula = ''
    return
  }
  if (value === 'formula') {
    model.value.fixedScore = undefined
    model.value.clauseIds = []
    model.value.minScore = undefined
    model.value.maxScore = undefined
  }
}

const rules: FormRules = {
  itemName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入考评项名称'
  },
  sortOrder: {
    required: true,
    type: 'number',
    trigger: ['blur', 'change'],
    message: '请输入排序号'
  },
  itemType: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择考评项类型'
  },
  fixedScore: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (model.value.itemType !== 'fixed') {
        return true
      }
      return model.value.fixedScore === undefined || model.value.fixedScore === null ? new Error('请输入固定分') : true
    }
  },
  clauseIds: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (!showClauseField.value) {
        return true
      }
      return model.value.clauseIds?.length ? true : new Error('请选择加减分条款')
    }
  },
  minScore: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (model.value.itemType !== 'range') {
        return true
      }
      return model.value.minScore === undefined || model.value.minScore === null ? new Error('请输入最低分') : true
    }
  },
  maxScore: {
    trigger: ['blur', 'change'],
    validator: () => {
      if (!showMaxScoreField.value) {
        return true
      }
      if (model.value.maxScore === undefined || model.value.maxScore === null) {
        return new Error('请输入最高分')
      }
      if (model.value.itemType === 'range' && Number(model.value.maxScore) < Number(model.value.minScore || 0)) {
        return new Error('最高分不能小于最低分')
      }
      return true
    }
  },
  description: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入考评项说明'
  },
  formula: {
    trigger: ['blur', 'input'],
    validator: () => {
      if (model.value.itemType !== 'formula') {
        return true
      }
      return model.value.formula?.trim() ? true : new Error('请输入计算分公式')
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
