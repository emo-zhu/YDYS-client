<template>
  <j-pagination
    v-if="type !== 'grade'"
    v-model:page-query="module.query"
    :page-data="module.pageData.value"
    :page-sizes="[
      { label: '每页显示10行', value: 10 },
      { label: '每页显示20行', value: 20 },
      { label: '每页显示100行', value: 100 },
      { label: '每页显示500行', value: 500 },
      { label: '每页显示1000行', value: 1000 },
      { label: '每页显示2000行', value: 2000 }
    ]"
    @load-page="module.loadPage"
    :init="false"
  />
</template>

<script lang="ts" setup>
import { useAnnualRuleModule } from '../hooks'
import type { AnnualRuleType } from '../types'

const props = defineProps<{
  type: AnnualRuleType
}>()

const module = useAnnualRuleModule(props.type)
</script>
