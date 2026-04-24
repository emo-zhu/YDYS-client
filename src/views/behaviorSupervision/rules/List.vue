<template>
  <page
    v-model:value="rulesPage.tabValue.value"
    :page-tabs="pageTabs"
    @update:value="rulesPage.onTabChange"
  >
    <page-body>
      <page-body-header>
        <div class="toolbar">
          <div class="toolbar__actions">
            <j-button type="info" round @click="rulesPage.onAdd">新增</j-button>
            <j-button
              v-if="rulesPage.tabValue.value === 'plus'"
              type="info"
              round
              @click="rulesPage.onOpenAnnualLimit"
            >
              年度总加分最高限
            </j-button>
            <j-button round @click="rulesPage.onExport">导出规则</j-button>
            <j-button round @click="rulesPage.onRefresh">刷新</j-button>
          </div>
        </div>
      </page-body-header>
      <page-body-container>
        <n-data-table
          v-table-full-height="110"
          flex-height
          :columns="activeColumns"
          :data="rulesPage.activeRules.value"
          :single-line="false"
          :bordered="true"
          striped
          :pagination="false"
          :row-key="rulesPage.rowKey"
          :scroll-x="rulesPage.tableScrollX.value"
          :loading="rulesPage.loading.value"
        />
      </page-body-container>
    </page-body>
    <Add />
    <Edit />
    <View />
  </page>
</template>

<script lang="ts" setup>
import { renderOperation, renderTextButton } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { computed, h, onMounted } from 'vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import { useBehaviorRuleModule } from './src/hooks/rules'
import type { BehaviorRuleItem } from './src/types/rules'

const { rulesPage } = useBehaviorRuleModule()

const pageTabs = [
  { label: '加分规则', value: 'plus' },
  { label: '减分规则', value: 'minus' },
]

const commonColumns: DataTableColumns<BehaviorRuleItem> = [
  {
    type: 'expand',
    width: 56,
    expandable: () => true,
    renderExpand(row) {
      return h('div', { class: 'rule-expand' }, [
        h('div', { class: 'rule-expand__row' }, [
          h('span', { class: 'rule-expand__label' }, '规则说明：'),
          h('span', { class: 'rule-expand__value' }, row.description || '-'),
        ]),
        h('div', { class: 'rule-expand__row' }, [
          h('span', { class: 'rule-expand__label' }, '适用场景：'),
          h('span', { class: 'rule-expand__value' }, row.applicationScope || '-'),
        ]),
      ])
    },
  },
  {
    title: '规则名称',
    key: 'ruleName',
    minWidth: 240,
    ellipsis: { tooltip: true },
    render(row) {
      return renderTextButton(row.ruleName, () => {
        rulesPage.onView(row)
      })
    },
  },
  {
    title: '规则属性',
    key: 'ruleAttribute',
    width: 160,
    ellipsis: { tooltip: true },
  },
  {
    title: '录入人',
    key: 'creator',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '审核人',
    key: 'reviewer',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '固定分',
    key: 'fixedScore',
    width: 110,
    align: 'center',
  },
  {
    title: '最低分',
    key: 'minScore',
    width: 110,
    align: 'center',
  },
  {
    title: '最高分',
    key: 'maxScore',
    width: 110,
    align: 'center',
  },
  {
    title: '规则对象',
    key: 'ruleTarget',
    width: 160,
    ellipsis: { tooltip: true },
  },
]

const plusColumns: DataTableColumns<BehaviorRuleItem> = [
  ...commonColumns,
  {
    title: '操作',
    key: 'operation',
    width: 180,
    fixed: 'right',
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '新增',
          event() {
            rulesPage.onAddChild(row)
          },
        },
        {
          label: '编辑',
          event() {
            rulesPage.onEdit(row)
          },
        },
        {
          label: '废止',
          event() {
            rulesPage.onDisable(row)
          },
        },
      ])
    },
  },
]

const minusColumns: DataTableColumns<BehaviorRuleItem> = [
  ...commonColumns.slice(0, 9),
  {
    title: '是否同步减分',
    key: 'syncMinusScore',
    width: 140,
    align: 'center',
    render(row) {
      return h(
        'span',
        {
          class: ['sync-tag', row.syncMinusScore ? 'sync-tag--yes' : 'sync-tag--no'],
        },
        row.syncMinusScore ? '是' : '否',
      )
    },
  },
  {
    title: '操作',
    key: 'operation',
    width: 180,
    fixed: 'right',
    align: 'center',
    render(row) {
      return renderOperation([
        {
          label: '新增',
          event() {
            rulesPage.onAddChild(row)
          },
        },
        {
          label: '编辑',
          event() {
            rulesPage.onEdit(row)
          },
        },
        {
          label: '废止',
          event() {
            rulesPage.onDisable(row)
          },
        },
      ])
    },
  },
]

const activeColumns = computed(() => (rulesPage.tabValue.value === 'plus' ? plusColumns : minusColumns))

onMounted(() => {
  rulesPage.init()
})
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.toolbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rule-expand {
  display: grid;
  gap: 12px;
  padding: 8px 4px;
}

.rule-expand__row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 22px;
}

.rule-expand__label {
  color: #606266;
  flex-shrink: 0;
}

.rule-expand__value {
  color: #303133;
}

.sync-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 26px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  border: 1px solid #fca5a5;
  color: #ef4444;
  background: #fff5f5;
}

.sync-tag--yes {
  color: #1677ff;
  border-color: #91caff;
  background: #eff6ff;
}

.sync-tag--no {
  color: #ef4444;
  border-color: #fca5a5;
  background: #fff5f5;
}
</style>
