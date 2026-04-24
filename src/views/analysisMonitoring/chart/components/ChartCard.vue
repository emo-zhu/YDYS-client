<template>
  <div class="chart-card">
    <template v-if="card.kind !== 'empty'">
      <div class="chart-card__header">
        <div class="chart-card__title">{{ card.title }}</div>
        <button
          v-if="hasAction('setting')"
          class="chart-card__icon"
          type="button"
          @click="emit('setting', card)"
        >
          ⚙
        </button>
      </div>
      <div v-if="card.legend?.length" class="chart-card__legend">
        <span v-for="item in card.legend" :key="item.name" class="legend-item">
          <i :style="{ backgroundColor: item.color }" />
          {{ item.name }}
        </span>
      </div>
      <div class="chart-card__body">
        <BarChart v-if="card.kind === 'bar'" :items="card.bars || []" />
        <DonutChart v-else-if="card.kind === 'donut'" :items="card.donut || []" />
        <LineChart
          v-else-if="card.kind === 'line'"
          :x-axis="card.xAxis || []"
          :series="card.lines || []"
        />
      </div>
      <button
        v-if="hasAction('download')"
        class="chart-card__download"
        type="button"
        @click="emit('download', card)"
      >
        ⇩
      </button>
    </template>
    <n-empty v-else description="暂无数据" class="chart-card__empty" />
  </div>
</template>

<script lang="ts" setup>
import type { AnalysisChartCard } from '../src/types/chart'
import BarChart from './charts/BarChart.vue'
import DonutChart from './charts/DonutChart.vue'
import LineChart from './charts/LineChart.vue'

const props = defineProps<{
  card: AnalysisChartCard
}>()

const emit = defineEmits<{
  setting: [card: AnalysisChartCard]
  download: [card: AnalysisChartCard]
}>()

const hasAction = (type: 'setting' | 'download') =>
  props.card.actions.some((action) => action.type === type)
</script>

<style scoped lang="scss">
.chart-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 360px;
  padding: 16px 18px;
  background: #fff;
  border-radius: 6px;
}

.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chart-card__title {
  color: #1683ff;
  font-size: 16px;
  font-weight: 600;
}

.chart-card__icon,
.chart-card__download {
  padding: 0;
  color: #8c8c8c;
  font-size: 20px;
  line-height: 1;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.chart-card__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 18px;
  padding-right: 34px;
  color: #606266;
  font-size: 14px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-item i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.chart-card__body {
  flex: 1;
  min-height: 290px;
  margin-top: 12px;
}

.chart-card__download {
  position: absolute;
  right: 16px;
  top: 58px;
  font-size: 24px;
}

.chart-card__empty {
  height: 100%;
  min-height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
