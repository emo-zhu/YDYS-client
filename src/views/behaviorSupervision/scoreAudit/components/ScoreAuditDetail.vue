<template>
  <n-descriptions label-placement="left" :column="1" bordered size="small">
    <n-descriptions-item label="状态">{{ info?.status || '-' }}</n-descriptions-item>
    <n-descriptions-item label="考核年度">{{ info?.assessmentYear || '-' }}</n-descriptions-item>
    <n-descriptions-item label="姓名">{{ info?.userName || '-' }}</n-descriptions-item>
    <n-descriptions-item label="工号">{{ info?.jobNumber || '-' }}</n-descriptions-item>
    <n-descriptions-item label="事件发生科室">{{ info?.eventDepartment || '-' }}</n-descriptions-item>
    <n-descriptions-item label="申报人">{{ info?.applicant || '-' }}</n-descriptions-item>
    <n-descriptions-item label="加减分">{{ info ? (info.score > 0 ? `+ ${info.score}` : `${info.score}`) : '-' }}</n-descriptions-item>
    <n-descriptions-item label="金额">{{ info?.amount ?? '-' }}</n-descriptions-item>
    <n-descriptions-item label="事件发生时间">{{ info?.eventTime || '-' }}</n-descriptions-item>
    <n-descriptions-item label="行为描述">{{ info?.behaviorDescription || '-' }}</n-descriptions-item>
    <n-descriptions-item label="事件概述">{{ info?.eventSummary || '-' }}</n-descriptions-item>
    <n-descriptions-item label="佐证材料">{{ info?.evidenceMaterial || '-' }}</n-descriptions-item>
    <n-descriptions-item label="流程状态">{{ info?.processStatus || '-' }}</n-descriptions-item>
  </n-descriptions>
</template>

<script lang="ts" setup>
import type { ScoreAuditItem } from '../src/types/scoreAudit'

defineProps<{
  info?: ScoreAuditItem
}>()
</script>
