<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="科室考评表详情"
    style="width: 880px"
    :mask-closable="false"
  >
    <DepartmentAssessmentTableDetail :model="tableDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="tableDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import DepartmentAssessmentTableDetail from './components/DepartmentAssessmentTableDetail.vue'
import { useDepartmentAssessmentTableModule } from './src/hooks/table'
import { viewModal } from './src/service/table'

const { tableDetail } = useDepartmentAssessmentTableModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
