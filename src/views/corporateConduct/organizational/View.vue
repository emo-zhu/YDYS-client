<template>
  <n-modal
    v-model:show="organizationalModal.viewModal.status"
    preset="card"
    title="考评单元详情"
    class="editor-modal"
    style="width: 620px"
    :mask-closable="false"
  >
    <DepartmentDetail :model="organizationalView.viewDepartment.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="organizationalView.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import DepartmentDetail from './components/DepartmentDetail.vue'
import { useOrganizationalModule } from './src/hooks/organizational'

const { organizationalView, organizationalModal } = useOrganizationalModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
