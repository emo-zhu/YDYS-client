<template>
  <div class="analysis-toolbar">
    <div class="analysis-toolbar__row">
      <j-search
        v-model:value="module.page.query.keywords"
        width="100%"
        placeholder="请输入姓名、工号、科室"
        @search="module.page.onSearch"
        :reset="true"
        @reset="module.page.onReset"
        class="analysis-search"
      >
        <div class="search-addon search-addon--year">
          <n-select
            v-model:value="module.page.query.assessmentYear"
            :options="module.options.assessmentYearOptions"
            placeholder="请选择考核年度"
            class="search-select"
          />
        </div>
        <div class="search-addon search-addon--month">
          <n-select
            v-model:value="module.page.query.assessmentMonth"
            :options="module.options.assessmentMonthOptions"
            clearable
            placeholder="请选择考核月度"
            class="search-select"
          />
        </div>
      </j-search>
      <div class="analysis-toolbar__actions">
        <j-button type="info" round @click="module.page.onExport">导出报表</j-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAnalysisTableModule } from '../hooks'
import type { AnalysisTableType } from '../types'

const props = defineProps<{
  type: AnalysisTableType
}>()

const module = useAnalysisTableModule(props.type)
</script>

<style scoped lang="scss">
.analysis-toolbar {
  width: 100%;
}

.analysis-toolbar__row,
.analysis-toolbar__actions,
.search-addon {
  display: flex;
  align-items: center;
}

.analysis-toolbar__row {
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.analysis-search {
  flex: 1;
  min-width: 0;
}

.analysis-toolbar__actions {
  justify-content: flex-end;
  margin-left: auto;
  flex-shrink: 0;
}

.analysis-search :deep(.search_box > .n-space) {
  width: 100%;
  flex-wrap: nowrap !important;
}

.analysis-search :deep(.select_group) {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.search-addon {
  flex-shrink: 0;
}

.search-addon--year {
  width: 150px;
}

.search-addon--month {
  width: 150px;
}

.analysis-search :deep(.search-select) {
  width: 100%;
  min-width: 0;
}

.analysis-search :deep(.n-input) {
  flex: 1;
  min-width: 260px;
}

@media (max-width: 1280px) {
  .analysis-toolbar__row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-addon--year,
  .search-addon--month {
    width: 100%;
  }

  .analysis-toolbar__actions {
    justify-content: flex-start;
    margin-left: 0;
  }
}
</style>
