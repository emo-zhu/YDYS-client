<template>
  <AnalysisTableListPage type="department" :embedded="embedded" />
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    embedded?: boolean
  }>(),
  {
    embedded: false
  }
)

import AnalysisTableListPage from '../shared/components/AnalysisTableListPage.vue'
</script>
