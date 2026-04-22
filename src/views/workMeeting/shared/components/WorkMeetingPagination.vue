<template>
  <j-pagination
    v-model:page-query="module.page.query"
    :page-data="module.page.pageData.value"
    :page-sizes="[
      { label: '每页显示10行', value: 10 },
      { label: '每页显示20行', value: 20 },
      { label: '每页显示100行', value: 100 },
      { label: '每页显示500行', value: 500 },
      { label: '每页显示1000行', value: 1000 },
      { label: '每页显示2000行', value: 2000 },
    ]"
    @load-page="module.page.loadPage"
    :init="false"
  />
</template>

<script lang="ts" setup>
import { useWorkMeetingModule } from "../hooks";
import type { WorkMeetingType } from "../types";

const props = defineProps<{
  type: WorkMeetingType;
}>();

const module = useWorkMeetingModule(props.type);
</script>
