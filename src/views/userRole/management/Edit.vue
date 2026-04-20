<template>
  <n-modal
    v-model:show="editModal.status"
    preset="card"
    :title="userSave.editorTitle.value"
    style="width: 560px"
    :mask-closable="false"
  >
    <UserForm ref="formRef" v-model="userSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="userSave.closeEdit()">取消</n-button>
        <n-button type="info" :loading="userSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UserForm from './components/UserForm.vue'
import { useUserModule } from './src/hooks/user'
import { editModal } from './src/service/user'

const { userSave } = useUserModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    userSave.saveOne().then((success) => {
      if (success) {
        userSave.closeEdit()
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
