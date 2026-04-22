<template>
  <div class="detail-block">
    <n-descriptions :column="2" label-placement="left" bordered>
      <n-descriptions-item label="审查业务标题">
        {{ info?.businessTitle || '-' }}
      </n-descriptions-item>
      <n-descriptions-item label="状态">
        {{ statusText }}
      </n-descriptions-item>
      <n-descriptions-item label="审查时间范围">
        {{ reviewYearsText }}
      </n-descriptions-item>
      <n-descriptions-item label="审查操作时间">
        {{ info?.operateDate || '-' }}
      </n-descriptions-item>
      <n-descriptions-item label="审查总人数">
        {{ info?.totalCount ?? '-' }}
      </n-descriptions-item>
      <n-descriptions-item label="通过人数">
        {{ info?.passCount ?? '-' }}
      </n-descriptions-item>
      <n-descriptions-item label="未通过人数">
        {{ info?.failCount ?? '-' }}
      </n-descriptions-item>
      <n-descriptions-item label="审查人">
        {{ info?.reviewer || '-' }}
      </n-descriptions-item>
      <n-descriptions-item label="操作人" :span="2">
        {{ info?.operator || '-' }}
      </n-descriptions-item>
    </n-descriptions>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RESULT_REVIEW_STATUS_TEXT } from '../src/service/resultReview'
import type { ResultReviewItem } from '../src/types/resultReview'

const props = defineProps<{
  info?: ResultReviewItem
}>()

const reviewYearsText = computed(() => {
  if (!props.info?.reviewYears?.length) {
    return '-'
  }
  return props.info.reviewYears.join('、')
})

const statusText = computed(() => {
  if (!props.info?.status) {
    return '-'
  }
  return RESULT_REVIEW_STATUS_TEXT[props.info.status] || props.info.status
})
</script>

<style scoped lang="scss">
.detail-block {
  padding-top: 8px;
}
</style>
