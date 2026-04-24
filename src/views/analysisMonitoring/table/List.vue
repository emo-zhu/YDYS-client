<template>
  <page :page-tabs="[{ label: '分析表', value: '1' }]">
    <page-body>
      <page-body-header v-model:value="tabValue" @tabs-click="onTabChange">
        <AnalysisTableToolbar :key="tabValue" :type="tabValue" />
      </page-body-header>
      <page-body-container>
        <tab-panel-item label="人员分析" value="person">
          <PersonList embedded />
        </tab-panel-item>
        <tab-panel-item label="科室分析" value="department">
          <DepartmentList embedded />
        </tab-panel-item>
        <tab-panel-item label="管理分析" value="management">
          <ManagementList embedded />
        </tab-panel-item>
        <tab-panel-item label="全院分析" value="hospital">
          <HospitalList embedded />
        </tab-panel-item>
      </page-body-container>
      <page-body-footer>
        <AnalysisTablePagination :type="tabValue" />
      </page-body-footer>
    </page-body>
  </page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DepartmentList from './department/List.vue'
import HospitalList from './hospital/List.vue'
import ManagementList from './management/List.vue'
import PersonList from './person/List.vue'
import AnalysisTablePagination from './shared/components/AnalysisTablePagination.vue'
import AnalysisTableToolbar from './shared/components/AnalysisTableToolbar.vue'
import type { AnalysisTableType } from './shared/types'

const tabValue = ref<AnalysisTableType>('person')

const onTabChange = (value: string) => {
  tabValue.value = value as AnalysisTableType
}
</script>
