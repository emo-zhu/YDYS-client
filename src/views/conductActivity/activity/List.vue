<template>
  <page :page-tabs="[{ label: '开展活动', value: '1' }]">
    <page-body>
      <page-body-header>
        <j-search
          v-model:value="activityPage.query.title"
          width="760px"
          placeholder="请输入活动标题"
          @search="activityPage.onSearch"
          :reset="true"
          @reset="activityPage.onReset"
          class="activity-search"
        >
          <div class="search-addon search-addon--date">
            <n-date-picker
              v-model:value="activityPage.query.dateRange"
              type="daterange"
              clearable
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="date-range-picker"
            />
          </div>
        </j-search>
        <n-space>
          <j-button type="info" round @click="activityPage.openAdd"
            >新增</j-button
          >
          <j-button
            round
            :disabled="activityPage.checkedRowKeys.value.length === 0"
            @click="activityPage.onBatchDelete"
          >
            删除
          </j-button>
          <j-button secondary type="info" round @click="activityPage.onExport"
            >导出</j-button
          >
        </n-space>
      </page-body-header>
      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          :columns="columns"
          :data="activityPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="activityPage.rowKey"
          :scroll-x="activityPage.tableScrollX.value"
          :loading="activityPage.loading.value"
          v-model:checked-row-keys="activityPage.checkedRowKeys.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="activityPage.query"
          :page-data="activityPage.pageData.value"
          :page-sizes="[
            { label: '每页显示10行', value: 10 },
            { label: '每页显示20行', value: 20 },
            { label: '每页显示100行', value: 100 },
            { label: '每页显示500行', value: 500 },
            { label: '每页显示1000行', value: 1000 },
            { label: '每页显示2000行', value: 2000 },
          ]"
          @load-page="activityPage.loadPage"
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
import { JButton, renderOperation } from "junegoo-ui";
import type { DataTableColumns } from "naive-ui";
import { h, onMounted } from "vue";
import Add from "./Add.vue";
import Edit from "./Edit.vue";
import View from "./View.vue";
import { getActivityDateText } from "./src/api/activity";
import { useActivityModule } from "./src/hooks/activity";
import type { ActivityItem } from "./src/types/activity";

const { activityPage } = useActivityModule();

const columns: DataTableColumns<ActivityItem> = [
  {
    type: "selection",
    width: 56,
  },
  {
    title: "活动状态",
    key: "status",
    width: 120,
    render(row) {
      return h(
        "span",
        {
          class: [
            "status-tag",
            row.status === "已发布"
              ? "status-tag--published"
              : "status-tag--draft",
          ],
        },
        row.status,
      );
    },
  },
  {
    title: "行风活动主题",
    key: "title",
    minWidth: 320,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        "span",
        {
          class: "title-text title-text--link",
          onClick: () => activityPage.openView(row.id),
        },
        row.title,
      );
    },
  },
  {
    title: "活动开展时间",
    key: "activityDate",
    width: 200,
    render(row) {
      return getActivityDateText(row);
    },
  },
  {
    title: "活动组织部门",
    key: "department",
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: "活动录入日期",
    key: "entryDate",
    width: 160,
  },
  {
    title: "录入人信息",
    key: "entryUser",
    minWidth: 240,
    ellipsis: { tooltip: true },
  },
  {
    title: "操作",
    key: "operate",
    width: 188,
    align: "center",
    render(row) {
      return renderOperation([
        row.status === "已发布"
          ? {
              label: "取消发布",
              event() {
                activityPage.onUpdateStatus(row, "未发布");
              },
            }
          : {
              label: "发布",
              event() {
                activityPage.onUpdateStatus(row, "已发布");
              },
            },
        {
          label: "编辑",
          event() {
            activityPage.openEdit(row.id);
          },
        },
        {
          label: "删除",
          event() {
            activityPage.onDelete(row.id);
          },
        },
      ]);
    },
  },
];

onMounted(() => {
  activityPage.getPage();
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

:deep(.activity-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.activity-table .n-data-table-td) {
  padding: 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  border-color: #e4e7ed;
}

:deep(.activity-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid transparent;
}

.status-tag--published {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.status-tag--draft {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.title-text {
  color: #303133;
}

.title-text--link {
  cursor: pointer;
}

.title-text--link:hover {
  color: #1677ff;
}

@media (max-width: 1280px) {
  .search-addon--date {
    width: 100%;
  }
}
</style>
