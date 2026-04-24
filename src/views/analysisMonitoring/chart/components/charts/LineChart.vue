<template>
  <div class="line-chart">
    <svg :viewBox="`0 0 ${width} ${height}`" class="line-chart__svg">
      <line
        v-for="tick in yTicks"
        :key="tick"
        :x1="padding.left"
        :x2="width - padding.right"
        :y1="getY(tick)"
        :y2="getY(tick)"
        stroke="#e4eaf4"
      />
      <text
        v-for="tick in yTicks"
        :key="`label-${tick}`"
        :x="padding.left - 12"
        :y="getY(tick) + 4"
        text-anchor="end"
        fill="#8c8c8c"
        font-size="12"
      >
        {{ tick }}
      </text>
      <g v-for="line in series" :key="line.name">
        <polyline
          :points="getPoints(line.values)"
          fill="none"
          :stroke="line.color"
          stroke-width="2"
        />
        <circle
          v-for="(value, index) in line.values"
          :key="`${line.name}-${index}`"
          :cx="getX(index)"
          :cy="getY(value)"
          r="3"
          fill="#fff"
          :stroke="line.color"
          stroke-width="2"
        />
        <text
          v-for="(value, index) in line.values"
          :key="`${line.name}-text-${index}`"
          :x="getX(index)"
          :y="getY(value) - 8"
          text-anchor="middle"
          fill="#606266"
          font-size="12"
        >
          {{ value }}
        </text>
      </g>
      <text
        v-for="(label, index) in xAxis"
        :key="label"
        :x="getX(index)"
        :y="height - 10"
        text-anchor="middle"
        fill="#8c8c8c"
        font-size="12"
      >
        {{ label }}
      </text>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { LineChartSeries } from '../../src/types/chart'

const props = defineProps<{
  xAxis: string[]
  series: LineChartSeries[]
}>()

const width = 520
const height = 280
const padding = { top: 20, right: 18, bottom: 34, left: 52 }
const maxValue = computed(() => Math.max(500, ...props.series.flatMap((line) => line.values)))
const yTicks = computed(() => {
  const step = Math.ceil(maxValue.value / 5 / 100) * 100
  return Array.from({ length: 6 }, (_, index) => step * (5 - index))
})

const getX = (index: number) => {
  const count = Math.max(1, props.xAxis.length - 1)
  return padding.left + ((width - padding.left - padding.right) / count) * index
}

const getY = (value: number) => {
  const drawableHeight = height - padding.top - padding.bottom
  return padding.top + drawableHeight - (value / yTicks.value[0]) * drawableHeight
}

const getPoints = (values: number[]) => values.map((value, index) => `${getX(index)},${getY(value)}`).join(' ')
</script>

<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 100%;
}

.line-chart__svg {
  width: 100%;
  height: 100%;
}
</style>
