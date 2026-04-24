<template>
  <page :page-tabs="[{ label: '分析图', value: '1' }]">
    <page-body>
      <page-body-container>
        <n-spin :show="chartPage.loading.value">
          <div class="chart-grid">
            <ChartCard
              v-for="card in chartPage.visibleCards.value"
              :key="card.id"
              :card="card"
            />
          </div>
        </n-spin>
      </page-body-container>
    </page-body>
  </page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import ChartCard from './components/ChartCard.vue'
import { useAnalysisChartPage } from './src/hooks/chart'

const chartPage = useAnalysisChartPage()

onMounted(() => {
  chartPage.loadCharts()
})
</script>

<style scoped lang="scss">
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 12px;
}

@media (max-width: 960px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
