<template>
  <page :page-tabs="[{ label: '开展活动', value: '1' }]">
    <page-body>
      <page-body-container class="activity-page">
        <div class="query-bar">
          <div class="query-item query-item--title">
            <span class="query-item__label">活动标题：</span>
            <n-input
              v-model:value="activityPage.query.title"
              placeholder="请输入活动标题"
              clearable
              @keydown.enter.prevent="activityPage.onSearch"
            />
          </div>
          <div class="query-item query-item--date">
            <span class="query-item__label">开展日期段：</span>
            <n-date-picker
              v-model:value="activityPage.query.dateRange"
              type="daterange"
              clearable
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="date-range-picker"
            />
          </div>
          <div class="query-actions">
            <n-space size="small">
              <n-button type="info" @click="activityPage.onSearch">搜索</n-button>
              <n-button @click="activityPage.onReset">重置</n-button>
            </n-space>
          </div>
        </div>

        <div class="toolbar">
          <n-space size="small">
            <n-button type="info" @click="activityPage.openAdd">新增</n-button>
            <n-button type="error" :disabled="activityPage.checkedRowKeys.value.length === 0" @click="activityPage.onBatchDelete">
              删除
            </n-button>
            <n-button secondary type="info" @click="activityPage.onExport">导出</n-button>
          </n-space>
        </div>

        <n-data-table
          class="activity-table"
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
import { renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { getActivityDateText } from './src/api/activity'
import { useActivityModule } from './src/hooks/activity'
import type { ActivityItem } from './src/types/activity'

const { activityPage } = useActivityModule()

const columns: DataTableColumns<ActivityItem> = [
  {
    type: 'selection',
    width: 56
  },
  {
    title: '活动状态',
    key: 'status',
    width: 120,
    render(row) {
      return h(
        'span',
        {
          class: ['status-tag', row.status === '已发布' ? 'status-tag--published' : 'status-tag--draft']
        },
        row.status
      )
    }
  },
  {
    title: '行风活动主题',
    key: 'title',
    minWidth: 320,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        'span',
        {
          class: 'title-text title-text--link',
          onClick: () => activityPage.openView(row.id)
        },
        row.title
      )
    }
  },
  {
    title: '活动开展时间',
    key: 'activityDate',
    width: 170,
    render(row) {
      return getActivityDateText(row)
    }
  },
  {
    title: '活动组织部门',
    key: 'department',
    width: 180,
    ellipsis: { tooltip: true }
  },
  {
    title: '活动录入日期',
    key: 'entryDate',
    width: 160
  },
  {
    title: '录入人信息',
    key: 'entryUser',
    minWidth: 240,
    ellipsis: { tooltip: true }
  },
  {
    title: '操作',
    key: 'operate',
    width: 188,
    align: 'center',
    render(row) {
      return renderOperation([
        row.status === '已发布'
          ? {
              label: '取消发布',
              event() {
                activityPage.onUpdateStatus(row, '未发布')
              }
            }
          : {
              label: '发布',
              event() {
                activityPage.onUpdateStatus(row, '已发布')
              }
            },
        {
          label: '编辑',
          event() {
            activityPage.openEdit(row.id)
          }
        },
        {
          label: '删除',
          event() {
            activityPage.onDelete(row.id)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  activityPage.getPage()
})
</script>

<style scoped lang="scss">
.activity-page {
  padding: 8px 6px 4px;
}

.query-bar {
  display: grid;
  grid-template-columns: minmax(280px, 1.1fr) minmax(360px, 1.3fr) auto;
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
  .query-bar {
    grid-template-columns: 1fr;
  }
}
</style>
