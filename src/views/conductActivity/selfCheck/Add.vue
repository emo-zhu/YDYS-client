<template>
  <n-modal
    v-model:show="addModal.status"
    preset="card"
    title="新增自查自纠报告"
    style="width: 720px"
    :mask-closable="false"
  >
    <SelfCheckForm ref="formRef" v-model="selfCheckSave.form" />
    <template #footer>
      <div class="editor-footer">
        <n-button @click="selfCheckSave.closeAdd()">取消</n-button>
        <n-button type="info" :loading="selfCheckSave.loading.value" @click="onSave">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SelfCheckForm from './components/SelfCheckForm.vue'
import { useSelfCheckModule } from './src/hooks/selfCheck'
import { addModal } from './src/service/selfCheck'

const { selfCheckSave } = useSelfCheckModule()
const formRef = ref<{ getData: () => Promise<unknown> } | null>(null)

const onSave = () => {
  formRef.value?.getData().then(() => {
    selfCheckSave.saveOne().then((success) => {
      if (success) {
        selfCheckSave.closeAdd()
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
