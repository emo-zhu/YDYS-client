<template>
  <n-modal
    v-model:show="module.editModal.status"
    preset="card"
    title="编辑考评表"
    style="width: 780px"
    :mask-closable="false"
    @after-leave="onAfterLeave"
  >
    <n-form
      ref="formRef"
      :model="module.tableForm"
      :rules="rules"
      label-placement="left"
      label-width="130"
      class="table-form"
    >
      <n-form-item label="考评表名称" path="name" required>
        <n-input v-model:value="module.tableForm.name" placeholder="请输入考评表名称" />
      </n-form-item>
    </n-form>
    <template #footer>
      <div class="editor-footer">
        <n-button @click="module.closeEdit">取消</n-button>
        <n-button type="info" @click="onSave">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { ref } from 'vue'
import { useAnnualRuleModule } from '../shared/hooks'

const module = useAnnualRuleModule('table')
const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  name: { required: true, message: '请输入考评表名称', trigger: 'submit' }
}

const onSave = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      module.saveEdit()
    }
  })
}

const onAfterLeave = () => {
  formRef.value?.restoreValidation()
  module.closeEdit()
}
</script>

<style scoped lang="scss">
.table-form {
  padding: 24px 24px 56px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
