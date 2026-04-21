<template>
  <WorkMeetingListPage type="monthly" />
  <Add />
  <Edit />
  <View />
</template>

<script lang="ts" setup>
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import WorkMeetingListPage from '../shared/components/WorkMeetingListPage.vue'
</script>
