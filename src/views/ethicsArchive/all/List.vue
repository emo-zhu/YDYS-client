<template>
  <page :page-tabs="[{ label: '全员医德档案', value: '1' }]">
    <page-body>
      <page-body-header>
        <div class="toolbar">
          <div class="toolbar__row">
            <j-search
              v-model:value="archivePage.query.keywords"
              width="100%"
              placeholder="请输入姓名、工号、拼音简写"
              @search="archivePage.onSearch"
              :reset="true"
              @reset="archivePage.onReset"
              class="archive-search"
            >
              <div style="width: 150px; flex-shrink: 0">
                <n-select
                  v-model:value="archivePage.query.staffStatus"
                  :options="staffStatusOptions"
                  clearable
                  placeholder="请选择人员状态"
                />
              </div>
            </j-search>
            <div class="toolbar__actions">
              <j-button type="info" round @click="archivePage.onExport"
                >导出</j-button
              >
            </div>
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
import { JButton, renderOperation } from "junegoo-ui";
import type { DataTableColumns } from "naive-ui";
import { h, onMounted } from "vue";
import Add from "./Add.vue";
import Edit from "./Edit.vue";
import View from "./View.vue";
import { staffStatusOptions, useStaffArchiveModule } from "./src/hooks/archive";
import type { StaffArchiveItem } from "./src/types/archive";

const { archivePage } = useStaffArchiveModule();

const columns: DataTableColumns<StaffArchiveItem> = [
  {
    title: "序号",
    key: "index",
    width: 72,
    render(_row, index) {
      const pageNum = archivePage.query.pageNum || 1;
      const pageSize = archivePage.query.pageSize || 20;
      return index + 1 + (pageNum - 1) * pageSize;
    },
  },
  {
    title: "姓名",
    key: "name",
    minWidth: 180,
    render(row) {
      return h(
        "span",
        {
          class: "title-text title-text--link",
          onClick: () => archivePage.openView(row.id),
        },
        row.name,
      );
    },
  },
  {
    title: "性别",
    key: "gender",
    width: 80,
  },
  {
    title: "岗位类别",
    key: "positionType",
    width: 140,
  },
  {
    title: "进院时间",
    key: "entryDate",
    width: 140,
  },
  {
    title: "科室",
    key: "departmentName",
    width: 180,
  },
  {
    title: "操作",
    key: "operation",
    width: 156,
    align: "center",
    render(row) {
      return renderOperation(
        row.actions.map((action) => ({
          label: action.label,
          event() {
            archivePage.onActionClick(row, action.label);
          },
        })),
      );
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

.search-addon--status {
  width: 300px;
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

.archive-search :deep(.n-input) {
  flex: 1;
  min-width: 220px;
}

.archive-search :deep(.status-select) {
  width: 100%;
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

@media (max-width: 1440px) {
  .toolbar__row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-addon--status {
    width: 100%;
  }

  .toolbar__actions {
    justify-content: flex-start;
  }
}
</style>
