<template>
  <page :page-tabs="[{ label: module.config.title, value: '1' }]">
    <page-body>
      <page-body-header class="meeting-header">
        <div class="toolbar">
          <div class="toolbar__row">
            <j-search
              v-model:value="searchKeyword"
              width="100%"
              placeholder=""
              @search="module.page.onSearch"
              :reset="true"
              @reset="onResetSearch"
              class="meeting-search"
            >
              <div class="search-addon search-addon--year">
                <span class="search-addon__label">考核年度：</span>
                <n-select
                  v-model:value="module.page.query.assessmentYear"
                  :options="module.options.assessmentYearOptions"
                  clearable
                  placeholder="请选择"
                  class="search-select"
                />
              </div>
              <div class="search-addon search-addon--period">
                <span class="search-addon__label"
                  >{{ module.config.periodLabel }}：</span
                >
                <n-select
                  v-model:value="module.page.query.assessmentPeriod"
                  :options="module.options.periodOptions"
                  clearable
                  placeholder="请选择"
                  class="search-select"
                />
              </div>
              <div class="search-addon search-addon--department">
                <span class="search-addon__label">科室：</span>
                <n-select
                  v-model:value="module.page.query.departmentName"
                  :options="module.options.departmentOptions"
                  clearable
                  placeholder="请选择"
                  class="search-select"
                />
              </div>
            </j-search>
            <div class="toolbar__actions">
              <j-button type="info" round @click="module.page.openAdd"
                >新增</j-button
              >
              <j-button
                round
                :disabled="module.page.checkedRowKeys.value.length === 0"
                @click="module.page.onBatchDelete"
              >
                删除
              </j-button>
              <j-button
                type="info"
                secondary
                round
                @click="module.page.onExport"
                >导出</j-button
              >
            </div>
          </div>
        </div>
      </page-body-header>
      <page-body-container>
        <n-data-table
          class="meeting-table"
          :columns="columns"
          :data="module.page.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="module.page.rowKey"
          :scroll-x="module.page.tableScrollX.value"
          :loading="module.page.loading.value"
          :expanded-row-keys="module.page.expandedRowKeys.value"
          @update:expanded-row-keys="module.page.onExpandedRowKeysUpdate"
          v-model:checked-row-keys="module.page.checkedRowKeys.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="module.page.query"
          :page-data="module.page.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="module.page.loadPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>
  </page>
</template>

<script lang="ts" setup>
import { renderOperation, renderTextButton } from "junegoo-ui";
import type { DataTableColumns } from "naive-ui";
import { h, onMounted, ref } from "vue";
import { useWorkMeetingModule } from "../hooks";
import type { WorkMeetingItem, WorkMeetingType } from "../types";

const props = defineProps<{
  type: WorkMeetingType;
}>();

const module = useWorkMeetingModule(props.type);
const searchKeyword = ref("");

const onResetSearch = () => {
  searchKeyword.value = "";
  module.page.onReset();
};

const columns: DataTableColumns<WorkMeetingItem> = [
  {
    type: "expand",
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h("div", { class: "expand-panel" }, [
        h("div", { class: "expand-row" }, [
          h("span", { class: "expand-row__label" }, "附件"),
          h(
            "span",
            { class: "expand-row__value expand-row__value--link" },
            row.attachmentName || "-",
          ),
        ]),
        h("div", { class: "expand-row" }, [
          h("span", { class: "expand-row__label" }, "备注"),
          h("span", { class: "expand-row__value" }, row.remarks || "-"),
        ]),
      ]);
    },
  },
  {
    type: "selection",
    width: 56,
  },
  {
    title: "状态",
    key: "status",
    width: 120,
    render(row) {
      return h(
        "span",
        {
          class: [
            "status-tag",
            row.status === "完成"
              ? "status-tag--finished"
              : "status-tag--pending",
          ],
        },
        row.status,
      );
    },
  },
  {
    title: "年度",
    key: "assessmentYear",
    width: 120,
  },
  {
    title: module.config.periodLabel || "周期",
    key: "assessmentPeriod",
    width: 140,
  },
  {
    title: "科室",
    key: "departmentName",
    minWidth: 260,
    ellipsis: { tooltip: true },
  },
  {
    title: "填报人",
    key: "reporterName",
    width: 160,
  },
  {
    title: "填报人工号",
    key: "reporterJobNo",
    width: 160,
  },
  {
    title: "填报时间",
    key: "reportTime",
    width: 160,
  },
  {
    title: "附件",
    key: "attachmentName",
    minWidth: 300,
    render(row) {
      return renderTextButton(row.attachmentName || "-", () => {
        module.page.onOpenAttachment(row);
      });
    },
  },
  {
    title: "操作",
    key: "operate",
    fixed: "right",
    width: 132,
    align: "center",
    render(row) {
      return renderOperation([
        {
          label: "查看",
          event() {
            module.page.openView(row.id);
          },
        },
        {
          label: "删除",
          event() {
            module.page.onDelete(row.id);
          },
        },
      ]);
    },
  },
];

onMounted(() => {
  module.page.getPage();
});
</script>

<style scoped lang="scss">
.meeting-header {
  display: block;
}

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

.search-addon {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.search-addon--year {
  width: 260px;
}

.search-addon--period {
  width: 260px;
}

.search-addon--department {
  width: 320px;
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
  gap: 12px;
  flex-shrink: 0;
  white-space: nowrap;
}

.meeting-search :deep(.search-select) {
  width: 100%;
  min-width: 0;
}

.meeting-search :deep(.n-input) {
  flex: 0 0 0;
  width: 0;
  min-width: 0;
  opacity: 0;
  pointer-events: none;
}

.meeting-search :deep(.search-select .n-base-selection) {
  width: 100%;
}

.meeting-search :deep(.search-select .n-base-selection-label) {
  min-height: 100%;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid transparent;
}

.status-tag--finished {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.status-tag--pending {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

.expand-panel {
  display: grid;
  gap: 10px;
  padding: 4px 0;
}

.expand-row {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: start;
}

.expand-row__label {
  color: #606266;
  font-weight: 600;
}

.expand-row__value {
  color: #303133;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.expand-row__value--link {
  color: #1677ff;
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
