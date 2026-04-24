<template>
  <div class="grade-page">
    <n-data-table
      :columns="columns"
      :data="module.pageData.value.records"
      :single-line="false"
      :bordered="true"
      striped
      :pagination="false"
      :row-key="module.rowKey"
      :loading="module.loading.value"
      v-model:expanded-row-keys="module.expandedRowKeys.value"
    />

    <div class="grade-ratio">
      <div class="grade-ratio__title">医德优秀等级控制比率</div>
      <n-radio-group v-model:value="ratioMode" disabled>
        <n-space vertical>
          <n-radio value="none">不控制优秀名额</n-radio>
          <n-space align="center">
            <n-radio value="rate">按比率控制</n-radio>
            <n-input value="15%" disabled class="grade-ratio__input" />
          </n-space>
          <n-radio value="category">按科室分类控制</n-radio>
        </n-space>
      </n-radio-group>
      <div class="grade-ratio__list">
        <div v-for="item in gradeRatioList" :key="item.label" class="grade-ratio__item">
          <span>{{ item.label }}</span>
          <n-input :value="item.value" disabled class="grade-ratio__input" />
        </div>
      </div>
    </div>

    <div class="grade-ratio">
      <div class="grade-ratio__title">医德标兵等级科室分类控制比率</div>
      <div class="grade-ratio__list grade-ratio__list--plain">
        <div v-for="item in modelWorkerGradeRatioList" :key="item.label" class="grade-ratio__item">
          <span>{{ item.label }}</span>
          <n-input :value="item.value" disabled class="grade-ratio__input" />
        </div>
      </div>
      <div class="grade-ratio__actions">
        <j-button round disabled>清空</j-button>
        <j-button round disabled>保存</j-button>
      </div>
      <div class="grade-ratio__control">
        <span class="grade-ratio__control-label">控制方式：</span>
        <n-radio-group value="block" disabled>
          <n-space>
            <n-radio value="block">提醒且不允许提交</n-radio>
            <n-radio value="warn">仅提醒</n-radio>
          </n-space>
        </n-radio-group>
        <span class="grade-ratio__remark">备注：医德标兵也同样受用。</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { renderOperation } from 'junegoo-ui'
import type { DataTableColumns } from 'naive-ui'
import { h, onMounted, ref } from 'vue'
import { gradeRatioList, modelWorkerGradeRatioList } from '../shared/config'
import { useAnnualRuleModule } from '../shared/hooks'
import type { AssessmentGradeItem } from '../shared/types'

defineProps<{
  embedded?: boolean
}>()

const module = useAnnualRuleModule('grade')
const ratioMode = ref('category')

const columns: DataTableColumns<AssessmentGradeItem> = [
  {
    type: 'expand',
    width: 56,
    expandable: (row) => Boolean(row.comment),
    renderExpand(row) {
      return h('div', { class: 'annual-rule-expand' }, `评语：${row.comment || '-'}`)
    }
  },
  {
    title: '等级名称',
    key: 'levelName',
    minWidth: 180
  },
  {
    title: '分数上限',
    key: 'maxScore',
    minWidth: 180
  },
  {
    title: '分数下限',
    key: 'minScore',
    minWidth: 180
  },
  {
    title: '别名',
    key: 'alias',
    minWidth: 220
  },
  {
    title: '操作',
    key: 'operate',
    width: 170,
    fixed: 'right',
    render(row) {
      return renderOperation([
        {
          label: '编辑',
          disabled: true,
          event() {
            module.onTodo(`编辑${row.levelName}`)
          }
        },
        {
          label: '删除',
          disabled: true,
          event() {
            module.onTodo(`删除${row.levelName}`)
          }
        }
      ])
    }
  }
]

onMounted(() => {
  module.getPage()
})
</script>

<style scoped lang="scss">
.grade-page {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

:deep(.annual-rule-expand) {
  color: #555;
  padding: 4px 12px;
}

.grade-ratio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.grade-ratio__title {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.grade-ratio__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 28px;
}

.grade-ratio__list--plain {
  padding-left: 0;
}

.grade-ratio__item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
}

.grade-ratio__input {
  width: 108px;
}

.grade-ratio__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.grade-ratio__control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  color: #666;
}

.grade-ratio__control-label {
  color: #333;
}

.grade-ratio__remark {
  color: #f5222d;
}

</style>
