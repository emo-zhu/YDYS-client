<template>
  <page :page-tabs="[{ label: '组织体系', value: '1' }]">
    <page-body>
      <page-body-container class="organizational-page">
        <section class="org-section">
          <div class="org-section__head">
            <h3 class="org-section__title">行风建设工作领导小组</h3>
          </div>
          <n-data-table
            class="org-table summary-table"
            :columns="leadershipColumns"
            :data="leadershipRows"
            :show-header="false"
            :single-line="false"
            :pagination="false"
            :bordered="true"
            :row-key="basicRowKey"
          />
        </section>
        <section class="org-section">
          <div class="org-section__head">
            <h3 class="org-section__title">行风建设领导小组办公室</h3>
          </div>
          <n-data-table
            class="org-table summary-table"
            :columns="officeColumns"
            :data="officeRows"
            :show-header="false"
            :single-line="false"
            :pagination="false"
            :bordered="true"
            :row-key="basicRowKey"
          />
        </section>
        <section class="org-section">
          <div class="org-section__head">
            <h3 class="org-section__title">各科室行风建设小组</h3>
            <n-space size="small" class="org-section__actions">
              <n-button quaternary type="info" size="small" @click="expandAll">展开全部</n-button>
              <n-button quaternary type="info" size="small" @click="collapseAll">收起全部</n-button>
            </n-space>
          </div>
          <n-data-table
            class="org-table dept-table"
            :columns="departmentColumns"
            :data="pagedDepartmentRows"
            :single-line="false"
            :pagination="false"
            :bordered="true"
            :row-key="departmentRowKey"
            :expanded-row-keys="expandedRowKeys"
            @update:expanded-row-keys="onExpandedRowKeysUpdate"
          />
        </section>
      </page-body-container>
      <page-body-footer class="org-page-footer">
        <j-pagination
          v-model:page-query="departmentPageQuery"
          :page-data="departmentPageData"
          @load-page="loadDepartmentPage"
          :init="false"
        />
      </page-body-footer>
    </page-body>
    <n-modal
      v-model:show="editorVisible"
      preset="card"
      :title="`编辑${editingLabel}`"
      class="editor-modal"
      style="width: 560px"
      :mask-closable="false"
    >
      <n-form label-placement="left" label-width="72">
        <n-form-item label="内容">
          <n-input
            v-model:value="editorValue"
            type="textarea"
            placeholder="请输入内容"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="editor-footer">
          <n-button @click="editorVisible = false">取消</n-button>
          <n-button type="info" @click="onSaveEditor">保存</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal
      v-model:show="departmentEditorVisible"
      preset="card"
      title="编辑科室小组"
      class="editor-modal"
      style="width: 620px"
      :mask-closable="false"
    >
      <n-form label-placement="left" label-width="88">
        <n-form-item label="科室负责人">
          <n-input v-model:value="departmentEditorForm.leader" placeholder="请输入科室负责人" />
        </n-form-item>
        <n-form-item label="党支部书记">
          <n-input v-model:value="departmentEditorForm.secretary" placeholder="请输入党支部书记" />
        </n-form-item>
        <n-form-item label="其他成员">
          <n-input
            v-model:value="departmentEditorForm.members"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="请输入其他成员"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="editor-footer">
          <n-button @click="departmentEditorVisible = false">取消</n-button>
          <n-button type="info" @click="onSaveDepartmentEditor">保存</n-button>
        </div>
      </template>
    </n-modal>
  </page>
</template>

<script lang="ts" setup>
import { renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { computed, h, reactive, ref } from 'vue'

type EditSource = 'leadership' | 'office'

interface BasicRow {
  id: string
  label: string
  value: string
}

interface DepartmentRow {
  id: string
  name: string
  leader: string
  secretary: string
  members: string
  isIncludeRow?: boolean
  children?: DepartmentRow[]
}

interface EditingRow {
  source: EditSource
  id: string
  label: string
}

type TableRowKey = string | number

const leadershipRows = ref<BasicRow[]>([
  { id: 'lead-1', label: '组长', value: '党委书记：赵刚' },
  { id: 'lead-2', label: '副组长', value: '纪委书记：丁伟；副院长：孔杰' },
  {
    id: 'lead-3',
    label: '成员',
    value: '党办：张雅婷；纪委监察室：张京华；医务部：周小兵；门诊部：尹颖超；护理部：姚丽；医保办：张华倩'
  }
])

const officeRows = ref<BasicRow[]>([
  { id: 'office-1', label: '负责人', value: '张雅婷（6420-党委办公室）' },
  {
    id: 'office-2',
    label: '成员',
    value: '卜婧（6337-药学部）、周小兵（6361-医务处）、尹颖超（6376-门诊办公室）、姚丽（6400-护理部办公室）'
  },
  {
    id: 'office-3',
    label: '成员',
    value: '张京华（6427-纪委监察室）、张华倩（6507-医疗保险办公室）、林行文（6638-保卫处）'
  }
])

const departmentRows = ref<DepartmentRow[]>([
  {
    id: 'dept-1',
    name: '人事处',
    leader: '敖辉',
    secretary: '',
    members: '',
    children: [
      {
        id: 'dept-1-include',
        name: '包含科室：人事处,院长办公室,人事处病区',
        leader: '',
        secretary: '',
        members: '',
        isIncludeRow: true
      }
    ]
  },
  {
    id: 'dept-2',
    name: '财务部',
    leader: '张雅婷',
    secretary: '',
    members: '',
    children: [
      {
        id: 'dept-2-include',
        name: '包含科室：财务处,内科学系办公室,心血管内科一病区,儿科学系,儿科学系未分科',
        leader: '',
        secretary: '',
        members: '',
        isIncludeRow: true
      }
    ]
  },
  { id: 'dept-3', name: '后勤处', leader: '毕亚雯', secretary: '周路', members: '周子佩' },
  { id: 'dept-4', name: '医务处', leader: '周小兵', secretary: '顾锦丽', members: '王妍' },
  { id: 'dept-5', name: '消化内科', leader: '朱云', secretary: '朱志宏', members: '朱若愚' },
  { id: 'dept-6', name: '心血管内科', leader: '王剑清', secretary: '关建', members: '王华,邹建伟' }
])

const editorVisible = ref(false)
const editorValue = ref('')
const editingRow = ref<EditingRow | null>(null)
const expandedRowKeys = ref<TableRowKey[]>(['dept-1', 'dept-2'])
const departmentPageQuery = reactive({
  pageNum: 1,
  pageSize: 10
})
const departmentEditorVisible = ref(false)
const editingDepartmentId = ref('')
const departmentEditorForm = ref({
  leader: '',
  secretary: '',
  members: ''
})

const basicRowKey = (row: BasicRow) => row.id
const departmentRowKey = (row: DepartmentRow) => row.id

const editingLabel = computed(() => editingRow.value?.label || '')

const openEditor = (source: EditSource, row: BasicRow) => {
  editingRow.value = {
    source,
    id: row.id,
    label: row.label
  }
  editorValue.value = row.value
  editorVisible.value = true
}

const onSaveEditor = () => {
  const target = editingRow.value
  const value = editorValue.value.trim()
  if (!target) {
    return
  }
  if (!value) {
    window.$message.warning('内容不能为空')
    return
  }
  const rows = target.source === 'leadership' ? leadershipRows.value : officeRows.value
  const row = rows.find((item) => item.id === target.id)
  if (!row) {
    return
  }
  row.value = value
  editorVisible.value = false
  window.$message.success('保存成功')
}

const displayText = (value: string) => (value.trim() ? value : '--')

const openDepartmentEditor = (row: DepartmentRow) => {
  if (row.isIncludeRow) {
    return
  }
  editingDepartmentId.value = row.id
  departmentEditorForm.value = {
    leader: row.leader,
    secretary: row.secretary,
    members: row.members
  }
  departmentEditorVisible.value = true
}

const onSaveDepartmentEditor = () => {
  const target = departmentRows.value.find((item) => item.id === editingDepartmentId.value)
  if (!target) {
    return
  }
  target.leader = departmentEditorForm.value.leader.trim()
  target.secretary = departmentEditorForm.value.secretary.trim()
  target.members = departmentEditorForm.value.members.trim()
  departmentEditorVisible.value = false
  window.$message.success('保存成功')
}

const createSummaryColumns = (source: EditSource): DataTableColumns<BasicRow> => [
  {
    title: '岗位',
    key: 'label',
    width: 160
  },
  {
    title: '内容',
    key: 'value'
  },
  {
    title: '操作',
    key: 'operate',
    width: 90,
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          event() {
            openEditor(source, row)
          }
        }
      ])
    }
  }
]

const leadershipColumns = createSummaryColumns('leadership')
const officeColumns = createSummaryColumns('office')

const pagedDepartmentRows = computed(() => {
  const pageNum = departmentPageQuery.pageNum || 1
  const pageSize = departmentPageQuery.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  return departmentRows.value.slice(start, end)
})

const departmentPageData = computed(() => {
  const pageNum = departmentPageQuery.pageNum || 1
  const pageSize = departmentPageQuery.pageSize || 10
  const total = departmentRows.value.length
  return {
    records: pagedDepartmentRows.value,
    total,
    pageNum,
    pageSize,
    current: pageNum,
    size: pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize))
  }
})

const departmentColumns: DataTableColumns<DepartmentRow> = [
  {
    title: '考评单元名称',
    key: 'name',
    width: 340,
    render(row) {
      if (row.isIncludeRow) {
        return h('span', { class: 'include-text' }, row.name)
      }
      return row.name
    }
  },
  {
    title: '科室负责人',
    key: 'leader',
    width: 260,
    render(row) {
      if (row.isIncludeRow) {
        return ''
      }
      return displayText(row.leader)
    }
  },
  {
    title: '党支部书记',
    key: 'secretary',
    width: 260,
    render(row) {
      if (row.isIncludeRow) {
        return ''
      }
      return displayText(row.secretary)
    }
  },
  {
    title: '其他成员',
    key: 'members',
    width: 260,
    render(row) {
      if (row.isIncludeRow) {
        return ''
      }
      return displayText(row.members)
    }
  },
  {
    title: '操作',
    key: 'operate',
    width: 100,
    align: 'center',
    render(row) {
      if (row.isIncludeRow) {
        return '-'
      }
      return renderOperation([
        {
          label: '编辑',
          event() {
            openDepartmentEditor(row)
          }
        }
      ])
    }
  }
]

const onExpandedRowKeysUpdate = (keys: TableRowKey[]) => {
  expandedRowKeys.value = keys
}

const expandAll = () => {
  expandedRowKeys.value = pagedDepartmentRows.value.filter((item) => item.children?.length).map((item) => item.id)
}

const collapseAll = () => {
  expandedRowKeys.value = []
}

const loadDepartmentPage = () => {
  const pageSize = departmentPageQuery.pageSize || 10
  const pages = Math.max(1, Math.ceil(departmentRows.value.length / pageSize))
  if ((departmentPageQuery.pageNum || 1) > pages) {
    departmentPageQuery.pageNum = pages
  }
  expandedRowKeys.value = []
}
</script>

<style scoped lang="scss">
.organizational-page {
  padding: 8px 6px 4px;
}

.org-section {
  margin-bottom: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.org-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f7f9fc;
  border-bottom: 1px solid #e3e6ed;
}

.org-section__title {
  margin: 0;
  position: relative;
  padding-left: 12px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.5px;
  color: #1e293b;
}

.org-section__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: #2d8cf0;
}

.org-section__actions {
  flex-shrink: 0;
}

.org-page-footer {
  padding-top: 2px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.include-text {
  color: #606266;
  font-size: 14px;
}

:deep(.org-table .n-data-table-th) {
  background: #f2f4f7;
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
  border-color: #dcdfe6;
}

:deep(.org-table .n-data-table-td) {
  padding: 14px 16px;
  font-size: 15px;
  color: #303133;
  line-height: 1.7;
  border-color: #e4e7ed;
}

:deep(.org-table .n-data-table-tr:hover .n-data-table-td) {
  background: #fafbfd;
}

:deep(.summary-table .n-data-table-td) {
  vertical-align: top;
}

:deep(.dept-table .n-data-table-td) {
  vertical-align: middle;
}

:deep(.org-table .n-data-table-expand-trigger) {
  margin-right: 6px;
}
</style>
