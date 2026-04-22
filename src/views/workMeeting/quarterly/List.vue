<template>
  <WorkMeetingListPage type="quarterly" :embedded="embedded" />
  <template v-if="!embedded">
    <Add />
    <Edit />
    <View />
  </template>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    embedded?: boolean
  }>(),
  {
    embedded: false
  }
)

import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import WorkMeetingListPage from '../shared/components/WorkMeetingListPage.vue'
</script>
