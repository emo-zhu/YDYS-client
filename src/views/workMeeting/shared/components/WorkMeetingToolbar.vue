<template>
  <div class="toolbar">
    <div class="toolbar__row">
      <j-search
        v-model:value="module.page.query.keywords"
        width="100%"
        placeholder="请输入科室、填报人、附件名称"
        @search="module.page.onSearch"
        :reset="true"
        @reset="module.page.onReset"
        class="meeting-search"
      >
        <div class="search-addon search-addon--year">
          <!-- <span class="search-addon__label">考核年度：</span> -->
          <n-select
            v-model:value="module.page.query.assessmentYear"
            :options="module.options.assessmentYearOptions"
            clearable
            placeholder="请选择考核年度"
            class="search-select"
          />
        </div>
        <div class="search-addon search-addon--period">
          <!-- <span class="search-addon__label"
            >{{ module.config.periodLabel }}：</span
          > -->
          <n-select
            v-model:value="module.page.query.assessmentPeriod"
            :options="module.options.periodOptions"
            clearable
            placeholder="请选择考核季度"
            class="search-select"
          />
        </div>
        <div class="search-addon search-addon--department">
          <!-- <span class="search-addon__label">科室：</span> -->
          <n-select
            v-model:value="module.page.query.departmentName"
            :options="module.options.departmentOptions"
            clearable
            placeholder="请选择科室"
            class="search-select"
          />
        </div>
      </j-search>
      <div class="toolbar__actions">
        <j-button type="info" round @click="module.page.openAdd">新增</j-button>
        <j-button
          round
          :disabled="module.page.checkedRowKeys.value.length === 0"
          @click="module.page.onBatchDelete"
        >
          删除
        </j-button>
        <j-button type="info" secondary round @click="module.page.onExport">
          导出
        </j-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWorkMeetingModule } from "../hooks";
import type { WorkMeetingType } from "../types";

const props = defineProps<{
  type: WorkMeetingType;
}>();

const module = useWorkMeetingModule(props.type);
</script>

<style scoped lang="scss">
.toolbar {
  display: grid;
  width: 100%;
}

.toolbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.meeting-search {
  flex: 1;
  min-width: 0;
}

.meeting-search :deep(.search_box > .n-space) {
  width: 100%;
  flex-wrap: nowrap !important;
}

.meeting-search :deep(.select_group) {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.search-addon {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.search-addon--year {
  width: 150px;
}

.search-addon--period {
  width: 150px;
}

.search-addon--department {
   width: 150px;
}

.search-addon__label {
  flex-shrink: 0;
  color: #303133;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.toolbar__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-left: auto;
  flex-shrink: 0;
  white-space: nowrap;
}

.meeting-search :deep(.search-select) {
  width: 100%;
  min-width: 0;
}

.meeting-search :deep(.n-input) {
  flex: 1;
  min-width: 260px;
}

.meeting-search :deep(.search-select .n-base-selection) {
  width: 100%;
}

.meeting-search :deep(.search-select .n-base-selection-label) {
  min-height: 100%;
}

@media (max-width: 1280px) {
  .toolbar__row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-addon--year,
  .search-addon--period,
  .search-addon--department {
    width: 100%;
    padding-right: 0;
  }

  .toolbar__actions {
    justify-content: flex-start;
  }
}
</style>
