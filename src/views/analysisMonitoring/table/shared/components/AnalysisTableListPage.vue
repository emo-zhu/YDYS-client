<template>
  <page
    v-if="!embedded"
    :page-tabs="[{ label: module.config.title, value: '1' }]"
  >
    <page-body>
      <page-body-header class="analysis-table-header">
        <AnalysisTableToolbar :type="type" />
      </page-body-header>
      <page-body-container>
        <AnalysisTable :type="type" />
      </page-body-container>
      <page-body-footer>
        <AnalysisTablePagination :type="type" />
      </page-body-footer>
    </page-body>
  </page>
  <div v-else class="analysis-table-embedded">
    <div class="analysis-table-embedded__container">
      <AnalysisTable :type="type" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAnalysisTableModule } from '../hooks'
import type { AnalysisTableType } from '../types'
import AnalysisTable from './AnalysisTable.vue'
import AnalysisTablePagination from './AnalysisTablePagination.vue'
import AnalysisTableToolbar from './AnalysisTableToolbar.vue'

const props = withDefaults(
  defineProps<{
    type: AnalysisTableType
    embedded?: boolean
  }>(),
  {
    embedded: false
  }
)

const { type, embedded } = props
const module = useAnalysisTableModule(type)

onMounted(() => {
  module.page.getPage()
})
</script>

<style scoped lang="scss">
.analysis-table-header {
  display: block;
}

.analysis-table-embedded {
  display: grid;
  gap: 0;
}

.analysis-table-embedded__container {
  min-width: 0;
}
</style>
