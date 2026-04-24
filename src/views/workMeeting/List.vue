<template>
  <page :page-tabs="[{ label: '行风工作会议', value: '1' }]">
    <page-body>
      <page-body-header v-model:value="tabValue" @tabs-click="onTabChange">
        <WorkMeetingToolbar :key="tabValue" :type="tabValue" />
      </page-body-header>
      <page-body-container>
        <tab-panel-item label="月度工作会议" value="monthly">
          <MonthlyList embedded />
        </tab-panel-item>
        <tab-panel-item label="季度工作会议" value="quarterly">
          <QuarterlyList embedded />
        </tab-panel-item>
        <tab-panel-item label="半年度工作会议" value="semiAnnual">
          <SemiAnnualList embedded />
        </tab-panel-item>
        <tab-panel-item label="年度工作会议" value="annual">
          <AnnualList embedded />
        </tab-panel-item>
      </page-body-container>
      <page-body-footer>
        <WorkMeetingPagination :type="tabValue" />
      </page-body-footer>
    </page-body>

    <MonthlyAdd />
    <MonthlyEdit />
    <MonthlyView />

    <QuarterlyAdd />
    <QuarterlyEdit />
    <QuarterlyView />

    <SemiAnnualAdd />
    <SemiAnnualEdit />
    <SemiAnnualView />

    <AnnualAdd />
    <AnnualEdit />
    <AnnualView />
  </page>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import AnnualAdd from "./annual/Add.vue";
import AnnualEdit from "./annual/Edit.vue";
import AnnualList from "./annual/List.vue";
import AnnualView from "./annual/View.vue";
import MonthlyAdd from "./monthly/Add.vue";
import MonthlyEdit from "./monthly/Edit.vue";
import MonthlyList from "./monthly/List.vue";
import MonthlyView from "./monthly/View.vue";
import QuarterlyAdd from "./quarterly/Add.vue";
import QuarterlyEdit from "./quarterly/Edit.vue";
import QuarterlyList from "./quarterly/List.vue";
import QuarterlyView from "./quarterly/View.vue";
import SemiAnnualAdd from "./semiAnnual/Add.vue";
import SemiAnnualEdit from "./semiAnnual/Edit.vue";
import SemiAnnualList from "./semiAnnual/List.vue";
import SemiAnnualView from "./semiAnnual/View.vue";
import WorkMeetingPagination from "./shared/components/WorkMeetingPagination.vue";
import WorkMeetingToolbar from "./shared/components/WorkMeetingToolbar.vue";
import type { WorkMeetingType } from "./shared/types";

const tabValue = ref<WorkMeetingType>("monthly");

const onTabChange = (value: string) => {
  tabValue.value = value as WorkMeetingType;
};
</script>
