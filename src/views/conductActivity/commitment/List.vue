<template>
  <page :page-tabs="[{ label: '自查自纠', value: '1' }]">
    <page-body>
      <page-body-container class="commitment-page">
        <div class="query-bar">
          <div class="query-item query-item--title">
            <span class="query-item__label">自查自纠报告名称：</span>
            <n-input
              v-model:value="commitmentPage.query.reportName"
              placeholder="请输入"
              clearable
              @keydown.enter.prevent="commitmentPage.onSearch"
            />
          </div>
          <div class="query-item query-item--date">
            <span class="query-item__label">起止时间：</span>
            <n-date-picker
              v-model:value="commitmentPage.query.dateRange"
              type="daterange"
              clearable
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="date-range-picker"
            />
          </div>
          <div class="query-actions">
            <n-space size="small">
              <n-button type="info" @click="commitmentPage.onSearch">搜索</n-button>
              <n-button @click="commitmentPage.onReset">重置</n-button>
            </n-space>
          </div>
        </div>

        <div class="toolbar">
          <n-space size="small">
            <n-button type="info" @click="commitmentPage.openAdd">新增</n-button>
          </n-space>
        </div>

        <n-data-table
          class="commitment-table"
          :columns="columns"
          :data="commitmentPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="commitmentPage.rowKey"
          :scroll-x="commitmentPage.tableScrollX.value"
          :loading="commitmentPage.loading.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="commitmentPage.query"
          :page-data="commitmentPage.pageData.value"
          @load-page="commitmentPage.loadPage"
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
import { renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useCommitmentModule } from './src/hooks/commitment'
import type { CommitmentItem } from './src/types/commitment'

const { commitmentPage } = useCommitmentModule()

const columns: DataTableColumns<CommitmentItem> = [
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(row) {
      return h(
        'span',
        {
          class: ['status-tag', row.status === '进行中' ? 'status-tag--progress' : 'status-tag--finished']
        },
        row.status
      )
    }
  },
  {
    title: '自查自纠报告名称',
    key: 'reportName',
    minWidth: 320,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        'span',
        {
          class: 'title-text title-text--link',
          onClick: () => commitmentPage.openView(row.id)
        },
        row.reportName
      )
    }
  },
  {
    title: '发起人',
    key: 'initiator',
    width: 260,
    ellipsis: { tooltip: true }
  },
  {
    title: '开始时间',
    key: 'startTime',
    width: 240
  },
  {
    title: '结束时间',
    key: 'endTime',
    width: 240
  },
  {
    title: '应填报科室',
    key: 'targetDepartmentCount',
    width: 180
  },
  {
    title: '已填报科室',
    key: 'submittedDepartmentCount',
    width: 180
  },
  {
    title: '操作',
    key: 'operate',
    width: 172,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '详情',
          event() {
            commitmentPage.openView(row.id)
          }
        },
        ...(row.status === '进行中'
          ? [
              {
                label: '结束',
                event() {
                  commitmentPage.onEnd(row)
                }
              }
            ]
          : []),
        {
          label: '删除',
          event() {
            commitmentPage.onDelete(row.id)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  commitmentPage.getPage()
})
</script>

<style scoped lang="scss">
.commitment-page {
  padding: 8px 6px 4px;
}

.query-bar {
  display: grid;
  grid-template-columns: minmax(360px, 1.2fr) minmax(360px, 1.3fr) auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.query-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.query-item__label {
  flex-shrink: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.query-item--title :deep(.n-input) {
  flex: 1;
}

.query-item--date :deep(.date-range-picker) {
  width: 100%;
}

.query-actions {
  display: flex;
  justify-content: flex-start;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

:deep(.commitment-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.commitment-table .n-data-table-td) {
  padding: 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  border-color: #e4e7ed;
}

:deep(.commitment-table .n-data-table-tr:hover .n-data-table-td) {
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

.status-tag--progress {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffa39e;
}

.status-tag--finished {
  color: #606266;
  background: #f4f4f5;
  border-color: #d3d4d6;
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
  .query-bar {
    grid-template-columns: 1fr;
  }
}
</style>
