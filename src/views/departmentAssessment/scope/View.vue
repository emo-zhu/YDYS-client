<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="科室考评范围详情"
    style="width: 760px"
    :mask-closable="false"
  >
    <DepartmentAssessmentScopeDetail :model="scopeDetail.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="scopeDetail.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import DepartmentAssessmentScopeDetail from './components/DepartmentAssessmentScopeDetail.vue'
import { useDepartmentAssessmentScopeModule } from './src/hooks/scope'
import { viewModal } from './src/service/scope'

const { scopeDetail } = useDepartmentAssessmentScopeModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
