<template>
  <n-modal v-model:show="viewModal.status" preset="card" title="用户详情" style="width: 560px" :mask-closable="false">
    <UserDetail :model="userView.info.value" />
    <template #footer>
      <div class="editor-footer">
        <n-button type="info" @click="userView.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import UserDetail from './components/UserDetail.vue'
import { useUserModule } from './src/hooks/user'
import { viewModal } from './src/service/user'

const { userView } = useUserModule()
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
