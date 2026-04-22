<template>
  <n-modal
    v-model:show="viewModal.status"
    preset="card"
    title="查看"
    style="width: 760px"
    :mask-closable="false"
  >
    <ResultReviewDetail :info="resultReviewView.info.value" />
    <template #footer>
      <div class="view-footer">
        <n-button @click="resultReviewView.closeView()">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import ResultReviewDetail from './components/ResultReviewDetail.vue'
import { useResultReviewModule } from './src/hooks/resultReview'
import { viewModal } from './src/service/resultReview'

const { resultReviewView } = useResultReviewModule()
</script>

<style scoped lang="scss">
.view-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
