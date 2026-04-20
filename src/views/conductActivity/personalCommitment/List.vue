<template>
  <page :page-tabs="[{ label: '个人承诺书', value: '1' }]">
    <page-body>
      <page-body-container class="personal-commitment-page">
        <PersonalCommitmentCard
          :model="personalCommitmentPage.info.value"
          :loading="personalCommitmentPage.loading.value"
          @sign="personalCommitmentPage.openEdit"
        />
      </page-body-container>
    </page-body>

    <Add />
    <Edit />
    <View />
  </page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Add from './Add.vue'
import Edit from './Edit.vue'
import View from './View.vue'
import PersonalCommitmentCard from './components/PersonalCommitmentCard.vue'
import { usePersonalCommitmentModule } from './src/hooks/personalCommitment'

const { personalCommitmentPage } = usePersonalCommitmentModule()

onMounted(() => {
  personalCommitmentPage.loadCurrent()
})
</script>

<style scoped lang="scss">
.personal-commitment-page {
  padding: 8px 6px 4px;
}
</style>
