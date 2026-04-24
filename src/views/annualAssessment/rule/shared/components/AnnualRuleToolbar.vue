<template>
  <div class="annual-rule-toolbar">
    <template v-if="type === 'unit'">
      <j-search
        v-model:value="module.query.keywords"
        placeholder="请输入考评单元名称"
        @search="module.onSearch"
        :reset="true"
        @reset="module.onReset"
        class="annual-rule-toolbar__search"
      />
      <div class="annual-rule-toolbar__actions">
        <j-button type="info" round @click="module.openAdd">新增</j-button>
        <j-button type="info" round @click="module.onTodo('导出')">导出</j-button>
      </div>
    </template>

    <template v-else-if="type === 'grade'">
      <div class="annual-rule-toolbar__grade">
        <div class="annual-rule-toolbar__grade-info">
          <span class="annual-rule-toolbar__title">考评等级划分</span>
          <span class="annual-rule-toolbar__tips">
            注意：各考评等级的分值区间不得重叠，否则考评等级核定将会出错！
          </span>
        </div>
        <div class="annual-rule-toolbar__actions">
          <j-button round disabled @click="module.onTodo('新增')">新增</j-button>
        </div>
      </div>
    </template>

    <template v-else>
      <j-search
        v-model:value="module.query.keywords"
        placeholder="请输入考评表名称"
        @search="module.onSearch"
        :reset="true"
        @reset="module.onReset"
        class="annual-rule-toolbar__search"
      />
      <div class="annual-rule-toolbar__actions">
        <j-button type="info" round @click="module.openAdd">新增</j-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useAnnualRuleModule } from '../hooks'
import type { AnnualRuleType } from '../types'

const props = defineProps<{
  type: AnnualRuleType
}>()

const module = useAnnualRuleModule(props.type)
</script>

<style scoped lang="scss">
.annual-rule-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.annual-rule-toolbar__search {
  width: 680px;
  max-width: 100%;
  flex-shrink: 0;
}

.annual-rule-toolbar__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-left: auto;
  flex-shrink: 0;
  white-space: nowrap;
}

.annual-rule-toolbar__grade {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.annual-rule-toolbar__grade-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.annual-rule-toolbar__title {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.annual-rule-toolbar__tips {
  color: #f5222d;
  font-size: 14px;
  white-space: nowrap;
}

@media (max-width: 1280px) {
  .annual-rule-toolbar,
  .annual-rule-toolbar__grade {
    align-items: stretch;
    flex-direction: column;
  }

  .annual-rule-toolbar__actions {
    margin-left: 0;
  }

  .annual-rule-toolbar__grade-info {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
