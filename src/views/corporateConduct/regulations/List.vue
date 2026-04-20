<template>
  <page :page-tabs="[{ label: '规章制度', value: '1' }]">
    <page-body>
      <page-body-container class="regulations-page">
        <div class="query-bar">
          <j-search
            v-model:value="regulationPage.query.keywords"
            placeholder="输入规章制度查询"
            @search="regulationPage.onSearch"
            :reset="true"
            @reset="regulationPage.onReset"
            class="regulations-search"
          />
        </div>

        <div class="toolbar">
          <n-space size="small">
            <n-button type="info" @click="regulationPage.openAdd">新增</n-button>
            <n-button :disabled="regulationPage.checkedRowKeys.value.length === 0" @click="regulationPage.onBatchDelete">删除</n-button>
          </n-space>
        </div>

        <n-data-table
          class="regulations-table"
          :columns="columns"
          :data="regulationPage.pageData.value.records"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="regulationPage.rowKey"
          :loading="regulationPage.loading.value"
          v-model:checked-row-keys="regulationPage.checkedRowKeys.value"
        />
      </page-body-container>
      <page-body-footer>
        <j-pagination
          v-model:page-query="regulationPage.query"
          :page-data="regulationPage.pageData.value"
          @load-page="regulationPage.loadPage"
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
import { renderOperation, renderTextButton } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted } from 'vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useRegulationModule } from './src/hooks/regulation'
import type { RegulationItem } from './src/types/regulation'

const { regulationPage } = useRegulationModule()

const columns: DataTableColumns<RegulationItem> = [
  {
    type: 'selection',
    width: 56
  },
  {
    title: '序号',
    key: 'index',
    width: 72,
    render(_row, index) {
      const pageNum = regulationPage.query.pageNum || 1
      const pageSize = regulationPage.query.pageSize || 10
      return index + 1 + (pageNum - 1) * pageSize
    }
  },
  {
    title: '文件类型',
    key: 'fileType',
    width: 110,
    render(row) {
      return h(
        'span',
        {
          class: ['file-type-tag', row.fileType === '规章制度' ? 'file-type-tag--rule' : 'file-type-tag--study']
        },
        row.fileType
      )
    }
  },
  {
    title: '标题',
    key: 'title',
    width: 420,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        'span',
        {
          class: 'title-text title-text--link',
          onClick: () => regulationPage.openView(row.id)
        },
        row.title
      )
    }
  },
  {
    title: '发布时间',
    key: 'publishDate',
    width: 160,
    sorter: 'default'
  },
  {
    title: '发布内容',
    key: 'contentName',
    minWidth: 360,
    render(row) {
      return renderTextButton(row.contentName, () => {
        regulationPage.onOpenContent(row)
      })
    }
  },
  {
    title: '浏览次数',
    key: 'browseCount',
    width: 96,
    align: 'center'
  },
  {
    title: '操作',
    key: 'operate',
    width: 96,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          event() {
            regulationPage.openEdit(row.id)
          }
        },
        {
          label: '删除',
          event() {
            regulationPage.onDelete(row.id)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  regulationPage.getPage()
})
</script>

<style scoped lang="scss">
.regulations-page {
  padding: 8px 6px 4px;
}

.query-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

:deep(.regulations-search) {
  width: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

:deep(.regulations-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.regulations-table .n-data-table-td) {
  padding: 14px 12px;
  font-size: 15px;
  color: #303133;
  line-height: 1.6;
  border-color: #e4e7ed;
}

:deep(.regulations-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

.file-type-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.4;
  border: 1px solid transparent;
}

.file-type-tag--rule {
  color: #fa8c16;
  background: #fff7e8;
  border-color: #ffd591;
}

.file-type-tag--study {
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
</style>
