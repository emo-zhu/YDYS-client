<template>
  <div class="bar-chart">
    <div class="bar-chart__plot">
      <div v-for="item in items" :key="item.name" class="bar-row">
        <div class="bar-row__name">{{ item.name }}</div>
        <div class="bar-row__track">
          <div class="bar-row__bar" :style="{ width: `${getPercent(item.value)}%` }">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="bar-chart__axis">
      <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BarChartItem } from '../../src/types/chart'

const props = defineProps<{
  items: BarChartItem[]
}>()

const maxValue = computed(() => Math.max(12, ...props.items.map((item) => item.value)))
const ticks = [0, 2, 4, 6, 8, 10, 12]
const getPercent = (value: number) => Math.max(2, Math.round((value / maxValue.value) * 100))
</script>

<style scoped lang="scss">
.bar-chart {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  color: #606266;
}

.bar-chart__plot {
  display: grid;
  gap: 28px;
  padding: 18px 10px 8px 0;
}

.bar-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  gap: 10px;
}

.bar-row__name {
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-row__track {
  position: relative;
  height: 44px;
  background: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc(16.66% - 1px),
    #e4eaf4 calc(16.66% - 1px),
    #e4eaf4 16.66%
  );
  border-left: 1px solid #8c96a6;
}

.bar-row__bar {
  height: 100%;
  padding-left: 8px;
  overflow: hidden;
  color: #fff;
  font-size: 13px;
  line-height: 44px;
  white-space: nowrap;
  background: #1e90ff;
}

.bar-chart__axis {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-left: 102px;
  color: #8c8c8c;
}
</style>
