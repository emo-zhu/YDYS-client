<template>
  <n-spin :show="loading">
    <n-descriptions label-placement="left" :column="1" bordered size="small">
      <n-descriptions-item label="规则名称">{{ info?.ruleName || '-' }}</n-descriptions-item>
      <n-descriptions-item label="规则类型">{{ info?.ruleTypeName || '-' }}</n-descriptions-item>
      <n-descriptions-item label="规则对象">{{ info?.ruleTarget || '-' }}</n-descriptions-item>
      <n-descriptions-item label="规则分类">{{ info?.description || '-' }}</n-descriptions-item>
      <n-descriptions-item label="规则属性">{{ info?.ruleAttribute || '-' }}</n-descriptions-item>
      <n-descriptions-item label="录入人">{{ info?.creator || '-' }}</n-descriptions-item>
      <n-descriptions-item label="审核人">{{ info?.reviewer || '-' }}</n-descriptions-item>
      <n-descriptions-item label="分值类型">{{ info?.scoreTypeName || '-' }}</n-descriptions-item>
      <n-descriptions-item label="固定分">{{ info?.fixedScore ?? '-' }}</n-descriptions-item>
      <n-descriptions-item label="最低分">{{ info?.minScore ?? '-' }}</n-descriptions-item>
      <n-descriptions-item label="最高分">{{ info?.maxScore ?? '-' }}</n-descriptions-item>
      <n-descriptions-item label="限制累计加分">{{ info?.limitAccumulated ? '是' : '否' }}</n-descriptions-item>
      <n-descriptions-item label="允许科室填报">{{ info?.allowDepartmentReport ? '是' : '否' }}</n-descriptions-item>
      <n-descriptions-item label="填写金额">{{ info?.fillAmount ? '是' : '否' }}</n-descriptions-item>
      <n-descriptions-item label="生效日期">{{ info?.effectiveDate || '-' }}</n-descriptions-item>
      <n-descriptions-item label="适用场景">{{ info?.applicationScope || '-' }}</n-descriptions-item>
    </n-descriptions>
  </n-spin>
</template>

<script lang="ts" setup>
import type { BehaviorRuleDetail } from '../src/types/rules'

defineProps<{
  info?: BehaviorRuleDetail
  loading: boolean
}>()
</script>
