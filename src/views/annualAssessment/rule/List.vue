<template>
  <page :page-tabs="[{ label: '年度考评规则', value: '1' }]">
    <page-body>
      <page-body-header v-model:value="tabValue" @tabs-click="onTabChange">
        <AnnualRuleToolbar :key="tabValue" :type="tabValue" />
      </page-body-header>
      <page-body-container>
        <tab-panel-item label="考评表" value="table">
          <AssessmentTableList embedded />
        </tab-panel-item>
        <tab-panel-item label="考评单元" value="unit">
          <AssessmentUnitList embedded />
        </tab-panel-item>
        <tab-panel-item label="考评等级" value="grade">
          <AssessmentGradeList embedded />
        </tab-panel-item>
      </page-body-container>
      <page-body-footer>
        <AnnualRulePagination :type="tabValue" />
      </page-body-footer>
    </page-body>
  </page>

  <AssessmentTableAdd />
  <AssessmentTableEdit />
  <AssessmentUnitAdd />
  <AssessmentUnitEdit />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AssessmentGradeList from './grade/List.vue'
import AnnualRulePagination from './shared/components/AnnualRulePagination.vue'
import AnnualRuleToolbar from './shared/components/AnnualRuleToolbar.vue'
import type { AnnualRuleType } from './shared/types'
import AssessmentTableAdd from './table/Add.vue'
import AssessmentTableEdit from './table/Edit.vue'
import AssessmentTableList from './table/List.vue'
import AssessmentUnitAdd from './unit/Add.vue'
import AssessmentUnitEdit from './unit/Edit.vue'
import AssessmentUnitList from './unit/List.vue'

const tabValue = ref<AnnualRuleType>('table')

const onTabChange = (value: string) => {
  tabValue.value = value as AnnualRuleType
}
</script>
