<template>
  <n-modal
    v-model:show="addModal.status"
    preset="card"
    title="新增全员医德档案"
    style="width: 760px"
    :mask-closable="false"
  >
    <StaffArchiveForm ref="formRef" v-model="archiveSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="archiveSave.closeAdd()">取消</n-button>
        <n-button type="info" :loading="archiveSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StaffArchiveForm from './components/StaffArchiveForm.vue'
import { useStaffArchiveModule } from './src/hooks/archive'
import { addModal } from './src/service/archive'

const { archiveSave } = useStaffArchiveModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    archiveSave.saveOne().then((success) => {
      if (success) {
        archiveSave.closeAdd()
      }
    })
  })
}
</script>

<style scoped lang="scss">
.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
