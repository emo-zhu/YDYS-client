<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="科室考评项目详情"
    style="width: 820px"
    :mask-closable="false"
  >
    <DepartmentAssessmentItemDetail :model="itemDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="itemDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import DepartmentAssessmentItemDetail from './components/DepartmentAssessmentItemDetail.vue'
import { useDepartmentAssessmentItemModule } from './src/hooks/item'
import { viewModal } from './src/service/item'

const { itemDetail } = useDepartmentAssessmentItemModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
