<template>
  <n-data-table
    v-table-full-height="110"
    flex-height
    :columns="columns"
    :data="module.page.pageData.value.records"
    :single-line="false"
    :bordered="true"
    striped
    :pagination="false"
    :row-key="module.page.rowKey"
    :scroll-x="module.page.tableScrollX.value"
    :loading="module.page.loading.value"
    v-model:checked-row-keys="module.page.checkedRowKeys.value"
  />
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { computed, h } from 'vue'
import { useAnalysisTableModule } from '../hooks'
import type { AnalysisTableItem, AnalysisTableType } from '../types'

const props = defineProps<{
  type: AnalysisTableType
}>()

const module = useAnalysisTableModule(props.type)

const renderScore = (value: number) => {
  const isPositive = value > 0
  const isNegative = value < 0
  const text = isPositive ? `+ ${value}` : String(value)

  return h(
    'span',
    {
      class: [
        'score-tag',
        isPositive && 'score-tag--positive',
        isNegative && 'score-tag--negative',
        !isPositive && !isNegative && 'score-tag--zero'
      ]
    },
    text
  )
}

const baseColumns = computed<DataTableColumns<AnalysisTableItem>>(() => {
  const columns: DataTableColumns<AnalysisTableItem> = [
    {
      type: 'selection',
      width: 56
    }
  ]

  if (module.config.firstColumnTitle) {
    columns.push({
      title: module.config.firstColumnTitle,
      key: 'mainName',
      width: 180,
      ellipsis: { tooltip: true },
      render(row) {
        return row.name || row.departmentName || '-'
      }
    })
  }

  if (module.config.showJobNo) {
    columns.push({
      title: '工号',
      key: 'jobNo',
      width: 120
    })
  }

  if (module.config.showDepartment) {
    columns.push({
      title: '科室',
      key: 'departmentName',
      width: 160,
      ellipsis: { tooltip: true }
    })
  }

  if (module.config.showPersonCount) {
    columns.push({
      title: '人数',
      key: 'personCount',
      width: 120
    })
  }

  columns.push(
    {
      title: props.type === 'person' ? '考核分' : '总加分',
      key: 'totalPlus',
      width: 120,
      render(row) {
        return renderScore(row.totalPlus)
      }
    },
    {
      title: props.type === 'person' ? '小计' : '总减分',
      key: 'totalMinus',
      width: 120,
      render(row) {
        return renderScore(row.totalMinus)
      }
    },
    {
      title: props.type === 'person' ? '考核加分' : '加分人次',
      key: 'plusGroup',
      align: 'center',
      children: [
        {
          title: '小计',
          key: 'plusTotal',
          width: 120,
          render(row) {
            return renderScore(row.plusTotal)
          }
        },
        {
          title: '优秀行为',
          key: 'excellentBehavior',
          width: 120
        },
        {
          title: '加分',
          key: 'plusScore',
          width: 120
        }
      ]
    },
    {
      title: props.type === 'person' ? '考核减分' : '减分人次',
      key: 'minusGroup',
      align: 'center',
      children: [
        {
          title: '小计',
          key: 'minusTotal',
          width: 120,
          render(row) {
            return renderScore(row.minusTotal)
          }
        },
        {
          title: '患者投诉',
          key: 'patientComplaint',
          width: 120
        },
        {
          title: '违反九项准则',
          key: 'rulesViolation',
          width: 140
        },
        {
          title: '迟到',
          key: 'late',
          width: 120
        },
        {
          title: '违反工作纪律',
          key: 'disciplineViolation',
          width: 140
        }
      ]
    }
  )

  if (module.config.showAmount) {
    columns.push({
      title: '金额',
      key: 'amount',
      width: 120
    })
  }

  return columns
})

const columns = baseColumns
</script>

<style scoped lang="scss">
:deep(.score-tag) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  line-height: 1;
}

:deep(.score-tag--positive) {
  color: #ff4d4f;
  background: #fff1f0;
  border: 1px solid #ff7875;
}

:deep(.score-tag--negative) {
  color: #52c41a;
  background: #f6ffed;
  border: 1px solid #95de64;
}

:deep(.score-tag--zero) {
  color: #fa8c16;
  background: #fff7e6;
  border: 1px solid #ffc069;
}
</style>
