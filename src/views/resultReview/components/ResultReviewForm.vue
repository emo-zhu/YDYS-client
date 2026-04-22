<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="130"
  >
    <n-form-item label="审查业务标题" path="businessTitle">
      <n-input v-model:value="model.businessTitle" placeholder="请输入" />
    </n-form-item>
    <n-form-item label="审查时间范围" path="reviewYears">
      <n-select
        v-model:value="model.reviewYears"
        multiple
        filterable
        clearable
        :options="reviewYearOptions"
        placeholder="请选择"
      />
    </n-form-item>
    <n-form-item label="审查操作时间" path="operateDate">
      <n-date-picker
        type="date"
        value-format="yyyy-MM-dd"
        v-model:formatted-value="model.operateDate"
        clearable
      />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from "naive-ui";
import { ref } from "vue";
import { reviewYearOptions } from "../src/hooks/resultReview";
import type { ResultReviewMutationForm } from "../src/types/resultReview";

const model = defineModel<ResultReviewMutationForm>({
  default: {
    businessTitle: "",
    reviewYears: [],
    operateDate: "",
  },
});

const formRef = ref<FormInst | null>(null);

const rules: FormRules = {
  businessTitle: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入审查业务标题",
  },
  reviewYears: {
    required: true,
    type: "array",
    min: 1,
    trigger: ["change", "blur"],
    message: "请选择审查时间范围",
  },
  operateDate: {
    required: true,
    trigger: ["change", "blur"],
    message: "请选择审查操作时间",
  },
};

const getData = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors) => {
      if (!errors) {
        resolve(true);
        return;
      }
      window.$message?.warning("请完善表单内容");
      reject(false);
    });
  });
};

defineExpose({ getData });
</script>
