<template>
  <page :page-tabs="[{ label: '结果应用审查', value: '1' }]">
    <page-body>
      <page-body-header>
        <div class="query-toolbar">
          <j-search
            v-model:value="resultReviewPage.query.keywords"
            width="760px"
            placeholder="请输入审查业务标题"
            @search="resultReviewPage.onSearch"
            :reset="true"
            @reset="resultReviewPage.onReset"
            class="activity-search"
          >
            <div class="search-addon search-addon--date">
              <n-date-picker
                v-model:value="resultReviewPage.query.operateDateRange"
                type="daterange"
                clearable
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="date-range-picker"
              />
            </div>
          </j-search>
        </div>
        <n-space>
          <j-button type="info" round @click="resultReviewPage.onAdd"
            >新增</j-button
          >
        </n-space>
      </page-body-header>

      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          :columns="columns"
          :data="resultReviewPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="resultReviewPage.rowKey"
          :loading="resultReviewPage.loading.value"
          :scroll-x="
            columns.reduce((acc, cur) => acc + Number(cur.width || 120), 0)
          "
        />
      </page-body-container>

      <page-body-footer>
        <j-pagination
          v-model:page-query="resultReviewPage.query"
          :page-data="resultReviewPage.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="resultReviewPage.loadPage"
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
import { JButton, renderOperation, renderTextButton } from "junegoo-ui";
import type { DataTableColumns } from "naive-ui";
import { h, onMounted } from "vue";
import Add from "./Add.vue";
import Edit from "./Edit.vue";
import View from "./View.vue";
import { useResultReviewModule } from "./src/hooks/resultReview";
import type { ResultReviewItem } from "./src/types/resultReview";

const { resultReviewPage } = useResultReviewModule();

const columns: DataTableColumns<ResultReviewItem> = [
  {
    title: "序号",
    key: "index",
    width: 72,
    render(_row, index) {
      const pageNum = resultReviewPage.query.pageNum || 1;
      const pageSize = resultReviewPage.query.pageSize || 10;
      return index + 1 + (pageNum - 1) * pageSize;
    },
  },
  {
    title: "状态",
    key: "status",
    width: 96,
    render(row) {
      return h(
        "span",
        {
          class: ["status-tag", `status-tag--${row.status}`],
        },
        resultReviewPage.getStatusText(row.status),
      );
    },
  },
  {
    title: "审查业务标题",
    key: "businessTitle",
    width: 220,
    ellipsis: { tooltip: true },
    render(row) {
      return renderTextButton(row.businessTitle, () => {
        resultReviewPage.onOpenTitle(row);
      });
    },
  },
  {
    title: "操作日期",
    key: "operateDate",
    width: 140,
  },
  {
    title: "审查总人数",
    key: "totalCount",
    width: 100,
  },
  {
    title: "通过人数",
    key: "passCount",
    width: 100,
  },
  {
    title: "未通过人数",
    key: "failCount",
    width: 100,
  },
  {
    title: "审查人",
    key: "reviewer",
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: "操作人",
    key: "operator",
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: "操作",
    key: "operate",
    width: 120,
    fixed: "right",
    render(row) {
      return renderOperation([
        {
          label: "编辑",
          event() {
            resultReviewPage.onEdit(row.id);
          },
        },
        {
          label: "导出",
          event() {
            resultReviewPage.onExport(row.id);
          },
        },
        {
          label: "删除",
          event() {
            resultReviewPage.onDelete(row.id);
          },
        },
      ]);
    },
  },
];

onMounted(() => {
  resultReviewPage.getPage();
});
</script>

<style scoped lang="scss">
.search-addon {
  flex-shrink: 0;
}

.search-addon--date {
  width: 360px;
}
.activity-search :deep(.date-range-picker) {
  width: 100%;
}

.activity-search :deep(.n-input) {
  flex: 1;
  min-width: 220px;
}
.query-toolbar {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-label {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
}

.search-label--main {
  margin-right: 8px;
  flex-shrink: 0;
}

:deep(.result-review-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.result-review-table .n-data-table-td) {
  padding: 10px 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  border-color: #e4e7ed;
}

:deep(.result-review-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

:deep(.result-review-table .status-tag) {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.result-review-table .status-tag--pending) {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

:deep(.result-review-table .status-tag--completed) {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}
</style>
