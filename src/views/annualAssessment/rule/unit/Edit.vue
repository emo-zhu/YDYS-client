<template>
  <n-modal
    v-model:show="module.editModal.status"
    preset="card"
    title="编辑"
    style="width: 960px"
    :mask-closable="false"
    @after-leave="onAfterLeave"
  >
    <n-form
      ref="formRef"
      :model="module.unitForm"
      :rules="rules"
      label-placement="left"
      label-width="150"
      class="unit-form"
    >
      <n-form-item label="考评单元名称" path="unitName" required>
        <n-input v-model:value="module.unitForm.unitName" placeholder="请输入" />
      </n-form-item>
      <n-form-item label="科室类型" path="departmentType" required>
        <n-select
          v-model:value="module.unitForm.departmentType"
          :options="module.departmentTypeOptions"
          placeholder="请选择"
          clearable
        />
      </n-form-item>
      <n-form-item label="科室负责人" path="departmentLeader" required>
        <n-select
          v-model:value="module.unitForm.departmentLeader"
          :options="module.userOptions"
          placeholder="请输入两位数及以上才进行搜索"
          filterable
          clearable
        />
      </n-form-item>
      <n-form-item label="党支部书记">
        <n-select
          v-model:value="module.unitForm.branchSecretary"
          :options="module.userOptions"
          placeholder="请输入两位数及以上才进行搜索"
          filterable
          clearable
        />
      </n-form-item>
      <n-form-item label="考评组其他成员">
        <n-select
          v-model:value="module.unitForm.otherMembers"
          :options="module.userOptions"
          placeholder="请输入两位数及以上才进行搜索"
          filterable
          multiple
          clearable
        />
      </n-form-item>
      <n-form-item label="审核用户">
        <n-select
          v-model:value="module.unitForm.auditUser"
          :options="module.userOptions"
          placeholder="请选择"
          filterable
          clearable
        />
      </n-form-item>
      <n-form-item label="包含科室" path="includedDepartments" required>
        <n-select
          v-model:value="module.unitForm.includedDepartments"
          :options="module.departmentOptions"
          placeholder="请选择"
          multiple
          clearable
        />
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

const module = useAnnualRuleModule('unit')
const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  unitName: { required: true, message: '请输入考评单元名称', trigger: 'submit' },
  departmentType: { required: true, message: '请选择科室类型', trigger: 'submit' },
  departmentLeader: { required: true, message: '请选择科室负责人', trigger: 'submit' },
  includedDepartments: {
    type: 'array',
    required: true,
    message: '请选择包含科室',
    trigger: 'submit'
  }
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
.unit-form {
  padding: 24px 24px 8px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
