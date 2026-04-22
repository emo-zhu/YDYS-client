<template>
  <page
    v-if="!embedded"
    :page-tabs="[{ label: module.config.title, value: '1' }]"
  >
    <page-body>
      <page-body-header class="meeting-header">
        <WorkMeetingToolbar :type="type" />
      </page-body-header>
      <page-body-container>
        <WorkMeetingTable :type="type" />
      </page-body-container>
    </page-body>
  </page>
  <div v-else class="meeting-embedded">
    <div class="meeting-embedded__header meeting-header">
      <WorkMeetingToolbar :type="type" />
    </div>
    <div class="meeting-embedded__container">
      <WorkMeetingTable :type="type" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useWorkMeetingModule } from "../hooks";
import type { WorkMeetingType } from "../types";
import WorkMeetingTable from "./WorkMeetingTable.vue";
import WorkMeetingToolbar from "./WorkMeetingToolbar.vue";

const props = defineProps<{
  type: WorkMeetingType;
  embedded?: boolean;
}>();

const { type, embedded } = props;
const module = useWorkMeetingModule(type);

onMounted(() => {
  module.page.getPage();
});
</script>

<style scoped lang="scss">
.meeting-header {
  display: block;
}

.meeting-embedded {
  display: grid;
  gap: 0;
}

.meeting-embedded__container {
  min-width: 0;
  padding-top: 16px;
}
</style>
