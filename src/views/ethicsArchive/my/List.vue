<template>
  <page :page-tabs="[{ label: '我的医德档案', value: '1' }]">
    <page-body>
      <page-body-header>
        <div class="toolbar">
          <div class="toolbar__row">
            <j-search
              v-model:value="archivePage.query.keywords"
              width="100%"
              placeholder="请输入档案编号、姓名"
              @search="archivePage.onSearch"
              :reset="true"
              @reset="archivePage.onReset"
              class="archive-search"
            >
              <div style="width: 150px; flex-shrink: 0">
                <n-select
                  v-model:value="archivePage.query.archiveYear"
                  :options="archiveYearOptions"
                  clearable
                  placeholder="请选择考核年度"
                />
              </div>
            </j-search>
            <div class="toolbar__actions"></div>
          </div>
        </div>
      </page-body-header>
      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          :columns="columns"
          :data="archivePage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="archivePage.rowKey"
          :scroll-x="
            columns.reduce(
              (acc, cur) => acc + Number(cur.width || cur.minWidth || 120),
              0,
            )
          "
          :loading="archivePage.loading.value"
          :expanded-row-keys="archivePage.expandedRowKeys.value"
          @update:expanded-row-keys="archivePage.onExpandedRowKeysUpdate"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="archivePage.query"
          :page-data="archivePage.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="archivePage.loadPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>

    <Add />
    <Edit />
    <View />
  </page>
</template>

<script lang="ts" setup>
import { renderTextButton } from "junegoo-ui";
import type { DataTableColumns } from "naive-ui";
import { h, onMounted } from "vue";
import Add from "./Add.vue";
import Edit from "./Edit.vue";
import View from "./View.vue";
import {
  archiveYearOptions,
  useEthicsArchiveModule,
} from "./src/hooks/archive";
import type { EthicsArchiveItem } from "./src/types/archive";

const { archivePage } = useEthicsArchiveModule();

const columns: DataTableColumns<EthicsArchiveItem> = [
  {
    type: "expand",
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h("div", { class: "expand-panel" }, [
        h("div", { class: "expand-row" }, [
          h("span", { class: "expand-row__label" }, "档案编号"),
          h("span", { class: "expand-row__value" }, row.archiveCode),
        ]),
        h("div", { class: "expand-row" }, [
          h("span", { class: "expand-row__label" }, "表现亮点"),
          h("span", { class: "expand-row__value" }, row.highlights),
        ]),
        h("div", { class: "expand-row" }, [
          h("span", { class: "expand-row__label" }, "整改计划"),
          h("span", { class: "expand-row__value" }, row.improvementPlan),
        ]),
      ]);
    },
  },
  {
    title: "考核年度",
    key: "archiveYear",
    width: 120,
  },
  {
    title: "姓名",
    key: "userName",
    minWidth: 150,
    render(row) {
      return h(
        "span",
        {
          class: "title-text title-text--link",
          onClick: () => archivePage.openView(row.id),
        },
        row.userName,
      );
    },
  },
  {
    title: "岗位类型",
    key: "positionType",
    width: 140,
  },
  {
    title: "所在科室",
    key: "departmentName",
    width: 140,
  },
  {
    title: "日常加减分",
    key: "dailyScore",
    width: 120,
    render(row) {
      return h(
        "span",
        {
          class: [
            "score-tag",
            row.dailyScore > 0 ? "score-tag--plus" : "score-tag--plain",
          ],
        },
        row.dailyScore > 0 ? `+${row.dailyScore}` : `${row.dailyScore}`,
      );
    },
  },
  {
    title: "个人评分",
    key: "personalScore",
    width: 100,
    align: "center",
  },
  {
    title: "科室评分",
    key: "departmentScore",
    width: 100,
    align: "center",
  },
  {
    title: "医院评分",
    key: "hospitalScore",
    width: 100,
    align: "center",
  },
  {
    title: "考评等级",
    key: "assessmentLevel",
    width: 110,
  },
  {
    title: "操作",
    key: "operation",
    minWidth: 260,
    render(row) {
      return renderTextButton("↓ 下载个人年度医德考评登记表（PDF）", () => {
        archivePage.onDownload(row);
      });
    },
  },
];

onMounted(() => {
  archivePage.getPage();
});
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

.archive-search {
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

.search-addon__label {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.toolbar__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-left: auto;
  flex-shrink: 0;
}

.archive-search :deep(.year-select) {
  width: 100%;
}

.archive-search :deep(.n-input) {
  flex: 1;
  min-width: 220px;
}

:deep(.archive-table .n-data-table-expand-trigger) {
  color: #606266;
}

:deep(.archive-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.archive-table .n-data-table-td) {
  padding: 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  border-color: #e4e7ed;
}

:deep(.archive-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

.title-text {
  color: #1677ff;
}

.title-text--link {
  cursor: pointer;
}

.score-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid transparent;
}

.score-tag--plus {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffb3b3;
}

.score-tag--plain {
  color: #606266;
  background: #f4f4f5;
  border-color: #d3d4d6;
}

.expand-panel {
  display: grid;
  gap: 10px;
  padding: 4px 0;
}

.expand-row {
  display: grid;
  grid-template-columns: 72px 1fr;
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
</style>
