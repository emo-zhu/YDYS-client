<template>
  <div class="detail-panel">
    <div class="detail-panel__content">
      <h3 class="detail-panel__heading">{{ model?.title || '医务人员廉洁行医承诺书' }}</h3>
      <div class="detail-panel__body">
        <p v-for="(paragraph, index) in paragraphs" :key="index" class="detail-panel__paragraph">
          {{ paragraph }}
        </p>
      </div>
    </div>

    <div class="signature-block">
      <div class="signature-block__header">个人签字</div>
      <div class="signature-preview">
        <span class="signature-preview__name">{{ currentSignature || '待签字' }}</span>
      </div>
      <div v-if="!readonly" class="signature-input">
        <span class="signature-input__label">电子签名：</span>
        <n-input
          v-model:value="signatureValue"
          placeholder="请输入姓名作为电子签名"
          maxlength="20"
          clearable
        />
      </div>
      <div v-else class="signature-time">
        签署时间：{{ model?.signedAt || '-' }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PersonalCommitmentItem } from '../src/types/personalCommitment'

const props = defineProps<{
  model?: PersonalCommitmentItem
  signatureName?: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:signatureName', value: string): void
}>()

const paragraphs = computed(() => props.model?.content || [])
const currentSignature = computed(() => props.signatureName || props.model?.signatureName || '')
const signatureValue = computed({
  get: () => props.signatureName || '',
  set: (value: string) => {
    emit('update:signatureName', value)
  }
})
</script>

<style scoped lang="scss">
.detail-panel {
  display: grid;
  gap: 24px;
}

.detail-panel__content {
  padding: 24px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fff;
}

.detail-panel__heading {
  margin: 0 0 20px;
  color: #303133;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

.detail-panel__body {
  display: grid;
  gap: 14px;
}

.detail-panel__paragraph {
  margin: 0;
  color: #303133;
  font-size: 15px;
  line-height: 1.85;
  text-indent: 2em;
  white-space: pre-wrap;
}

.signature-block {
  padding: 20px 24px 24px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fff;
}

.signature-block__header {
  margin-bottom: 16px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.signature-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 108px;
  margin-bottom: 16px;
  border: 1px dashed #c0c4cc;
  border-radius: 6px;
  background: #f8fafc;
}

.signature-preview__name {
  color: #1f2329;
  font-family: 'KaiTi', 'STKaiti', serif;
  font-size: 34px;
  line-height: 1;
}

.signature-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.signature-input__label {
  flex-shrink: 0;
  color: #606266;
  font-size: 14px;
}

.signature-time {
  color: #606266;
  font-size: 14px;
  text-align: right;
}
</style>
